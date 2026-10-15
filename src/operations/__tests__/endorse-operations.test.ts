import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import LinkedApi from '../../index';

const PERSON_URL = 'https://www.linkedin.com/in/example-person' as const;
const WORKFLOW_ID = 'endorsement-workflow' as const;
const PATTERNS = ['project\\s*manage', '^scrum$', 'business'] as const;

let fetchMock: jest.SpiedFunction<typeof fetch>;
let linkedApi: LinkedApi;

beforeEach((): void => {
  fetchMock = jest
    .spyOn(globalThis, 'fetch')
    .mockRejectedValue(new Error('Unexpected HTTP request'));
  linkedApi = new LinkedApi({
    linkedApiToken: 'test-linked-api-token',
    identificationToken: 'test-identification-token',
    baseUrl: 'https://api.test',
  });
});

afterEach((): void => {
  jest.restoreAllMocks();
});

function queueWorkflow(completion: unknown): void {
  fetchMock.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        success: true,
        result: { workflowId: WORKFLOW_ID,
workflowStatus: 'pending' },
      }),
    ),
  );
  fetchMock.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        success: true,
        result: { workflowStatus: 'completed',
completion },
      }),
    ),
  );
}

function postedWorkflow(): unknown {
  const request = fetchMock.mock.calls[0];
  expect(request?.[0]).toBe('https://api.test/workflows');
  expect(request?.[1]?.method).toBe('POST');
  return JSON.parse(String(request?.[1]?.body));
}

function skillsCompletion(skills: Array<Record<string, unknown>>): Record<string, unknown> {
  return {
    actionType: 'st.openPersonPage',
    success: true,
    data: {
      then: {
        actionType: 'st.retrievePersonSkills',
        success: true,
        data: skills,
      },
    },
  };
}

describe('endorsePersonSkill', (): void => {
  it('posts one root action and returns no data or errors on success', async (): Promise<void> => {
    queueWorkflow({ actionType: 'st.endorsePersonSkill',
success: true });

    const started = await linkedApi.endorsePersonSkill.execute({
      personUrl: PERSON_URL,
      skillName: 'Project Management',
    });
    const result = await linkedApi.endorsePersonSkill.result(started.workflowId);

    expect(linkedApi.endorsePersonSkill.operationName).toBe('endorsePersonSkill');
    expect(postedWorkflow()).toEqual({
      actionType: 'st.endorsePersonSkill',
      personUrl: PERSON_URL,
      skillName: 'Project Management',
    });
    expect(result.data).toBeUndefined();
    expect(result.errors).toEqual([]);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(`https://api.test/workflows/${WORKFLOW_ID}`);
  });

  it.each([
    'personNotFound',
    'connectionNotFound',
    'skillNotFound',
    'endorsementUnavailable',
    'limitExceeded',
  ])('preserves the %s action error', async (type): Promise<void> => {
    const error = { type,
message: `Fixture ${type}` };
    queueWorkflow({ actionType: 'st.endorsePersonSkill',
success: false,
error });

    const started = await linkedApi.endorsePersonSkill.execute({
      personUrl: PERSON_URL,
      skillName: 'Project Management',
    });
    const result = await linkedApi.endorsePersonSkill.result(started.workflowId);

    expect(result.data).toBeUndefined();
    expect(result.errors).toEqual([error]);
  });
});

describe('endorsePersonSkills', (): void => {
  it('posts the pattern workflow and maps only selected skills in profile order', async (): Promise<void> => {
    const unavailable = { type: 'endorsementUnavailable',
message: 'Fixture unavailable' };
    const disconnected = { type: 'connectionNotFound',
message: 'Fixture disconnected' };
    queueWorkflow(
      skillsCompletion([
        {
          name: 'Project Management',
          then: [{ actionType: 'st.endorsePersonSkill',
success: true }],
        },
        { name: 'Python' },
        {
          name: 'Business Strategy',
          then: [{ actionType: 'st.endorsePersonSkill',
success: false,
error: unavailable }],
        },
        {
          name: 'Scrum',
          then: [{ actionType: 'st.endorsePersonSkill',
success: false,
error: disconnected }],
        },
      ]),
    );

    const started = await linkedApi.endorsePersonSkills.execute({
      personUrl: PERSON_URL,
      skillNamePatterns: [...PATTERNS],
    });
    const result = await linkedApi.endorsePersonSkills.result(started.workflowId);

    expect(linkedApi.endorsePersonSkills.operationName).toBe('endorsePersonSkills');
    expect(postedWorkflow()).toEqual({
      actionType: 'st.openPersonPage',
      personUrl: PERSON_URL,
      basicInfo: false,
      then: {
        actionType: 'st.retrievePersonSkills',
        then: {
          actionType: 'st.doForSkills',
          skillNamePatterns: [...PATTERNS],
          then: { actionType: 'st.endorsePersonSkill' },
        },
      },
    });
    expect(result.data).toEqual([
      { skillName: 'Project Management',
success: true },
      { skillName: 'Business Strategy',
success: false,
error: unavailable },
      { skillName: 'Scrum',
success: false,
error: disconnected },
    ]);
    expect(result.errors).toEqual([]);
  });

  it.each([{ personUrl: PERSON_URL }, { personUrl: PERSON_URL,
skillNamePatterns: undefined }])(
    'omits absent patterns and maps every skill for %j',
    async (params): Promise<void> => {
      queueWorkflow(
        skillsCompletion([
          {
            name: 'Business Strategy',
            then: [{ actionType: 'st.endorsePersonSkill',
success: true }],
          },
          { name: 'Python',
then: [{ actionType: 'st.endorsePersonSkill',
success: true }] },
        ]),
      );

      const started = await linkedApi.endorsePersonSkills.execute(params);
      const result = await linkedApi.endorsePersonSkills.result(started.workflowId);

      expect(postedWorkflow()).toEqual({
        actionType: 'st.openPersonPage',
        personUrl: PERSON_URL,
        basicInfo: false,
        then: {
          actionType: 'st.retrievePersonSkills',
          then: { actionType: 'st.doForSkills',
then: { actionType: 'st.endorsePersonSkill' } },
        },
      });
      expect(result.data).toEqual([
        { skillName: 'Business Strategy',
success: true },
        { skillName: 'Python',
success: true },
      ]);
      expect(result.errors).toEqual([]);
    },
  );

  it('keeps limitExceeded on each remaining selected skill', async (): Promise<void> => {
    const error = { type: 'limitExceeded',
message: 'Fixture endorsement cap' };
    queueWorkflow(
      skillsCompletion([
        { name: 'Python',
then: [{ actionType: 'st.endorsePersonSkill',
success: true }] },
        { name: 'Scrum',
then: [{ actionType: 'st.endorsePersonSkill',
success: false,
error }] },
        { name: 'Agile',
then: [{ actionType: 'st.endorsePersonSkill',
success: false,
error }] },
      ]),
    );

    const started = await linkedApi.endorsePersonSkills.execute({ personUrl: PERSON_URL });
    const result = await linkedApi.endorsePersonSkills.result(started.workflowId);

    expect(result.data).toEqual([
      { skillName: 'Python',
success: true },
      { skillName: 'Scrum',
success: false,
error },
      { skillName: 'Agile',
success: false,
error },
    ]);
    expect(result.errors).toEqual([]);
  });

  it.each(['page', 'skills'])(
    'reports a failed %s action as a top-level error',
    async (stage): Promise<void> => {
      const error = { type: 'personNotFound',
message: 'Fixture missing person' };
      const failedAction = {
        actionType: stage === 'page' ? 'st.openPersonPage' : 'st.retrievePersonSkills',
        success: false,
        error,
      };
      queueWorkflow(
        stage === 'page'
          ? failedAction
          : { actionType: 'st.openPersonPage',
success: true,
data: { then: failedAction } },
      );

      const started = await linkedApi.endorsePersonSkills.execute({ personUrl: PERSON_URL });
      const result = await linkedApi.endorsePersonSkills.result(started.workflowId);

      expect(result.data).toBeUndefined();
      expect(result.errors).toEqual([error]);
    },
  );

  it.each([{ skills: [] }, { skills: [{ name: 'Python' }] }])(
    'returns an empty selection for %j',
    async ({ skills }): Promise<void> => {
      queueWorkflow(skillsCompletion(skills));

      const started = await linkedApi.endorsePersonSkills.execute({
        personUrl: PERSON_URL,
        skillNamePatterns: ['^scrum$'],
      });
      const result = await linkedApi.endorsePersonSkills.result(started.workflowId);

      expect(result.data).toEqual([]);
      expect(result.errors).toEqual([]);
    },
  );
});
