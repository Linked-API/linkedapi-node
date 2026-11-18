import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import LinkedApi from '../../index';

const PERSON_URL = 'https://www.linkedin.com/in/example-person' as const;
const WORKFLOW_ID = 'contact-info-workflow' as const;
const CONTACT_INFO = {
  email: 'person@example.com',
  phones: ['555-0100'],
  websites: ['https://example.com/'],
  birthday: { month: 11,
day: 13 },
  connectedAt: '2026-11-11T00:00:00.000Z',
} as const;

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
  return JSON.parse(String(request?.[1]?.body));
}

describe('fetchPerson with retrieveContactInfo', (): void => {
  it('requests the st.retrievePersonContactInfo child and maps its data to contactInfo', async (): Promise<void> => {
    queueWorkflow({
      actionType: 'st.openPersonPage',
      success: true,
      data: {
        name: 'Example Person',
        then: [
          {
            actionType: 'st.retrievePersonContactInfo',
            success: true,
            data: CONTACT_INFO,
          },
        ],
      },
    });

    const started = await linkedApi.fetchPerson.execute({
      personUrl: PERSON_URL,
      retrieveContactInfo: true,
    });
    const result = await linkedApi.fetchPerson.result(started.workflowId);

    expect(postedWorkflow()).toEqual({
      actionType: 'st.openPersonPage',
      personUrl: PERSON_URL,
      basicInfo: true,
      then: [{ actionType: 'st.retrievePersonContactInfo' }],
    });
    expect(result.data?.contactInfo).toEqual(CONTACT_INFO);
    expect(result.errors).toEqual([]);
  });
});
