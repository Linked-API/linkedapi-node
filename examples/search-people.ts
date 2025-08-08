import LinkedApi, { LinkedApiError, LinkedApiWorkflowError, TYearsOfExperience } from 'linkedapi-node';

async function searchPeopleExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    apiToken: process.env.API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API searchPeople example starting...');
    await standardExample(linkedapi);
    await salesNavigatorExample(linkedapi);

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
  const searchParams = {
    term: 'software engineer',
    limit: 10,
    filter: {
      firstName: 'John',
      position: 'Senior Software Engineer',
      locations: ['San Francisco', 'New York'],
      industries: ['Technology', 'Software'],
      currentCompanies: ['Google', 'Microsoft', 'Apple'],
      schools: ['Stanford University', 'MIT'],
    },
  };

  console.log('🔍 Searching people with Account API...');
  const accountSearchWorkflow = await linkedapi.searchPeople(searchParams);
  console.log('🔍 Account API workflow started:', accountSearchWorkflow.workflowId);
  const accountResults = await accountSearchWorkflow.result();

  console.log('✅ Account API people search completed');
  console.log(`📊 Found ${accountResults.length} people`);
  accountResults.forEach((person, index) => {
    console.log(`  ${index + 1}. ${person.name}`);
    console.log(`     Headline: ${person.headline}`);
    console.log(`     Location: ${person.location}`);
    console.log(`     URL: ${person.publicUrl}`);
  });
}

async function salesNavigatorExample(linkedapi: LinkedApi): Promise<void> {
  const nvSearchParams = {
    term: 'product manager',
    limit: 8,
    filter: {
      position: 'Product Manager',
      industries: ['Technology', 'Financial Services'],
      currentCompanies: ['Meta', 'Amazon', 'Netflix'],
      previousCompanies: ['Uber', 'Airbnb', 'Microsoft'],
      yearsOfExperience: ['threeToFive', 'sixToTen'] as TYearsOfExperience[],
    },
  };

  console.log('\n🎯 Searching people with Sales Navigator (Account API)...');
  const nvSearchWorkflow = await linkedapi.salesNavigatorSearchPeople(nvSearchParams);
  console.log('🔍 Sales Navigator workflow started:', nvSearchWorkflow.workflowId);
  const nvResults = await nvSearchWorkflow.result();

  console.log('✅ Sales Navigator people search completed');
  console.log(`📊 Found ${nvResults.length} people`);
  nvResults.forEach((person, index) => {
    console.log(`  ${index + 1}. ${person.name}`);
    console.log(`     Position: ${person.position}`);
    console.log(`     Location: ${person.location}`);
    console.log(`     URL: ${person.hashedUrl}`);
  });
}

if (require.main === module) {
  searchPeopleExample();
} 