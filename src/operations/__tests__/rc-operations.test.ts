import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import LinkedApi, {
  INBOX_TYPE,
  LINKED_API_ACTION_ERROR,
  LINKED_API_ERROR,
  LinkedApiAdmin,
  Operation,
  OPERATION_NAME,
  parseWebhookEvent,
  RC_PROJECT_STAGE,
  TInboxMessage,
  TInboxMessageWebhookEvent,
  TInboxPersonPollResult,
  TLimitCategory,
  TOperationName,
  TRcSearchPeopleFilter,
  TRcSearchPeopleResult,
} from '../../index';

const PERSON_URL = 'https://www.linkedin.com/talent/profile/AEMAAB0xExampleProfileId1' as const;
const PROJECT_ID = '7420000000000000001' as const;
const WORKFLOW_ID = 'rc-workflow' as const;
const PERSON: TRcSearchPeopleResult = {
  name: 'Example Candidate',
  recruiterProfileUrl: PERSON_URL,
  headline: 'Engineer',
  location: 'Berlin',
  avatarUrl: null,
  viewerState: { connectionDegree: '2nd' },
};
const FILTER: TRcSearchPeopleFilter = {
  jobTitles: ['Engineer'],
  jobTitlesScope: 'current',
  locations: ['Berlin'],
  locationsScope: 'currentOrOpenToRelocate',
  postalCode: {
    code: '10115',
    radiusMiles: 25,
  },
  skills: ['TypeScript'],
  hasPassedSkillAssessment: true,
  companies: ['Example'],
  companiesScope: 'pastNotCurrent',
  currentCompanies: ['Current'],
  pastCompanies: ['Previous'],
  companySizes: ['selfEmployed', '1-10', '10001+'],
  schools: ['Example University'],
  graduationYears: {
    from: 2010,
    to: 2020,
  },
  industries: ['Software Development'],
  jobFunctions: ['Engineering'],
  seniority: ['senior'],
  yearsOfExperience: {
    from: 3,
    to: 10,
  },
  firstNames: ['Jane'],
  lastNames: ['Example'],
  profileLanguages: ['en', 'es', 'in', '_o'],
  recentlyJoined: ['1to3months'],
  networkRelationships: ['1st', '2nd', '3rd+', 'groupMembers'],
  isMilitaryVeteran: true,
  groups: ['Engineering'],
  recruitingActivity: {
    type: 'messages',
    period: 'pastWeek',
  },
  projects: ['Engineering hiring'],
  notes: ['TypeScript'],
  hidePreviouslyViewed: true,
};
interface TOperationCase {
  operationName: TOperationName;
  actionType: string;
  params: Record<string, unknown>;
  requestDefaults?: Record<string, unknown>;
  data?: unknown;
}
const CASES: ReadonlyArray<TOperationCase> = [
  {
    operationName: 'rcSearchPeople',
    actionType: 'rc.searchPeople',
    params: {
      term: 'Engineer',
      filter: FILTER,
      limit: 5,
    },
    data: [PERSON],
  },
  {
    operationName: 'rcSearchPeople',
    actionType: 'rc.searchPeople',
    params: { filter: FILTER },
    data: [],
  },
  {
    operationName: 'rcSearchPeople',
    actionType: 'rc.searchPeople',
    params: { customSearchUrl: 'https://www.linkedin.com/talent/search?searchKeyword=Engineer' },
    data: [PERSON],
  },
  {
    operationName: 'rcFetchPerson',
    actionType: 'rc.openPersonPage',
    params: { personUrl: PERSON_URL },
    requestDefaults: {
      basicInfo: true,
      then: [],
    },
    data: {
      ...PERSON,
      publicUrl: 'https://www.linkedin.com/in/example',
      industry: null,
    },
  },
  {
    operationName: 'rcFetchPerson',
    actionType: 'rc.openPersonPage',
    params: {
      personUrl: PERSON_URL,
      basicInfo: false,
      recruitingActivity: true,
    },
    requestDefaults: { then: [] },
    data: {
      recruitingActivity: {
        projects: 2,
        messages: 1,
        feedback: 0,
        attachments: 0,
      },
    },
  },
  {
    operationName: 'rcFetchPerson',
    actionType: 'rc.openPersonPage',
    params: {
      personUrl: PERSON_URL,
      basicInfo: false,
      recruitingActivity: false,
    },
    requestDefaults: { then: [] },
    data: {},
  },
  {
    operationName: 'rcRetrieveProjects',
    actionType: 'rc.retrieveProjects',
    params: { limit: 5 },
    data: [
      {
        projectId: PROJECT_ID,
        projectUrl: 'https://www.linkedin.com/talent/hire/7420000000000000001/overview',
        name: 'Hiring',
        createdAt: '2026-11-01',
        candidateCount: 1,
      },
    ],
  },
  {
    operationName: 'rcRetrieveProjectCandidates',
    actionType: 'rc.retrieveProjectCandidates',
    params: {
      projectId: PROJECT_ID,
      stage: RC_PROJECT_STAGE.replied,
      limit: 5,
    },
    data: [
      {
        ...PERSON,
        stage: RC_PROJECT_STAGE.replied,
      },
    ],
  },
  {
    operationName: 'rcSaveToProject',
    actionType: 'rc.saveToProject',
    params: {
      projectId: PROJECT_ID,
      personUrl: PERSON_URL,
    },
    data: { alreadyInProject: true },
  },
  {
    operationName: 'rcCreateProject',
    actionType: 'rc.createProject',
    params: { name: 'Hiring' },
    data: {
      projectId: PROJECT_ID,
      projectUrl: 'https://www.linkedin.com/talent/hire/7420000000000000001/overview',
      name: null,
    },
  },
  {
    operationName: 'rcRenameProject',
    actionType: 'rc.renameProject',
    params: {
      projectId: PROJECT_ID,
      name: 'Hiring 2026',
      description: 'New\nDescription',
    },
  },
  {
    operationName: 'rcArchiveProject',
    actionType: 'rc.archiveProject',
    params: { projectId: PROJECT_ID },
    data: { alreadyArchived: false },
  },
  {
    operationName: 'rcSendMessage',
    actionType: 'rc.sendMessage',
    params: {
      personUrl: PERSON_URL,
      subject: 'Opportunity',
      text: 'Hello',
    },
    data: { creditUsed: false },
  },
  {
    operationName: 'rcSendMessage',
    actionType: 'rc.sendMessage',
    params: {
      personUrl: PERSON_URL,
      subject: 'Opportunity',
      text: 'Hello',
      allowPaidCredit: true,
    },
    data: { creditUsed: true },
  },
  {
    operationName: 'rcSendMessage',
    actionType: 'rc.sendMessage',
    params: {
      threadId: 'thread-1',
      text: 'Reply',
    },
    data: { creditUsed: false },
  },
  {
    operationName: 'rcSyncInbox',
    actionType: 'rc.syncInbox',
    params: {},
  },
];
let fetchMock: jest.SpiedFunction<typeof fetch>;
let linkedApi: LinkedApi;

beforeEach((): void => {
  fetchMock = jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
  linkedApi = new LinkedApi({
    linkedApiToken: 'test',
    identificationToken: 'test',
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
        result: {
          workflowId: WORKFLOW_ID,
          workflowStatus: 'pending',
        },
      }),
    ),
  );
  queueWorkflowResult(completion);
}

function queueWorkflowResult(completion: unknown): void {
  fetchMock.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        success: true,
        result: {
          workflowId: WORKFLOW_ID,
          workflowStatus: 'completed',
          completion,
        },
      }),
    ),
  );
}

function postedBody(index = 0): unknown {
  return JSON.parse(String(fetchMock.mock.calls[index]?.[1]?.body));
}

describe('Recruiter Lite operations', (): void => {
  it.each(CASES)(
    'registers and maps $operationName',
    async ({ operationName, actionType, params, requestDefaults, data }): Promise<void> => {
      const operation = linkedApi[operationName as keyof LinkedApi] as Operation<
        Record<string, unknown>,
        unknown
      >;
      expect(operation.operationName).toBe(OPERATION_NAME[operationName]);
      expect(linkedApi.operations.filter((entry): boolean => entry === operation)).toHaveLength(1);
      queueWorkflow({
        actionType,
        success: true,
        ...(data === undefined ? {} : { data }),
      });
      const started = await operation.execute(params);
      expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.test/workflows');
      expect(postedBody()).toEqual({
        actionType,
        ...requestDefaults,
        ...params,
      });
      expect(await operation.result(started.workflowId)).toEqual({
        data,
        errors: [],
      });
    },
  );

  it.each([
    {
      operationName: 'rcFetchPerson',
      actionType: 'rc.openPersonPage',
      type: 'recruiterSignInRequired',
    },
    {
      operationName: 'rcSearchPeople',
      actionType: 'rc.searchPeople',
      type: 'recruiterTwoStepVerificationRequired',
    },
    {
      operationName: 'rcSyncInbox',
      actionType: 'rc.syncInbox',
      type: 'recruiterMultipleSessionsDetected',
    },
    {
      operationName: 'rcSendMessage',
      actionType: 'rc.sendMessage',
      type: 'inMailCreditRequired',
    },
    {
      operationName: 'rcSendMessage',
      actionType: 'rc.sendMessage',
      type: 'inMailNotAvailable',
    },
    {
      operationName: 'rcSaveToProject',
      actionType: 'rc.saveToProject',
      type: 'projectNotFound',
    },
    {
      operationName: 'rcFetchPerson',
      actionType: 'rc.openPersonPage',
      type: 'personNotFound',
    },
    {
      operationName: 'rcSendMessage',
      actionType: 'rc.sendMessage',
      type: 'messagingNotAllowed',
    },
    {
      operationName: 'rcSearchPeople',
      actionType: 'rc.searchPeople',
      type: 'filterNotApplied',
    },
    {
      operationName: 'rcSearchPeople',
      actionType: 'rc.searchPeople',
      type: 'limitExceeded',
    },
  ] as const)(
    'preserves $operationName error $type',
    async ({ operationName, actionType, type }): Promise<void> => {
      const error = {
        type,
        message: 'Fixture error',
      };
      queueWorkflowResult({
        actionType,
        success: false,
        error,
      });
      expect(await linkedApi[operationName].result(WORKFLOW_ID)).toEqual({
        data: undefined,
        errors: [error],
      });
      expect(LINKED_API_ACTION_ERROR[type]).toBe(type);
    },
  );

  it('preserves the Plus plan request rejection', async (): Promise<void> => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          error: {
            type: 'plusPlanRequired',
            message: 'Plus required',
          },
        }),
      ),
    );
    await expect(linkedApi.rcSyncInbox.execute({})).rejects.toMatchObject({
      type: LINKED_API_ERROR.plusPlanRequired,
    });
  });

  it('passes rc.doForPeople through customWorkflow without a top-level operation', async (): Promise<void> => {
    queueWorkflow({
      actionType: 'rc.searchPeople',
      success: true,
      data: [],
    });
    const workflow = {
      actionType: 'rc.searchPeople',
      term: 'Engineer',
      then: {
        actionType: 'rc.doForPeople',
        then: {
          actionType: 'rc.openPersonPage',
          basicInfo: true,
        },
      },
    };
    await linkedApi.customWorkflow.execute(workflow);
    expect(postedBody()).toEqual(workflow);
    expect(Object.keys(OPERATION_NAME)).not.toContain('rcDoForPeople');
  });
});

const INBOX_MESSAGE: TInboxMessage = {
  id: 'message-1',
  type: INBOX_TYPE.rc,
  threadId: 'thread-1',
  personUrn: null,
  personHashedUrl: null,
  personPublicUrl: null,
  personRecruiterUrl: PERSON_URL,
  personUrl: null,
  sender: 'them',
  text: 'Hello',
  time: '2026-11-13T10:00:00.000Z',
};

describe('Recruiter Lite inbox and limits', (): void => {
  it('polls rc messages with their Recruiter URL and nullable public identity', async (): Promise<void> => {
    const result = { messages: [INBOX_MESSAGE] };
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          result,
        }),
      ),
    );
    expect(
      await linkedApi.pollInbox({
        type: INBOX_TYPE.rc,
        threadId: 'thread-1',
      }),
    ).toEqual({
      data: result,
      errors: [],
    });
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.test/inbox/poll');
    expect(postedBody()).toEqual({
      type: 'rc',
      threadId: 'thread-1',
    });
  });

  it('polls by a Recruiter profile URL and returns rc thread types', async (): Promise<void> => {
    const result: TInboxPersonPollResult = {
      messages: [
        {
          ...INBOX_MESSAGE,
          inboxMessageId: 'message-1',
        },
      ],
      threads: [
        {
          threadId: 'thread-1',
          type: INBOX_TYPE.rc,
          personUrn: null,
          historyFrom: null,
          historyComplete: false,
        },
      ],
    };
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          result,
        }),
      ),
    );
    const response = await linkedApi.pollInbox({ personUrl: PERSON_URL });
    expect(response.data?.threads[0]?.type).toBe('rc');
    expect(response).toEqual({
      data: result,
      errors: [],
    });
    expect(postedBody()).toEqual({ personUrl: PERSON_URL });
  });

  it.each(['inbox.messageReceived', 'inbox.messageSent'] as const)(
    'parses %s with Recruiter identity',
    (type): void => {
      const event: TInboxMessageWebhookEvent = {
        id: 'event-1',
        createdAt: INBOX_MESSAGE.time,
        type,
        data: {
          accountId: 'account-1',
          type: INBOX_TYPE.rc,
          threadId: INBOX_MESSAGE.threadId,
          personUrn: null,
          personHashedUrl: null,
          personPublicUrl: null,
          personRecruiterUrl: PERSON_URL,
          personUrl: null,
          messageId: INBOX_MESSAGE.id,
          sender: type === 'inbox.messageReceived' ? 'them' : 'us',
          text: INBOX_MESSAGE.text,
          time: INBOX_MESSAGE.time,
        },
      };
      expect(parseWebhookEvent(JSON.stringify(event))).toEqual(event);
    },
  );

  it('accepts all Recruiter categories in limits.set and limits.delete', async (): Promise<void> => {
    const admin = new LinkedApiAdmin({ linkedApiToken: 'test' });
    const categories: ReadonlyArray<TLimitCategory> = [
      'rcPersonProfileViews',
      'rcSearchQueries',
      'rcMessages',
    ];
    const limits = categories.map((category) => ({
      category,
      period: 'daily' as const,
      maxValue: 5,
    }));
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));
    await admin.limits.set({
      accountId: 'account-1',
      limits,
    });
    expect(postedBody()).toEqual({
      accountId: 'account-1',
      limits,
    });
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.linkedapi.io/admin/limits.set');
    const deletions = limits.map(({ category, period }) => ({
      category,
      period,
    }));
    await admin.limits.delete({
      accountId: 'account-1',
      limits: deletions,
    });
    expect(postedBody(1)).toEqual({
      accountId: 'account-1',
      limits: deletions,
    });
    expect(fetchMock.mock.calls[1]?.[0]).toBe('https://api.linkedapi.io/admin/limits.delete');
  });
});
