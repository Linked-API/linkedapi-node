import LinkedApi, { TYearsOfExperience } from 'linkedapi-node';

async function searchPeopleExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    accountApiToken: process.env.ACCOUNT_API_TOKEN,
    identificationToken: process.env.IDENTIFICATION_TOKEN,
    dataApiToken: process.env.DATA_API_TOKEN,
  });

  try {
    console.log('🚀 Linked API searchPeople example starting...');
    await accountApiExample(linkedapi);
    await salesNavigatorExample(linkedapi);
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
  const accountSearchWorkflow = await linkedapi.account.searchPeople(searchParams);
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
  const nvSearchWorkflow = await linkedapi.account.salesNavigatorSearchPeople(nvSearchParams);
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

async function dataApiExample(linkedapi: LinkedApi): Promise<void> {
  const dataSearchParams = {
    term: 'data scientist',
    limit: 6,
    filter: {
      lastName: 'Johnson',
      position: 'Senior Data Scientist',
      locations: ['Seattle', 'Boston', 'California'],
      currentCompanies: ['Tesla', 'SpaceX', 'Apple'],
      schools: ['UC Berkeley', 'Carnegie Mellon', 'Harvard University'],
    },
  };

  console.log('\n🔍 Searching people with Data API...');
  const dataSearchWorkflow = await linkedapi.data.searchPeople(dataSearchParams);
  console.log('🔍 Data API workflow started:', dataSearchWorkflow.workflowId);
  const dataResults = await dataSearchWorkflow.result();

  console.log('✅ Data API people search completed');
  console.log(`📊 Found ${dataResults.length} people`);
  dataResults.forEach((person, index) => {
    console.log(`  ${index + 1}. ${person.name}`);
    console.log(`     Position: ${person.position}`);
    console.log(`     Location: ${person.location}`);
    console.log(`     URL: ${person.hashedUrl}`);
  });

}

async function runExample(): Promise<void> {
  try {
    await searchPeopleExample();
    console.log('✨ Search people example completed successfully');
  } catch (error) {
    console.error('💥 Example failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runExample();
} 