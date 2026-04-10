import LinkedApi, { LinkedApiError, POST_COMMENTS_SORT } from '@linkedapi/node';

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
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function standardExample(linkedapi: LinkedApi): Promise<void> {
  const workflowId = await linkedapi.fetchPost.execute({
    postUrl: 'https://www.linkedin.com/posts/post-url',
    retrieveComments: true,
    retrieveReactions: true,
    commentsRetrievalConfig: {
      limit: 25,
      sort: POST_COMMENTS_SORT.mostRelevant,
    },
    reactionsRetrievalConfig: {
      limit: 100,
    },
  });
  console.log('🔍 Workflow started:', workflowId);
  const postResult = await linkedapi.fetchPost.result(workflowId);
  if (postResult.data) {
    const post = postResult.data;
    console.log('✅ Post fetched successfully');
    console.log(`📄 Post URL: ${post.url}`);
    console.log(`⏰ Post Time: ${post.time}`);
    console.log(`📝 Post Type: ${post.type}`);
    console.log(`💬 Text: ${post.text || 'No text content'}`);
    console.log(`🔄 Repost Text: ${post.repostText || 'Not a repost'}`);
    console.log(`🖼️ Images: ${post.images?.length || 0} image(s)`);
    console.log(`🎥 Has Video: ${post.hasVideo}`);
    console.log(`📊 Has Poll: ${post.hasPoll}`);
    console.log(`👍 Reactions: ${post.reactionsCount}`);
    console.log(`💬 Comments: ${post.commentsCount}`);
    console.log(`🔄 Reposts: ${post.repostsCount}`);
    console.log(`👍 Reactions: ${post.reactions?.length || 0}`);
    console.log(`💬 Comments: ${post.comments?.length || 0}`);
  }
  if (postResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(postResult.errors, null, 2));
  }
}

if (require.main === module) {
  fetchPostExample();
} 