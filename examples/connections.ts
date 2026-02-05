import LinkedApi, { LinkedApiError } from 'linkedapi-node';

async function connectionsExample(): Promise<void> {

  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
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
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
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

  const workflowId = await linkedapi.checkConnectionStatus.execute(statusParams);
  console.log('🔍 Connection status workflow started:', workflowId);

  const statusResult = await linkedapi.checkConnectionStatus.result(workflowId);
  if (statusResult.data) {
    console.log('✅ Connection status check completed');
    console.log(`📊 Connection status: ${statusResult.data.connectionStatus}`);
  }
  if (statusResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(statusResult.errors, null, 2));
  }
}

async function sendConnectionRequest(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n📤 Sending connection request...');

  const requestParams = {
    personUrl: personUrl,
    note: 'Hi! I\'d love to connect and discuss potential collaboration opportunities. Looking forward to connecting with you!',
    email: 'example@gmail.com',
  };

  const workflowId = await linkedapi.sendConnectionRequest.execute(requestParams);
  console.log('📤 Send connection request workflow started:', workflowId);

  const requestResult = await linkedapi.sendConnectionRequest.result(workflowId);
  if (requestResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(requestResult.errors, null, 2));
  } else {
    console.log('✅ Connection request sent successfully');
    console.log('   📝 Note included in the request');
  }
}

async function retrievePendingRequests(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📋 Retrieving pending connection requests...');

  const workflowId = await linkedapi.retrievePendingRequests.execute();
  console.log('📋 Retrieve pending requests workflow started:', workflowId);

  const pendingResults = await linkedapi.retrievePendingRequests.result(workflowId);
  if (pendingResults.data) {
    const pendingRequests = pendingResults.data;
    console.log('✅ Pending requests retrieval completed');
    console.log(`📊 Found ${pendingRequests.length} pending requests`);
    pendingRequests.forEach((request, index) => {
      console.log(`  ${index + 1}. ${request.name}`);
      console.log(`     Profile: ${request.publicUrl}`);
      console.log(`     Headline: ${request.headline}`);
    });
  }
  if (pendingResults.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(pendingResults.errors, null, 2));
  }
}

async function withdrawConnectionRequest(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🔙 Withdrawing connection request...');

  const withdrawParams = {
    personUrl: personUrl,
    unfollow: true,
  };

  const workflowId = await linkedapi.withdrawConnectionRequest.execute(withdrawParams);
  console.log('🔙 Withdraw connection request workflow started:', workflowId);

  const withdrawResult = await linkedapi.withdrawConnectionRequest.result(workflowId);
  if (withdrawResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(withdrawResult.errors, null, 2));
  } else {
    console.log('✅ Connection request withdrawn successfully');
    console.log('   🚶 Also unfollowed the person');
  }
}

async function retrieveConnections(linkedapi: LinkedApi): Promise<void> {
  console.log('\n👥 Retrieving existing connections...');

  // Example 1: Retrieve with filter (returns location field)
  const connectionsParams = {
    limit: 10,
    filter: {
      firstName: 'John',
      locations: ['United States', 'India'],
    },
  };

  const workflowId = await linkedapi.retrieveConnections.execute(connectionsParams);
  console.log('👥 Retrieve connections workflow started:', workflowId);

  const connectionsResults = await linkedapi.retrieveConnections.result(workflowId);

  if (connectionsResults.data) {
    const connections = connectionsResults.data;
    console.log('✅ Connections retrieval completed');
    console.log(`📊 Found ${connections.length} connections`);
    connections.forEach((connection, index) => {
      console.log(`  ${index + 1}. ${connection.name}`);
      console.log(`     Profile: ${connection.publicUrl}`);
      console.log(`     Headline: ${connection.headline}`);
      console.log(`     Location: ${connection.location}`);
    });
  }
  if (connectionsResults.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(connectionsResults.errors, null, 2));
  }

  // Example 2: Retrieve recent connections using since (returns connectedAt field)
  const recentWorkflowId = await linkedapi.retrieveConnections.execute({
    since: '2025-01-01',
    limit: 10,
  });
  console.log('👥 Retrieve recent connections workflow started:', recentWorkflowId);

  const recentResults = await linkedapi.retrieveConnections.result(recentWorkflowId);

  if (recentResults.data) {
    const connections = recentResults.data;
    console.log('✅ Recent connections retrieval completed');
    console.log(`📊 Found ${connections.length} recent connections`);
    connections.forEach((connection, index) => {
      console.log(`  ${index + 1}. ${connection.name}`);
      console.log(`     Profile: ${connection.publicUrl}`);
      console.log(`     Headline: ${connection.headline}`);
      console.log(`     Connected At: ${connection.connectedAt}`);
    });
  }
  if (recentResults.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(recentResults.errors, null, 2));
  }
}

async function removeConnection(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n❌ Removing connection...');

  const removeParams = {
    personUrl: personUrl,
  };

  const workflowId = await linkedapi.removeConnection.execute(removeParams);
  console.log('❌ Remove connection workflow started:', workflowId);

  const removeResult = await linkedapi.removeConnection.result(workflowId);
  if (removeResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(removeResult.errors, null, 2));
  } else {
    console.log('✅ Connection removed successfully');
    console.log('   🔗 No longer connected with this person');
  }
}

if (require.main === module) {
  connectionsExample();
} 