import LinkedApi from 'linkedapi-node';

async function fetchPersonExample(): Promise<void> {

  const linkedapi = new LinkedApi({
    accountApiToken: process.env.ACCOUNT_API_TOKEN,
    identificationToken: process.env.IDENTIFICATION_TOKEN,
    dataApiToken: process.env.DATA_API_TOKEN,
  });

  try {
    console.log('🚀 Linked API fetchPerson example starting...');

    await accountApiExample(linkedapi);
    await salesNavigatorAccountApiExample(linkedapi);
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

async function accountApiExample(linkedapi: LinkedApi): Promise<void> {
  const personResult = await linkedapi.account.fetchPerson({
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
    commentRetrievalConfig: {
      limit: 5,
    },
    reactionRetrievalConfig: {
      limit: 5,
    },
  });
  console.log('🔍 Workflow started: ', personResult.workflowId);
  const person = await personResult.result();

  console.log('✅ Person page opened successfully');
  console.log(`👤 Name: ${person.name}`);
  console.log(`💼 Position: ${person.position} at ${person.companyName}`);
  console.log(`📍 Location: ${person.location}`);
  console.log(`🌐 Skills: ${person.skills}`);
  console.log(`💼 Experiences: ${person.experiences}`);
}

async function salesNavigatorAccountApiExample(linkedapi: LinkedApi): Promise<void> {
  const fetchParams = {
    personHashedUrl: 'https://www.linkedin.com/in/abc123',
  };

  const personResult = await linkedapi.account.salesNavigatorFetchPerson(fetchParams);
  console.log('🔍 Workflow started: ', personResult.workflowId);
  const person = await personResult.result();

  console.log('✅ Person page opened successfully');
  console.log(`👤 Name: ${person.name}`);
  console.log(`💼 Position: ${person.position} at ${person.companyName}`);
  console.log(`📍 Location: ${person.location}`);
}

async function dataApiExample(linkedapi: LinkedApi): Promise<void> {
  const personResult = await linkedapi.data.fetchPerson({
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
    commentRetrievalConfig: {
      limit: 5,
    },
    reactionRetrievalConfig: {
      limit: 5,
    },
  });
  console.log('🔍 Workflow started: ', personResult.workflowId);
  const person = await personResult.result();

  console.log('✅ Person page opened successfully');
  console.log(`👤 Name: ${person.name}`);
  console.log(`💼 Position: ${person.position} at ${person.companyName}`);
  console.log(`📍 Location: ${person.location}`);
  console.log(`🌐 Skills: ${person.skills}`);
  console.log(`💼 Experiences: ${person.experiences}`);
}

async function runExample(): Promise<void> {
  try {
    await fetchPersonExample();
  } catch (error) {
    console.error('💥 Example failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runExample();
}