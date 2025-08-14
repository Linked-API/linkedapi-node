import LinkedApi, { LinkedApiError, LinkedApiWorkflowError, TSearchCompanySize } from 'linkedapi-node';

async function searchCompaniesExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API searchCompanies example starting...');

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
    term: 'technology startup',
    limit: 2,
    filter: {
      sizes: ['1-10', '11-50', '51-200', '201-500'] as TSearchCompanySize[],
      locations: ['Germany', 'United States', 'United Kingdom'],
      industries: ['Technology', 'Software', 'Artificial Intelligence'],
    },
  };

  console.log('🔍 Searching companies with Linked API...');
  const searchWorkflow = await linkedapi.searchCompanies(searchParams);
  console.log('🔍 Workflow started:', searchWorkflow.workflowId);
  const results = await searchWorkflow.result();

  console.log('✅ Company search completed');
  console.log(`📊 Found ${results.length} companies`);
  results.forEach((company, index) => {
    console.log(`  ${index + 1}. ${company.name}`);
    console.log(`     Industry: ${company.industry}`);
    console.log(`     Location: ${company.location}`);
    console.log(`     URL: ${company.publicUrl}`);
  });
}

async function salesNavigatorExample(linkedapi: LinkedApi): Promise<void> {
  const nvSearchParams = {
    term: 'fintech',
    limit: 1,
    filter: {
      sizes: ['1-10', '11-50', '51-200', '201-500', '501-1000'] as TSearchCompanySize[],
      locations: ['California', 'Texas'],
      industries: ['Financial Services', 'Banking'],
      annualRevenue: {
        min: '0',
        max: '500',
      } as const,
    },
  };

  console.log('\n🎯 Searching companies with Sales Navigator...');
  const nvSearchWorkflow = await linkedapi.salesNavigatorSearchCompanies(nvSearchParams);
  console.log('🔍 Sales Navigator workflow started:', nvSearchWorkflow.workflowId);
  const nvResults = await nvSearchWorkflow.result();

  console.log('✅ Sales Navigator company search completed');
  console.log(`📊 Found ${nvResults.length} companies`);
  nvResults.forEach((company, index) => {
    console.log(`  ${index + 1}. ${company.name}`);
    console.log(`     Industry: ${company.industry}`);
    console.log(`     Employees: ${company.employeeCount}`);
    console.log(`     URL: ${company.hashedUrl}`);
  });
}

if (require.main === module) {
  searchCompaniesExample();
}
