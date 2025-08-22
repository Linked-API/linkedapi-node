import LinkedApi, { LinkedApiError } from 'linkedapi-node';

async function postActionsExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
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

  const workflowId = await linkedapi.reactToPost.execute(reactionParams);
  console.log('👍 React to post workflow started:', workflowId);

  const reactionResult = await linkedapi.reactToPost.result(workflowId);
  if (reactionResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(reactionResult.errors, null, 2));
  } else {
    console.log('✅ Post reaction added successfully');
  }
}

async function commentOnPost(linkedapi: LinkedApi): Promise<void> {
  console.log('\n💬 Commenting on post...');

  const commentParams = {
    postUrl: 'https://www.linkedin.com/posts/example-post',
    text: 'Great post! Thanks for sharing this valuable insight. Looking forward to more content like this.',
  };

  const workflowId = await linkedapi.commentOnPost.execute(commentParams);
  console.log('💬 Comment on post workflow started:', workflowId);

  const commentResult = await linkedapi.commentOnPost.result(workflowId);
  if (commentResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(commentResult.errors, null, 2));
  } else {
    console.log('✅ Comment added successfully');
  }
}

if (require.main === module) {
  postActionsExample();
}
