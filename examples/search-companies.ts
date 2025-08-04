import LinkedApi, { TSearchCompanySize } from 'linkedapi-node';

async function searchCompaniesExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    accountApiToken: process.env.ACCOUNT_API_TOKEN,
    identificationToken: process.env.IDENTIFICATION_TOKEN,
    dataApiToken: process.env.DATA_API_TOKEN,
  });

  try {
    console.log('🚀 Linked API searchCompanies example starting...');

    await accountApiExample(linkedapi);
    await accountApiSalesNavigatorExample(linkedapi);
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
    term: 'technology startup',
    limit: 2,
    filter: {
      sizes: ['1-10', '11-50', '51-200', '201-500'] as TSearchCompanySize[],
      locations: ['Germany', 'United States', 'United Kingdom'],
      industries: ['Technology', 'Software', 'Artificial Intelligence'],
    },
  };

  console.log('🔍 Searching companies with Account API...');
  const accountSearchWorkflow = await linkedapi.account.searchCompanies(searchParams);
  console.log('🔍 Account API workflow started:', accountSearchWorkflow.workflowId);
  const accountResults = await accountSearchWorkflow.result();

  console.log('✅ Account API company search completed');
  console.log(`📊 Found ${accountResults.length} companies`);
  accountResults.forEach((company, index) => {
    console.log(`  ${index + 1}. ${company.name}`);
    console.log(`     Industry: ${company.industry}`);
    console.log(`     Location: ${company.location}`);
    console.log(`     URL: ${company.publicUrl}`);
  });
}

async function accountApiSalesNavigatorExample(linkedapi: LinkedApi): Promise<void> {
  // Example: Sales Navigator company search (Account API only)
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

  console.log('\n🎯 Searching companies with Sales Navigator (Account API)...');
  const nvSearchWorkflow = await linkedapi.account.salesNavigatorSearchCompanies(nvSearchParams);
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

async function dataApiExample(linkedapi: LinkedApi): Promise<void> {
  const dataSearchParams = {
    term: 'artificial intelligence',
    limit: 5,
    filter: {
      locations: ['Seattle', 'Boston'],
      industries: ['Technology', 'Artificial Intelligence'],
    },
  };

  console.log('\n🔍 Searching companies with Data API...');
  const dataSearchWorkflow = await linkedapi.data.searchCompanies(dataSearchParams);
  console.log('🔍 Data API workflow started:', dataSearchWorkflow.workflowId);
  const dataResults = await dataSearchWorkflow.result();

  console.log('✅ Data API company search completed');
  console.log(`📊 Found ${dataResults.length} companies`);
  dataResults.forEach((company, index) => {
    console.log(`  ${index + 1}. ${company.name}`);
    console.log(`     Industry: ${company.industry}`);
    console.log(`     Employees: ${company.employeeCount}`);
    console.log(`     URL: ${company.hashedUrl}`);
  });
}

async function runExample(): Promise<void> {
  try {
    await searchCompaniesExample();
    console.log('✨ Search companies example completed successfully');
  } catch (error) {
    console.error('💥 Example failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runExample();
} 