import LinkedApi, { LinkedApiError } from 'linkedapi-node';

async function fetchPersonExample(): Promise<void> {

  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API fetchPerson example starting...');

    await standardExample(linkedapi);
    await salesNavigatorExample(linkedapi);
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
  const workflowId = await linkedapi.fetchPerson.execute({
    personUrl: 'https://www.linkedin.com/in/example-person/',
    retrieveExperience: true,
    retrieveEducation: true,
    retrieveLanguages: true,
    retrieveSkills: true,
    retrievePosts: true,
    retrieveComments: true,
    retrieveReactions: true,
    postsRetrievalConfig: {
      limit: 5,
      since: '2024-01-01',
    },
    commentsRetrievalConfig: {
      limit: 5,
    },
    reactionsRetrievalConfig: {
      limit: 5,
    },
  });
  console.log('🔍 Workflow started: ', workflowId);
  const personResult = await linkedapi.fetchPerson.result(workflowId);
  if (personResult.data) {
    const person = personResult.data;
    console.log('✅ Person page opened successfully');
    console.log(`👤 Name: ${person.name}`);
    console.log(`💼 Position: ${person.position} at ${person.companyName}`);
    console.log(`📍 Location: ${person.location}`);
    console.log(`🌐 Skills: ${person.skills}`);
    console.log(`💼 Experiences: ${person.experiences}`);
    console.log(`👥 Followers: ${person.followersCount || 'No followers'}`);
  }
  if (personResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(personResult.errors, null, 2));
  }
}

async function salesNavigatorExample(linkedapi: LinkedApi): Promise<void> {
  const fetchParams = {
    personHashedUrl: 'https://www.linkedin.com/in/abc123',
  };

  const workflowId = await linkedapi.nvFetchPerson.execute(fetchParams);
  console.log('🔍 Workflow started: ', workflowId);
  const personResult = await linkedapi.nvFetchPerson.result(workflowId);
  if (personResult.data) {
    const person = personResult.data;
    console.log('✅ Person page opened successfully');
    console.log(`👤 Name: ${person.name}`);
    console.log(`💼 Position: ${person.position} at ${person.companyName}`);
    console.log(`📍 Location: ${person.location}`);
  }
  if (personResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(personResult.errors, null, 2));
  }
}

if (require.main === module) {
  fetchPersonExample();
}
