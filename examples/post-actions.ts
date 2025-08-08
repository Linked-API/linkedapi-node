import LinkedApi, { LinkedApiError, LinkedApiWorkflowError } from 'linkedapi-node';

async function postActionsExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    apiToken: process.env.API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Post Actions example starting...');
    await reactToPost(linkedapi);
    await commentOnPost(linkedapi);

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

async function reactToPost(linkedapi: LinkedApi): Promise<void> {
  console.log('\n👍 Reacting to post...');

  const reactionParams = {
    postUrl: 'https://www.linkedin.com/posts/example-post',
    type: 'like' as const,
  };

  const reactionWorkflow = await linkedapi.reactToPost(reactionParams);
  console.log('👍 React to post workflow started:', reactionWorkflow.workflowId);

  await reactionWorkflow.result();
  console.log('✅ Post reaction added successfully');
}

async function commentOnPost(linkedapi: LinkedApi): Promise<void> {
  console.log('\n💬 Commenting on post...');

  const commentParams = {
    postUrl: 'https://www.linkedin.com/posts/example-post',
    text: 'Great post! Thanks for sharing this valuable insight. Looking forward to more content like this.',
  };

  const commentWorkflow = await linkedapi.commentOnPost(commentParams);
  console.log('💬 Comment on post workflow started:', commentWorkflow.workflowId);

  await commentWorkflow.result();
  console.log('✅ Comment added successfully');
}

if (require.main === module) {
  postActionsExample();
} 