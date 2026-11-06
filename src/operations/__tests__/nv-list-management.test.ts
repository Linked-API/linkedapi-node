import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import LinkedApi, { LINKED_API_ACTION_ERROR, TNvCreatedList } from '../../index';

const LIST_ID = '7420000000000000001' as const;
const WORKFLOW_ID = 'list-management' as const;
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
        result: {
          workflowId: WORKFLOW_ID,
          workflowStatus: 'pending',
        },
      }),
    ),
  );
  fetchMock.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        success: true,
        result: {
          workflowStatus: 'completed',
          completion,
        },
      }),
    ),
  );
}

function postedWorkflow(): unknown {
  expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.test/workflows');
  expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
  return JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
}

describe('Sales Navigator list management contract', (): void => {
  it.each([
    {
      type: 'lead',
      description: undefined,
    },
    {
      type: 'account',
      description: '  Europe  ',
    },
  ] as const)(
    'creates $type list as a root action and returns the created-list object',
    async ({ type, description }): Promise<void> => {
      const data: TNvCreatedList = {
        id: LIST_ID,
        name: 'Prospects',
        type,
        url: `https://www.linkedin.com/sales/lists/${type === 'lead' ? 'people' : 'accounts'}/${LIST_ID}`,
      };
      queueWorkflow({
        actionType: 'nv.createList',
        success: true,
        data,
      });
      const params = {
        type,
        name: '  Prospects  ',
        ...(description === undefined ? {} : { description }),
      };
      expect(linkedApi.operations).toContain(linkedApi.nvCreateList);
      expect(linkedApi.nvCreateList.operationName).toBe('nvCreateList');
      const started = await linkedApi.nvCreateList.execute(params);
      const result = await linkedApi.nvCreateList.result(started.workflowId);
      expect(postedWorkflow()).toEqual({
        actionType: 'nv.createList',
        ...params,
      });
      expect(result).toEqual({
        data,
        errors: [],
      });
      expect(fetchMock.mock.calls[1]?.[0]).toBe(`https://api.test/workflows/${WORKFLOW_ID}`);
    },
  );

  it('deletes by exact string ID without adding a type or returning data', async (): Promise<void> => {
    queueWorkflow({
      actionType: 'nv.deleteList',
      success: true,
    });
    expect(linkedApi.operations).toContain(linkedApi.nvDeleteList);
    expect(linkedApi.nvDeleteList.operationName).toBe('nvDeleteList');
    const started = await linkedApi.nvDeleteList.execute({ listId: LIST_ID });
    expect(await linkedApi.nvDeleteList.result(started.workflowId)).toEqual({
      data: undefined,
      errors: [],
    });
    expect(postedWorkflow()).toEqual({
      actionType: 'nv.deleteList',
      listId: LIST_ID,
    });
  });

  it.each([
    'listAlreadyExists',
    'interfaceLanguageNotSupported',
    'noSalesNavigator',
    'unexpectedError',
  ] as const)(
    'preserves create error %s without created-list data',
    async (type): Promise<void> => {
      const error = {
        type,
        message: 'Fixture error',
      };
      queueWorkflow({
        actionType: 'nv.createList',
        success: false,
        error,
      });
      const started = await linkedApi.nvCreateList.execute({
        type: 'lead',
        name: 'Prospects',
      });
      expect(await linkedApi.nvCreateList.result(started.workflowId)).toEqual({
        data: undefined,
        errors: [error],
      });
      expect(LINKED_API_ACTION_ERROR[type]).toBe(type);
    },
  );

  it.each([
    'listNotFound',
    'listNotDeletable',
    'interfaceLanguageNotSupported',
    'noSalesNavigator',
    'unexpectedError',
  ] as const)('preserves delete error %s', async (type): Promise<void> => {
    const error = {
      type,
      message: 'Fixture error',
    };
    queueWorkflow({
      actionType: 'nv.deleteList',
      success: false,
      error,
    });
    const started = await linkedApi.nvDeleteList.execute({ listId: LIST_ID });
    expect(await linkedApi.nvDeleteList.result(started.workflowId)).toEqual({
      data: undefined,
      errors: [error],
    });
    expect(LINKED_API_ACTION_ERROR[type]).toBe(type);
  });
});
