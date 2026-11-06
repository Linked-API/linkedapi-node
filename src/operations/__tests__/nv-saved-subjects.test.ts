import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import LinkedApi, { LINKED_API_ACTION_ERROR, PredefinedOperation, TNvList } from '../../index';

const PERSON_URL = 'https://www.linkedin.com/sales/lead/example' as const;
const COMPANY_URL = 'https://www.linkedin.com/sales/company/123' as const;
const LIST_ID = '7420000000000000001' as const;
const WORKFLOW_ID = 'saved-subject-workflow' as const;

let fetchMock: jest.SpiedFunction<typeof fetch>;
let linkedApi: LinkedApi;

beforeEach((): void => {
  fetchMock = jest
    .spyOn(globalThis, 'fetch')
    .mockRejectedValue(new Error('Unexpected HTTP request'));
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

describe('Sales Navigator saved subject contracts', (): void => {
  it.each([
    { name: 'nvSaveLead',
actionType: 'nv.saveLead',
params: { personHashedUrl: PERSON_URL } },
    {
      name: 'nvSaveLead',
      actionType: 'nv.saveLead',
      params: { personHashedUrl: PERSON_URL,
listId: LIST_ID },
    },
    { name: 'nvUnsaveLead',
actionType: 'nv.unsaveLead',
params: { personHashedUrl: PERSON_URL } },
    {
      name: 'nvSaveAccount',
      actionType: 'nv.saveAccount',
      params: { companyHashedUrl: COMPANY_URL },
    },
    {
      name: 'nvSaveAccount',
      actionType: 'nv.saveAccount',
      params: { companyHashedUrl: COMPANY_URL,
listId: LIST_ID },
    },
    {
      name: 'nvUnsaveAccount',
      actionType: 'nv.unsaveAccount',
      params: { companyHashedUrl: COMPANY_URL },
    },
  ] as const)(
    '$name submits the root action with $params',
    async ({ name, actionType, params }): Promise<void> => {
      const operation = linkedApi[name] as PredefinedOperation<typeof params, void>;
      queueWorkflow({ actionType,
success: true });
      expect(linkedApi.operations).toContain(operation);
      expect(operation.operationName).toBe(name);
      const started = await operation.execute(params);
      const result = await operation.result(started.workflowId);
      expect(postedWorkflow()).toEqual({ actionType,
...params });
      expect(result.data).toBeUndefined();
      expect(result.errors).toEqual([]);
      expect(fetchMock.mock.calls[1]?.[0]).toBe(`https://api.test/workflows/${WORKFLOW_ID}`);
    },
  );

  it.each([
    'listNotFound',
    'personNotFound',
    'companyNotFound',
    'noSalesNavigator',
    'unexpectedError',
  ])('preserves the %s action error', async (type): Promise<void> => {
    const error = { type,
message: 'Fixture error' };
    queueWorkflow({ actionType: 'nv.saveLead',
success: false,
error });
    const started = await linkedApi.nvSaveLead.execute({
      personHashedUrl: PERSON_URL,
      listId: LIST_ID,
    });
    const result = await linkedApi.nvSaveLead.result(started.workflowId);
    expect(result.data).toBeUndefined();
    expect(result.errors).toEqual([error]);
    expect(LINKED_API_ACTION_ERROR.listNotFound).toBe('listNotFound');
  });
});

describe('Sales Navigator list contracts', (): void => {
  it.each(['lead', 'account'] as const)(
    'retrieves %s lists without losing long IDs, sources or null counts',
    async (type): Promise<void> => {
      const lists: Array<TNvList> = [
        {
          id: LIST_ID,
          name: 'Prospects',
          type,
          source: 'FUTURE_SOURCE',
          entityCount: null,
          url: `https://www.linkedin.com/sales/lists/${type}/${LIST_ID}`,
        },
      ];
      queueWorkflow({ actionType: 'nv.retrieveLists',
success: true,
data: lists });
      expect(linkedApi.operations).toContain(linkedApi.nvRetrieveLists);
      const started = await linkedApi.nvRetrieveLists.execute({ type });
      const result = await linkedApi.nvRetrieveLists.result(started.workflowId);
      expect(postedWorkflow()).toEqual({ actionType: 'nv.retrieveLists',
type });
      expect(result.data).toEqual(lists);
      expect(result.errors).toEqual([]);
    },
  );

  it('distinguishes an empty list catalog from failure', async (): Promise<void> => {
    queueWorkflow({ actionType: 'nv.retrieveLists',
success: true,
data: [] });
    const started = await linkedApi.nvRetrieveLists.execute({ type: 'lead' });
    expect(await linkedApi.nvRetrieveLists.result(started.workflowId)).toEqual({
      data: [],
      errors: [],
    });
  });

  it('preserves list retrieval failures without returning an empty catalog', async (): Promise<void> => {
    const error = { type: 'noSalesNavigator',
message: 'Fixture error' };
    queueWorkflow({ actionType: 'nv.retrieveLists',
success: false,
error });
    const started = await linkedApi.nvRetrieveLists.execute({ type: 'account' });
    expect(await linkedApi.nvRetrieveLists.result(started.workflowId)).toEqual({
      data: undefined,
      errors: [error],
    });
  });
});
