import LinkedApi, {
  INVITATION_TYPE,
  LinkedApiError,
  TRetrieveInvitationsResult,
} from '@linkedapi/node';

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
    await retrieveInvitations(linkedapi);
    await acceptInvitation(linkedapi, targetPersonUrl2);
    await ignoreInvitation(linkedapi, targetPersonUrl2);
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

  const workflow = await linkedapi.checkConnectionStatus.execute(statusParams);
  console.log('🔍 Connection status workflow started:', workflow.workflowId);
  console.log('💬 Workflow message:', workflow.message);

  const statusResult = await linkedapi.checkConnectionStatus.result(workflow.workflowId);
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
    note: "Hi! I'd love to connect and discuss potential collaboration opportunities. Looking forward to connecting with you!",
    email: 'example@gmail.com',
  };

  const workflow = await linkedapi.sendConnectionRequest.execute(requestParams);
  console.log('📤 Send connection request workflow started:', workflow.workflowId);
  console.log('💬 Workflow message:', workflow.message);

  const requestResult = await linkedapi.sendConnectionRequest.result(workflow.workflowId);
  if (requestResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(requestResult.errors, null, 2));
  } else {
    console.log('✅ Connection request sent successfully');
    console.log('   📝 Note included in the request');
  }
}

async function retrievePendingRequests(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📋 Retrieving pending connection requests...');

  const workflow = await linkedapi.retrievePendingRequests.execute();
  console.log('📋 Retrieve pending requests workflow started:', workflow.workflowId);
  console.log('💬 Workflow message:', workflow.message);

  const pendingResults = await linkedapi.retrievePendingRequests.result(workflow.workflowId);
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

  const workflow = await linkedapi.withdrawConnectionRequest.execute(withdrawParams);
  console.log('🔙 Withdraw connection request workflow started:', workflow.workflowId);
  console.log('💬 Workflow message:', workflow.message);

  const withdrawResult = await linkedapi.withdrawConnectionRequest.result(workflow.workflowId);
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

  const workflow = await linkedapi.retrieveConnections.execute(connectionsParams);
  console.log('👥 Retrieve connections workflow started:', workflow.workflowId);
  console.log('💬 Workflow message:', workflow.message);

  const connectionsResults = await linkedapi.retrieveConnections.result(workflow.workflowId);

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
  const recentWorkflow = await linkedapi.retrieveConnections.execute({
    since: '2025-01-01',
    limit: 10,
  });
  console.log('👥 Retrieve recent connections workflow started:', recentWorkflow.workflowId);
  console.log('💬 Workflow message:', recentWorkflow.message);

  const recentResults = await linkedapi.retrieveConnections.result(recentWorkflow.workflowId);

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

  const workflow = await linkedapi.removeConnection.execute(removeParams);
  console.log('❌ Remove connection workflow started:', workflow.workflowId);
  console.log('💬 Workflow message:', workflow.message);

  const removeResult = await linkedapi.removeConnection.result(workflow.workflowId);
  if (removeResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(removeResult.errors, null, 2));
  } else {
    console.log('✅ Connection removed successfully');
    console.log('   🔗 No longer connected with this person');
  }
}

async function retrieveInvitations(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📥 Retrieving incoming invitations...');

  const workflow = await linkedapi.retrieveInvitations.execute();
  console.log('📥 Retrieve invitations workflow started:', workflow.workflowId);

  const invitationsResult = await linkedapi.retrieveInvitations.result(workflow.workflowId);
  if (invitationsResult.data) {
    const invitations = invitationsResult.data;
    console.log('✅ Incoming invitations retrieval completed');
    console.log(`📊 Found ${invitations.length} incoming invitations`);
    for (const [index, invitation] of invitations.entries()) {
      console.log(`  ${index + 1}. ${invitation.name}`);
      logInvitationTarget(invitation);
    }
  }
  if (invitationsResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(invitationsResult.errors, null, 2));
  }
}

async function acceptInvitation(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🤝 Accepting incoming invitation...');

  const workflow = await linkedapi.acceptInvitation.execute({
    invitationType: INVITATION_TYPE.connect,
    personUrl,
  });
  console.log('🤝 Accept invitation workflow started:', workflow.workflowId);

  const acceptResult = await linkedapi.acceptInvitation.result(workflow.workflowId);
  if (acceptResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(acceptResult.errors, null, 2));
  } else {
    console.log('✅ Invitation accepted successfully');
  }
}

async function ignoreInvitation(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🙈 Ignoring incoming invitation...');

  const workflow = await linkedapi.ignoreInvitation.execute({
    invitationType: INVITATION_TYPE.connect,
    personUrl,
  });
  console.log('🙈 Ignore invitation workflow started:', workflow.workflowId);

  const ignoreResult = await linkedapi.ignoreInvitation.result(workflow.workflowId);
  if (ignoreResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(ignoreResult.errors, null, 2));
  } else {
    console.log('✅ Invitation ignored successfully');
  }
}

function logInvitationTarget(invitation: TRetrieveInvitationsResult): void {
  console.log(`     Type: ${invitation.invitationType}`);
  switch (invitation.invitationType) {
    case INVITATION_TYPE.connect:
      console.log(`     Profile: ${invitation.publicUrl}`);
      console.log(`     Headline: ${invitation.headline}`);
      console.log(`     Note: ${invitation.note}`);
      break;
    case INVITATION_TYPE.companyFollow:
      console.log(`     Company: ${invitation.companyName}`);
      console.log(`     Company URL: ${invitation.companyUrl}`);
      break;
    case INVITATION_TYPE.newsletterSubscribe:
      console.log(`     Newsletter: ${invitation.newsletterName}`);
      console.log(`     Newsletter URL: ${invitation.newsletterUrl}`);
      break;
  }
}

if (require.main === module) {
  connectionsExample();
}
