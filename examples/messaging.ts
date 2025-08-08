import LinkedApi, { LinkedApiError, LinkedApiWorkflowError } from 'linkedapi-node';

async function messagingExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    apiToken: process.env.API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Messaging example starting...');

    const targetPersonUrl = 'https://www.linkedin.com/in/example-person';
    const targetPersonUrl2 = 'https://www.linkedin.com/in/another-person';

    await sendMessage(linkedapi, targetPersonUrl);
    await salesNavigatorSendMessage(linkedapi, targetPersonUrl2);

    await syncConversation(linkedapi, targetPersonUrl);
    await salesNavigatorSyncConversation(linkedapi, targetPersonUrl2);

    await pollConversations(linkedapi, targetPersonUrl, targetPersonUrl2);

  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
    } else if (error instanceof LinkedApiWorkflowError) {
      console.error('🚨 Linked API Workflow Error:', error.message);
      console.error('🔍 Reason:', error.reason);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function sendMessage(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n💬 Sending message...');

  const messageParams = {
    personUrl: personUrl,
    text: 'Hi! I hope you\'re doing well. I came across your profile and was impressed by your work. I\'d love to connect and discuss potential collaboration opportunities.',
  };

  const messageWorkflow = await linkedapi.sendMessage(messageParams);
  console.log('💬 Send message workflow started:', messageWorkflow.workflowId);

  await messageWorkflow.result();
  console.log('✅ Message sent successfully');
  console.log(`   📤 To: ${personUrl}`);
  console.log(`   💬 Text: "${messageParams.text}"`);
}

async function syncConversation(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🔄 Syncing conversation...');

  const syncParams = {
    personUrl: personUrl,
  };

  const syncWorkflow = await linkedapi.syncConversation(syncParams);
  console.log('🔄 Sync conversation workflow started:', syncWorkflow.workflowId);

  await syncWorkflow.result();
  console.log('✅ Conversation synced successfully');
  console.log(`   👤 Person: ${personUrl}`);
  console.log('   📥 Conversation is now ready for polling');
}

async function salesNavigatorSendMessage(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🎯 Sending Sales Navigator message...');

  const nvMessageParams = {
    personUrl: personUrl,
    text: 'Hello! I noticed we have some mutual connections and thought it would be great to connect. I work in a similar industry and would love to exchange insights.',
    subject: 'Let\'s connect!',
  };

  const nvMessageWorkflow = await linkedapi.salesNavigatorSendMessage(nvMessageParams);
  console.log('🎯 Sales Navigator send message workflow started:', nvMessageWorkflow.workflowId);

  await nvMessageWorkflow.result();
  console.log('✅ Sales Navigator message sent successfully');
  console.log(`   📤 To: ${personUrl}`);
  console.log(`   💬 Text: "${nvMessageParams.text}"`);
}

async function salesNavigatorSyncConversation(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🎯 Syncing Sales Navigator conversation...');

  const nvSyncParams = {
    personUrl: personUrl,
  };

  const nvSyncWorkflow = await linkedapi.salesNavigatorSyncConversation(nvSyncParams);
  console.log('🎯 Sales Navigator sync conversation workflow started:', nvSyncWorkflow.workflowId);

  await nvSyncWorkflow.result();
  console.log('✅ Sales Navigator conversation synced successfully');
  console.log(`   👤 Person: ${personUrl}`);
  console.log('   📥 Sales Navigator conversation is now ready for polling');
}

async function pollConversations(linkedapi: LinkedApi, standardPersonUrl: string, nvPersonUrl: string): Promise<void> {
  console.log('\n📥 Polling conversations...');

  const pollResponse = await linkedapi.pollConversations([
    {
      personUrl: standardPersonUrl,
      type: 'st',
      since: '2025-01-01T00:00:00Z',
    },
    {
      personUrl: nvPersonUrl,
      type: 'nv',
      since: '2025-01-01T00:00:00Z',
    },
  ]);

  if (!pollResponse.success) {
    console.error('❌ Failed to poll conversations:', pollResponse.error?.message);
    return;
  }

  console.log('✅ Conversations polled successfully');
  console.log(`📊 Found ${pollResponse.result?.length || 0} conversations`);

  pollResponse.result?.forEach((conversation, index) => {
    console.log(`\n💬 Conversation ${index + 1}:`);
    console.log(`   👤 Person: ${conversation.personUrl}`);
    console.log(`   🔗 Type: ${conversation.type === 'st' ? 'Standard' : 'Sales Navigator'}`);
    console.log(`   📬 Messages: ${conversation.messages.length}`);

    if (conversation.messages.length > 0) {
      console.log('   📝 Recent messages:');
      conversation.messages.slice(-3).forEach((message) => {
        const senderIcon = message.sender === 'us' ? '👤' : '👋';
        console.log(`     ${senderIcon} ${message.sender.toUpperCase()}: "${message.text}"`);
        console.log(`       🕐 ${message.time}`);
      });
    }
  });
}

if (require.main === module) {
  messagingExample();
} 