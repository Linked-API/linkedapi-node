import { HttpClient } from '../types';
import type { TAdminConfig } from '../types/admin/admin-config.type';

import { AdminAccounts } from './admin-accounts';
import { buildAdminHttpClient } from './admin-http-client';
import { AdminLimits } from './admin-limits';
import { AdminSubscription } from './admin-subscription';

/**
 * LinkedApiAdmin - Admin SDK for managing Linked API subscription, accounts, and limits.
 *
 * Unlike the main LinkedApi class, admin operations are synchronous (direct request-response)
 * and require only the `linkedApiToken` - no `identificationToken` needed.
 *
 * @see {@link https://linkedapi.io/docs/admin-overview/ Admin API Documentation}
 *
 * @example
 * ```typescript
 * import { LinkedApiAdmin } from 'linkedapi-node';
 *
 * const admin = new LinkedApiAdmin({
 *   linkedApiToken: 'your-linked-api-token',
 * });
 *
 * const status = await admin.subscription.getStatus();
 * const { accounts } = await admin.accounts.getAll();
 * const { limits } = await admin.limits.getDefaults();
 * ```
 */
export class LinkedApiAdmin {
  public readonly subscription: AdminSubscription;
  public readonly accounts: AdminAccounts;
  public readonly limits: AdminLimits;

  constructor(config: TAdminConfig | HttpClient) {
    const httpClient =
      config instanceof HttpClient ? config : buildAdminHttpClient(config, config.client ?? 'node');

    this.subscription = new AdminSubscription(httpClient);
    this.accounts = new AdminAccounts(httpClient);
    this.limits = new AdminLimits(httpClient);
  }
}
