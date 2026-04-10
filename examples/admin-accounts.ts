import { LinkedApiAdmin, LinkedApiError } from '@linkedapi/node';

async function adminAccountsExample(): Promise<void> {
  const admin = new LinkedApiAdmin({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Admin Accounts example starting...');

    await getAllAccounts(admin);

  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function getAllAccounts(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n👥 Getting all connected accounts...');

  const { accounts, pendingConnectionSessions } = await admin.accounts.getAll();

  console.log('✅ Accounts retrieved');
  console.log(`   Connected accounts: ${accounts.length}`);
  for (const account of accounts) {
    console.log(`   ${account.name} (${account.status}) – ${account.id}`);
    console.log(`     Country: ${account.countryCode}`);
    console.log(`     Connected: ${account.connectedAt}`);
  }

  if (pendingConnectionSessions.length > 0) {
    console.log(`\n   Pending sessions: ${pendingConnectionSessions.length}`);
    for (const session of pendingConnectionSessions) {
      console.log(`   Session ${session.sessionId}: ${session.status}`);
    }
  }
}

async function connectNewAccount(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n🔗 Creating connection session...');

  const { sessionId, connectionLink } = await admin.accounts.createConnectionSession();
  console.log('✅ Connection session created');
  console.log(`   Session ID: ${sessionId}`);
  console.log(`   Open this link to connect: ${connectionLink}`);

  console.log('\n⏳ Polling connection session status...');
  let session;

  do {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    session = await admin.accounts.getConnectionSession({ sessionId });
    console.log(`   Status: ${session.session.status}`);
  } while (
    session.session.status === 'pending' ||
    session.session.status === 'preparing' ||
    session.session.status === 'serving' ||
    session.session.status === 'streaming'
  );

  if (session.session.status === 'success') {
    console.log('✅ Account connected successfully!');

    const { accounts } = await admin.accounts.getAll();
    console.log(`   Total accounts: ${accounts.length}`);
  } else {
    console.log(`❌ Connection failed with status: ${session.session.status}`);
  }
}

async function regenerateToken(admin: LinkedApiAdmin): Promise<void> {
  const { accounts } = await admin.accounts.getAll();
  if (accounts.length === 0) {
    console.log('\n⚠️ No accounts to regenerate token for');
    return;
  }

  const accountId = accounts[0].id;
  console.log(`\n🔑 Regenerating token for account ${accounts[0].name}...`);

  const { token } = await admin.accounts.regenerateIdentificationToken({ accountId });
  console.log('✅ Token regenerated');
  console.log(`   New token: ${token}`);
  console.log('   ⚠️ Update identificationToken in all your SDK instances!');
}

if (require.main === module) {
  adminAccountsExample();
}
