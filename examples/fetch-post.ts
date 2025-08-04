import LinkedApi from 'linkedapi-node';

async function fetchPostExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    accountApiToken: process.env.ACCOUNT_API_TOKEN,
    identificationToken: process.env.IDENTIFICATION_TOKEN,
    dataApiToken: process.env.DATA_API_TOKEN,
  });

  try {
    console.log('🚀 Linked API fetchPost example starting...');
    await accountApiExample(linkedapi);
    await dataApiExample(linkedapi);
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

async function dataApiExample(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📄 Fetching post with Data API...');
  const dataPostWorkflow = await linkedapi.data.fetchPost({
    postUrl: 'https://www.linkedin.com/posts/post-url'
  });
  console.log('🔍 Data API workflow started:', dataPostWorkflow.workflowId);
  const dataPost = await dataPostWorkflow.result();

  console.log('✅ Data API post fetched successfully');
  console.log(`📄 Post URL: ${dataPost.url}`);
  console.log(`⏰ Post Time: ${dataPost.time}`);
  console.log(`📝 Post Type: ${dataPost.type}`);
  console.log(`💬 Text: ${dataPost.text || 'No text content'}`);
  console.log(`🔄 Repost Text: ${dataPost.repostText || 'Not a repost'}`);
  console.log(`🖼️ Images: ${dataPost.images?.length || 0} image(s)`);
  console.log(`🎥 Has Video: ${dataPost.hasVideo}`);
  console.log(`📊 Has Poll: ${dataPost.hasPoll}`);
  console.log(`👍 Reactions: ${dataPost.reactionCount}`);
  console.log(`💬 Comments: ${dataPost.commentCount}`);
}

async function accountApiExample(linkedapi: LinkedApi): Promise<void> {
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

async function runExample(): Promise<void> {
  try {
    await fetchPostExample();
    console.log('✨ Fetch post example completed successfully');
  } catch (error) {
    console.error('💥 Example failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runExample();
} 