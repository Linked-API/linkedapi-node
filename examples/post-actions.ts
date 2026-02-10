import LinkedApi, { LinkedApiError } from 'linkedapi-node';

async function postActionsExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Post Actions example starting...');
    await createPost(linkedapi);
    await createPostWithAttachments(linkedapi);
    await createCompanyPost(linkedapi);
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

async function createPost(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📝 Creating a simple text post...');

  const workflowId = await linkedapi.createPost.execute({
    text: 'Excited to share our latest product updates!\n\n#innovation #technology',
  });
  console.log('📝 Create post workflow started:', workflowId);

  const result = await linkedapi.createPost.result(workflowId);
  if (result.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(result.errors, null, 2));
  } else {
    console.log('✅ Post created successfully');
    console.log('🔗 Post URL:', result.data?.postUrl);
  }
}

async function createPostWithAttachments(linkedapi: LinkedApi): Promise<void> {
  console.log('\n🖼️ Creating a post with image attachments...');

  const workflowId = await linkedapi.createPost.execute({
    text: 'Check out these amazing photos from our team event!',
    attachments: [
      { url: 'https://example.com/photo1.jpg', type: 'image' },
      { url: 'https://example.com/photo2.jpg', type: 'image' },
    ],
  });
  console.log('🖼️ Create post with images workflow started:', workflowId);

  const result = await linkedapi.createPost.result(workflowId);
  if (result.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(result.errors, null, 2));
  } else {
    console.log('✅ Post with images created successfully');
    console.log('🔗 Post URL:', result.data?.postUrl);
  }
}

async function createCompanyPost(linkedapi: LinkedApi): Promise<void> {
  console.log('\n🏢 Creating a company page post with document...');

  const workflowId = await linkedapi.createPost.execute({
    text: 'Download our latest whitepaper on AI trends in 2026',
    companyUrl: 'https://www.linkedin.com/company/acme-corp',
    attachments: [
      {
        url: 'https://example.com/whitepaper.pdf',
        type: 'document',
        name: 'AI Trends 2026 Whitepaper',
      },
    ],
  });
  console.log('🏢 Create company post workflow started:', workflowId);

  const result = await linkedapi.createPost.result(workflowId);
  if (result.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(result.errors, null, 2));
  } else {
    console.log('✅ Company post created successfully');
    console.log('🔗 Post URL:', result.data?.postUrl);
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
    companyUrl: 'https://www.linkedin.com/company/acme-corp',
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
