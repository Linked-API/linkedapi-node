import LinkedApi, { LinkedApiError, LinkedApiWorkflowError } from 'linkedapi-node';

async function fetchPostExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API fetchPost example starting...');
    await standardExample(linkedapi);
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

async function standardExample(linkedapi: LinkedApi): Promise<void> {
  const postWorkflow = await linkedapi.fetchPost({
    postUrl: 'https://www.linkedin.com/posts/post-url'
  });
  console.log('🔍 Workflow started:', postWorkflow.workflowId);
  const post = await postWorkflow.result();

  console.log('✅ Post fetched successfully');
  console.log(`📄 Post URL: ${post.url}`);
  console.log(`⏰ Post Time: ${post.time}`);
  console.log(`📝 Post Type: ${post.type}`);
  console.log(`💬 Text: ${post.text || 'No text content'}`);
  console.log(`🔄 Repost Text: ${post.repostText || 'Not a repost'}`);
  console.log(`🖼️ Images: ${post.images?.length || 0} image(s)`);
  console.log(`🎥 Has Video: ${post.hasVideo}`);
  console.log(`📊 Has Poll: ${post.hasPoll}`);
  console.log(`👍 Reactions: ${post.reactionCount}`);
  console.log(`💬 Comments: ${post.commentCount}`);
}

if (require.main === module) {
  fetchPostExample();
} 