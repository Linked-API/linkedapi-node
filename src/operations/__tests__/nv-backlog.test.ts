import { afterEach, describe, expect, it, jest } from '@jest/globals';

import LinkedApi, { Operation, TOperationName } from '../../index';

const LIST_ID = '7420000000000000001' as const;
const PERSON_URL = 'https://www.linkedin.com/in/example-person' as const;
const COMPANY_URL = 'https://www.linkedin.com/company/example-company' as const;
const SEARCH_URL = 'https://www.linkedin.com/sales/search/people?query=example' as const;
const LEAD = {
  name: 'Example Person',
  urn: 'urn:li:member:123',
  hashedUrl: PERSON_URL,
  position: null,
  companyName: null,
  location: null,
  addedToListAt: null,
};
const ACCOUNT = {
  name: 'Example Company',
  urn: 'urn:li:organization:123',
  hashedUrl: COMPANY_URL,
  industry: null,
  employeesCount: null,
};
const CREATED = { id: '7420000000000000002',
name: 'Example',
type: 'lead',
url: SEARCH_URL };
const SAVED_SEARCH = {
  ...CREATED,
  keywords: null,
  createdAt: null,
  lastViewedAt: null,
  newResultsCount: null,
};
const CASES: ReadonlyArray<{
  operationName: TOperationName;
  actionType: string;
  params: Record<string, unknown>;
  data?: unknown;
}> = [
  {
    operationName: 'nvRetrieveListLeads',
    actionType: 'nv.retrieveListLeads',
    params: { listId: LIST_ID,
limit: 26 },
    data: [LEAD],
  },
  {
    operationName: 'nvRetrieveListAccounts',
    actionType: 'nv.retrieveListAccounts',
    params: { listId: LIST_ID },
    data: [ACCOUNT],
  },
  {
    operationName: 'nvRemoveLeadFromList',
    actionType: 'nv.removeLeadFromList',
    params: { personHashedUrl: PERSON_URL,
listId: LIST_ID },
  },
  {
    operationName: 'nvRemoveAccountFromList',
    actionType: 'nv.removeAccountFromList',
    params: { companyHashedUrl: COMPANY_URL,
listId: LIST_ID },
  },
  {
    operationName: 'nvRenameList',
    actionType: 'nv.renameList',
    params: { listId: LIST_ID,
name: 'Prospects' },
    data: {
      id: LIST_ID,
      name: 'Prospects',
      type: 'lead',
      url: `https://www.linkedin.com/sales/lists/people/${LIST_ID}`,
    },
  },
  {
    operationName: 'nvRetrieveSavedSearches',
    actionType: 'nv.retrieveSavedSearches',
    params: { type: 'lead' },
    data: [SAVED_SEARCH],
  },
  {
    operationName: 'nvCreateSavedSearch',
    actionType: 'nv.createSavedSearch',
    params: { type: 'lead',
customSearchUrl: SEARCH_URL },
    data: CREATED,
  },
  {
    operationName: 'nvDeleteSavedSearch',
    actionType: 'nv.deleteSavedSearch',
    params: { savedSearchId: CREATED.id },
  },
];

afterEach((): void => {
  jest.restoreAllMocks();
});

describe('Sales Navigator backlog contract', (): void => {
  it.each(CASES)(
    'maps $operationName root requests and results',
    async ({ operationName, actionType, params, data }): Promise<void> => {
      const fetchMock = jest.spyOn(globalThis, 'fetch');
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            result: { workflowId: 'nv',
workflowStatus: 'pending' },
          }),
        ),
      );
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            result: {
              workflowStatus: 'completed',
              completion: { actionType,
success: true,
...(data === undefined ? {} : { data }) },
            },
          }),
        ),
      );
      const sdk = new LinkedApi({
        linkedApiToken: 'test',
        identificationToken: 'test',
        baseUrl: 'https://api.test',
      });
      const operation = sdk.operations.find(
        (entry): boolean => entry.operationName === operationName,
      ) as Operation<Record<string, unknown>, unknown>;
      const started = await operation.execute(params);
      expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
        actionType,
        ...params,
      });
      expect(await operation.result(started.workflowId)).toEqual({ data,
errors: [] });
    },
  );

  it.each([
    {
      operationName: 'nvRenameList',
      actionType: 'nv.renameList',
      type: 'listNotRenamable',
      params: { listId: LIST_ID,
name: 'Prospects' },
    },
    {
      operationName: 'nvDeleteSavedSearch',
      actionType: 'nv.deleteSavedSearch',
      type: 'savedSearchNotFound',
      params: { savedSearchId: CREATED.id },
    },
  ] as const)(
    'preserves %s action errors',
    async ({ operationName, actionType, type, params }): Promise<void> => {
      const error = { type,
message: 'Fixture error' };
      const fetchMock = jest.spyOn(globalThis, 'fetch');
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            result: { workflowId: 'nv',
workflowStatus: 'pending' },
          }),
        ),
      );
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            result: {
              workflowStatus: 'completed',
              completion: { actionType,
success: false,
error },
            },
          }),
        ),
      );
      const sdk = new LinkedApi({ linkedApiToken: 'test',
identificationToken: 'test' });
      const operation = sdk.operations.find(
        (entry): boolean => entry.operationName === operationName,
      ) as Operation<Record<string, unknown>, unknown>;
      const started = await operation.execute(params);
      expect(await operation.result(started.workflowId)).toEqual({
        data: undefined,
        errors: [error],
      });
    },
  );

  it('preserves comma-bearing alert identities and list scope', async (): Promise<void> => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          result: { workflowId: 'nv',
workflowStatus: 'pending' },
        }),
      ),
    );
    const sdk = new LinkedApi({ linkedApiToken: 'test',
identificationToken: 'test' });
    const filter = {
      listId: LIST_ID,
      subjects: [
        'urn:li:fs_salesProfile:(ACwAAAExample,NAME_SEARCH,xyz)',
        'urn:li:fs_salesCompany:123',
      ],
    };
    await sdk.nvRetrieveAlerts.execute({ sort: 'latest',
filter });
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
      actionType: 'nv.retrieveAlerts',
      sort: 'latest',
      filter,
    });
  });
});
