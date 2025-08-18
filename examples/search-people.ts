import LinkedApi, { LinkedApiError, TYearsOfExperience } from 'linkedapi-node';

async function searchPeopleExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
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

  console.log('🔍 Searching people with Linked API...');
  const searchWorkflow = await linkedapi.searchPeople(searchParams);
  console.log('🔍 Workflow started:', searchWorkflow.workflowId);
  const searchResult = await searchWorkflow.result();

  if (searchResult.data) {
    const results = searchResult.data;
    console.log('✅ People search completed');
    console.log(`📊 Found ${results.length} people`);
    results.forEach((person, index) => {
    console.log(`  ${index + 1}. ${person.name}`);
    console.log(`     Headline: ${person.headline}`);
      console.log(`     Location: ${person.location}`);
      console.log(`     URL: ${person.publicUrl}`);
    });
  }
  if (searchResult.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(searchResult.errors, null, 2));
  }
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

  console.log('\n🎯 Searching people with Sales Navigator...');
  const nvSearchWorkflow = await linkedapi.salesNavigatorSearchPeople(nvSearchParams);
  console.log('🔍 Sales Navigator workflow started:', nvSearchWorkflow.workflowId);
  const nvResults = await nvSearchWorkflow.result();

  if (nvResults.data) {
    const results = nvResults.data;
    console.log('✅ Sales Navigator people search completed');
    console.log(`📊 Found ${results.length} people`);
    results.forEach((person, index) => {
    console.log(`  ${index + 1}. ${person.name}`);
    console.log(`     Position: ${person.position}`);
      console.log(`     Location: ${person.location}`);
      console.log(`     URL: ${person.hashedUrl}`);
    });
  }
  if (nvResults.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(nvResults.errors, null, 2));
  }
}

if (require.main === module) {
  searchPeopleExample();
} 