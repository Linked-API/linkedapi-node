import LinkedApi, { LinkedApiError, TSearchCompanySize } from 'linkedapi-node';

async function searchCompaniesExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API searchCompanies example starting...');

    await standardExample(linkedapi);
    await standardExampleWithCustomSearchUrl(linkedapi);
    await salesNavigatorExample(linkedapi);
    await salesNavigatorWithCustomUrlExample(linkedapi);

  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error Type:', error.type);
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
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
  const workflowId = await linkedapi.searchCompanies.execute(searchParams);
  console.log('🔍 Workflow started:', workflowId);
  const result = await linkedapi.searchCompanies.result(workflowId);
  if (result.data) {
    const results = result.data;
    console.log('✅ Company search completed');
    console.log(`📊 Found ${results.length} companies`);
    results.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name}`);
      console.log(`     Industry: ${company.industry}`);
      console.log(`     Location: ${company.location}`);
      console.log(`     URL: ${company.publicUrl}`);
    });
  }
  if (result.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(result.errors, null, 2));
  }
}

async function standardExampleWithCustomSearchUrl(linkedapi: LinkedApi): Promise<void> {
  const searchParams = {
    customSearchUrl: 'https://www.linkedin.com/search/results/companies/?companySize=%5B%22B%22%5D&keywords=Linked%20API',
  };

  console.log('🔍 Searching companies with custom search URL...');
  const workflowId = await linkedapi.searchCompanies.execute(searchParams);
  console.log('🔍 Workflow started:', workflowId);
  const result = await linkedapi.searchCompanies.result(workflowId);
  if (result.data) {
    const results = result.data;
    console.log('✅ Company search completed');
    console.log(`📊 Found ${results.length} companies`);
    results.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name}`);
      console.log(`     Industry: ${company.industry}`);
      console.log(`     Location: ${company.location}`);
      console.log(`     URL: ${company.publicUrl}`);
    });
  }
  if (result.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(result.errors, null, 2));
  }
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
  const workflowId = await linkedapi.nvSearchCompanies.execute(nvSearchParams);
  console.log('🔍 Sales Navigator workflow started:', workflowId);
  const nvResults = await linkedapi.nvSearchCompanies.result(workflowId);

  if (nvResults.data) {
    const results = nvResults.data;
    console.log('✅ Sales Navigator company search completed');
    console.log(`📊 Found ${results.length} companies`);
    results.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name}`);
      console.log(`     Industry: ${company.industry}`);
      console.log(`     Employees: ${company.employeesCount}`);
      console.log(`     URL: ${company.hashedUrl}`);
    });
  }
  if (nvResults.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(nvResults.errors, null, 2));
  }
}

async function salesNavigatorWithCustomUrlExample(linkedapi: LinkedApi): Promise<void> {
  const nvSearchParams = {
    customSearchUrl: "https://www.linkedin.com/sales/search/company?query=(spellCorrectionEnabled%3Atrue%2Ckeywords%3ALinked%2520API)",
  };

  console.log('\n🎯 Searching companies with Sales Navigator custom search URL...');
  const workflowId = await linkedapi.nvSearchCompanies.execute(nvSearchParams);
  console.log('🔍 Sales Navigator workflow started:', workflowId);
  const nvResults = await linkedapi.nvSearchCompanies.result(workflowId);

  if (nvResults.data) {
    const results = nvResults.data;
    console.log('✅ Sales Navigator company search completed');
    console.log(`📊 Found ${results.length} companies`);
    results.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name}`);
      console.log(`     Industry: ${company.industry}`);
      console.log(`     Employees: ${company.employeesCount}`);
      console.log(`     URL: ${company.hashedUrl}`);
    });
  }
  if (nvResults.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(nvResults.errors, null, 2));
  }
}

if (require.main === module) {
  searchCompaniesExample();
}
