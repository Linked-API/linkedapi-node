import LinkedApi from 'linkedapi-node';

async function fetchPostExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    apiToken: process.env.API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API fetchPost example starting...');
    await standardExample(linkedapi);
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

async function standardExample(linkedapi: LinkedApi): Promise<void> {
  const accountPostWorkflow = await linkedapi.account.fetchPost({
    postUrl: 'https://www.linkedin.com/posts/post-url'
  });
  console.log('🔍 Account API workflow started:', accountPostWorkflow.workflowId);
  const accountPost = await accountPostWorkflow.result();

  console.log('✅ Account API post fetched successfully');
  console.log(`📄 Post URL: ${accountPost.url}`);
  console.log(`⏰ Post Time: ${accountPost.time}`);
  console.log(`📝 Post Type: ${accountPost.type}`);
  console.log(`💬 Text: ${accountPost.text || 'No text content'}`);
  console.log(`🔄 Repost Text: ${accountPost.repostText || 'Not a repost'}`);
  console.log(`🖼️ Images: ${accountPost.images?.length || 0} image(s)`);
  console.log(`🎥 Has Video: ${accountPost.hasVideo}`);
  console.log(`📊 Has Poll: ${accountPost.hasPoll}`);
  console.log(`👍 Reactions: ${accountPost.reactionCount}`);
  console.log(`💬 Comments: ${accountPost.commentCount}`);
}

if (require.main === module) {
  fetchPostExample();
} 