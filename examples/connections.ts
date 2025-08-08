import LinkedApi from 'linkedapi-node';

async function connectionsExample(): Promise<void> {

  const linkedapi = new LinkedApi({
    apiToken: process.env.API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Connections Management example starting...');

    const targetPersonUrl = 'https://www.linkedin.com/in/example-person';
    const targetPersonUrl2 = 'https://www.linkedin.com/in/another-person';

    await checkConnectionStatus(linkedapi, targetPersonUrl);
    await sendConnectionRequest(linkedapi, targetPersonUrl);
    await retrievePendingRequests(linkedapi);
    await withdrawConnectionRequest(linkedapi, targetPersonUrl);
    await retrieveConnections(linkedapi);
    await removeConnection(linkedapi, targetPersonUrl2);

  } catch (error) {
    if (error instanceof LinkedApi.LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
    } else if (error instanceof LinkedApi.LinkedApiWorkflowError) {
      console.error('🚨 Linked API Workflow Error:', error.message);
      console.error('🔍 Reason:', error.reason);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function checkConnectionStatus(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🔍 Checking connection status...');

  const statusParams = {
    personUrl: personUrl,
  };

  const statusWorkflow = await linkedapi.account.checkConnectionStatus(statusParams);
  console.log('🔍 Connection status workflow started:', statusWorkflow.workflowId);

  const statusResult = await statusWorkflow.result();
  console.log('✅ Connection status check completed');
  console.log(`📊 Connection status: ${statusResult.connectionStatus}`);
}

async function sendConnectionRequest(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n📤 Sending connection request...');

  const requestParams = {
    personUrl: personUrl,
    note: 'Hi! I\'d love to connect and discuss potential collaboration opportunities. Looking forward to connecting with you!',
    email: 'example@gmail.com',
  };

  const requestWorkflow = await linkedapi.account.sendConnectionRequest(requestParams);
  console.log('📤 Send connection request workflow started:', requestWorkflow.workflowId);

  await requestWorkflow.result();
  console.log('✅ Connection request sent successfully');
  console.log('   📝 Note included in the request');
}

async function retrievePendingRequests(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📋 Retrieving pending connection requests...');

  const pendingWorkflow = await linkedapi.account.retrievePendingRequests();
  console.log('📋 Retrieve pending requests workflow started:', pendingWorkflow.workflowId);

  const pendingResults = await pendingWorkflow.result();
  console.log('✅ Pending requests retrieval completed');
  console.log(`📊 Found ${pendingResults.length} pending requests`);

  pendingResults.forEach((request, index) => {
    console.log(`  ${index + 1}. ${request.name}`);
    console.log(`     Profile: ${request.publicUrl}`);
    console.log(`     Headline: ${request.headline}`);
  });
}

async function withdrawConnectionRequest(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🔙 Withdrawing connection request...');

  const withdrawParams = {
    personUrl: personUrl,
    unfollow: true,
  };

  const withdrawWorkflow = await linkedapi.account.withdrawConnectionRequest(withdrawParams);
  console.log('🔙 Withdraw connection request workflow started:', withdrawWorkflow.workflowId);

  await withdrawWorkflow.result();
  console.log('✅ Connection request withdrawn successfully');
  console.log('   🚶 Also unfollowed the person');
}

async function retrieveConnections(linkedapi: LinkedApi): Promise<void> {
  console.log('\n👥 Retrieving existing connections...');

  const connectionsParams = {
    limit: 10,
    filter: {
      firstName: 'John',
      locations: ['United States', 'India'],
    },
  };

  const connectionsWorkflow = await linkedapi.account.retrieveConnections(connectionsParams);
  console.log('👥 Retrieve connections workflow started:', connectionsWorkflow.workflowId);

  const connectionsResults = await connectionsWorkflow.result();
  console.log('✅ Connections retrieval completed');
  console.log(`📊 Found ${connectionsResults.length} connections`);

  connectionsResults.forEach((connection, index) => {
    console.log(`  ${index + 1}. ${connection.name}`);
    console.log(`     Profile: ${connection.publicUrl}`);
    console.log(`     Headline: ${connection.headline}`);
    console.log(`     Location: ${connection.location}`);
  });
}

async function removeConnection(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n❌ Removing connection...');

  const removeParams = {
    personUrl: personUrl,
  };

  const removeWorkflow = await linkedapi.account.removeConnection(removeParams);
  console.log('❌ Remove connection workflow started:', removeWorkflow.workflowId);

  await removeWorkflow.result();
  console.log('✅ Connection removed successfully');
  console.log('   🔗 No longer connected with this person');
}

if (require.main === module) {
  connectionsExample();
} 