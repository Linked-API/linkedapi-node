import LinkedApi, { LinkedApiError } from '@linkedapi/node';

async function messagingExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
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

  const workflowId = await linkedapi.sendMessage.execute(messageParams);
  console.log('💬 Send message workflow started:', workflowId);

  const sendMessageResult = await linkedapi.sendMessage.result(workflowId);
  if (sendMessageResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(sendMessageResult.errors, null, 2));
  } else {
    console.log('✅ Message sent successfully');
    console.log(`   📤 To: ${personUrl}`);
    console.log(`   💬 Text: "${messageParams.text}"`);
  }
}

async function syncConversation(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🔄 Syncing conversation...');

  const syncParams = {
    personUrl: personUrl,
  };

  const workflowId = await linkedapi.syncConversation.execute(syncParams);
  console.log('🔄 Sync conversation workflow started:', workflowId);

  const syncResult = await linkedapi.syncConversation.result(workflowId);
  if (syncResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(syncResult.errors, null, 2));
  } else {
    console.log('✅ Conversation synced successfully');
    console.log(`   👤 Person: ${personUrl}`);
    console.log('   📥 Conversation is now ready for polling');
  }
}

async function salesNavigatorSendMessage(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🎯 Sending Sales Navigator message...');

  const nvMessageParams = {
    personUrl: personUrl,
    text: 'Hello! I noticed we have some mutual connections and thought it would be great to connect. I work in a similar industry and would love to exchange insights.',
    subject: 'Let\'s connect!',
  };

  const workflowId = await linkedapi.nvSendMessage.execute(nvMessageParams);
  console.log('🎯 Sales Navigator send message workflow started:', workflowId);

  const nvMessageResult = await linkedapi.nvSendMessage.result(workflowId);
  if (nvMessageResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(nvMessageResult.errors, null, 2));
  } else {
    console.log('✅ Sales Navigator message sent successfully');
    console.log(`   📤 To: ${personUrl}`);
    console.log(`   💬 Text: "${nvMessageParams.text}"`);
  }
}

async function salesNavigatorSyncConversation(linkedapi: LinkedApi, personUrl: string): Promise<void> {
  console.log('\n🎯 Syncing Sales Navigator conversation...');

  const nvSyncParams = {
    personUrl: personUrl,
  };

  const workflowId = await linkedapi.nvSyncConversation.execute(nvSyncParams);
  console.log('🎯 Sales Navigator sync conversation workflow started:', workflowId);

  const nvSyncResult = await linkedapi.nvSyncConversation.result(workflowId);
  if (nvSyncResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(nvSyncResult.errors, null, 2));
  } else {
    console.log('✅ Sales Navigator conversation synced successfully');
    console.log(`   👤 Person: ${personUrl}`);
    console.log('   📥 Sales Navigator conversation is now ready for polling');
  }
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

  console.log('✅ Conversations polled successfully');
  console.log(`📊 Found ${pollResponse.data?.length || 0} conversations`);

  if (pollResponse.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(pollResponse.errors, null, 2));
  }
  pollResponse.data?.forEach((conversation) => {
    console.log(`\n💬 Conversation with ${conversation.personUrl}:`);
    console.log(`   🔗 Type: ${conversation.type === 'st' ? 'Standard' : 'Sales Navigator'}`);
    console.log(`   📬 Messages: ${conversation.messages.length}`);

    if (conversation.messages.length > 0) {
      console.log('   📝 Recent messages:');
      conversation.messages.slice(0, 5).forEach((message) => {
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