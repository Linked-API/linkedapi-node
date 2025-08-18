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

  const statusWorkflow = await linkedapi.checkConnectionStatus(statusParams);
  console.log('🔍 Connection status workflow started:', statusWorkflow.workflowId);

  const statusResult = await statusWorkflow.result();
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

  const requestWorkflow = await linkedapi.sendConnectionRequest(requestParams);
  console.log('📤 Send connection request workflow started:', requestWorkflow.workflowId);

  const requestResult = await requestWorkflow.result();
  if (requestResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(requestResult.errors, null, 2));
  } else {
    console.log('✅ Connection request sent successfully');
    console.log('   📝 Note included in the request');
  }
}

async function retrievePendingRequests(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📋 Retrieving pending connection requests...');

  const pendingWorkflow = await linkedapi.retrievePendingRequests();
  console.log('📋 Retrieve pending requests workflow started:', pendingWorkflow.workflowId);

  const pendingResults = await pendingWorkflow.result();
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

  const withdrawWorkflow = await linkedapi.withdrawConnectionRequest(withdrawParams);
  console.log('🔙 Withdraw connection request workflow started:', withdrawWorkflow.workflowId);

  const withdrawResult = await withdrawWorkflow.result();
  if (withdrawResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(withdrawResult.errors, null, 2));
  } else {
    console.log('✅ Connection request withdrawn successfully');
    console.log('   🚶 Also unfollowed the person');
  }
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

  const connectionsWorkflow = await linkedapi.retrieveConnections(connectionsParams);
  console.log('👥 Retrieve connections workflow started:', connectionsWorkflow.workflowId);

  const connectionsResults = await connectionsWorkflow.result();

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
}

async function removeConnection(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n❌ Removing connection...');

  const removeParams = {
    personUrl: personUrl,
  };

  const removeWorkflow = await linkedapi.removeConnection(removeParams);
  console.log('❌ Remove connection workflow started:', removeWorkflow.workflowId);

  const removeResult = await removeWorkflow.result();
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