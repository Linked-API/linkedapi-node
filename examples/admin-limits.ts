import { LinkedApiAdmin, LinkedApiError } from '@linkedapi/node';

async function adminLimitsExample(): Promise<void> {
  const admin = new LinkedApiAdmin({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Admin Limits example starting...');

    await getDefaultLimits(admin);
    await getAccountLimitsAndUsage(admin);

  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function getDefaultLimits(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n📋 Getting default limits...');

  const { limits } = await admin.limits.getDefaults();
  console.log('✅ Default limits retrieved');
  for (const limit of limits) {
    const status = limit.isEnabled ? '✅' : '⏸️';
    console.log(`   ${status} ${limit.category} (${limit.period}): max ${limit.maxValue}`);
  }
}

async function getAccountLimitsAndUsage(admin: LinkedApiAdmin): Promise<void> {
  const { accounts } = await admin.accounts.getAll();
  if (accounts.length === 0) {
    console.log('\n⚠️ No accounts to check limits for');
    return;
  }

  const account = accounts[0];
  if (!account) {
    console.log('\n⚠️ No accounts to check limits for');
    return;
  }
  const accountId = account.id;

  console.log(`\n📊 Getting limits for ${account.name}...`);
  const { limits } = await admin.limits.get({ accountId });
  console.log('✅ Account limits retrieved');
  for (const limit of limits) {
    console.log(`   ${limit.category} (${limit.period}): max ${limit.maxValue}`);
  }

  console.log(`\n📈 Getting usage for ${account.name}...`);
  const { usage } = await admin.limits.getUsage({ accountId });
  console.log('✅ Usage retrieved');
  for (const entry of usage) {
    const remaining = entry.maxValue - entry.currentUsage;
    const status = entry.isEnabled ? '✅' : '⏸️';
    console.log(`   ${status} ${entry.category} (${entry.period}): ${entry.currentUsage}/${entry.maxValue} (${remaining} remaining)`);
  }
}

async function setCustomLimits(admin: LinkedApiAdmin): Promise<void> {
  const { accounts } = await admin.accounts.getAll();
  if (accounts.length === 0) {
    console.log('\n⚠️ No accounts to set limits for');
    return;
  }
  const account = accounts[0];
  if (!account) {
    console.log('\n⚠️ No accounts to check limits for');
    return;
  }
  const accountId = account.id;

  console.log(`\n🔧 Setting custom limits for ${account.name}...`);
  await admin.limits.set({
    accountId,
    limits: [
      {
        category: 'stMessages',
        period: 'daily',
        maxValue: 25,
        isEnabled: true,
      },
      {
        category: 'stConnectionRequests',
        period: 'weekly',
        maxValue: 30,
      },
    ],
  });
  console.log('✅ Custom limits set');

  console.log('\n🗑️ Deleting specific limits...');
  await admin.limits.delete({
    accountId,
    limits: [
      { category: 'stMessages', period: 'daily' },
    ],
  });
  console.log('✅ Limits deleted');

  console.log('\n🔄 Resetting all limits to defaults...');
  await admin.limits.resetToDefaults({ accountId });
  console.log('✅ Limits reset to defaults');
}

if (require.main === module) {
  adminLimitsExample();
}
