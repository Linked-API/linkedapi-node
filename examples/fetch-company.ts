import LinkedApi from 'linkedapi-node';

async function fetchCompanyExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    accountApiToken: process.env.ACCOUNT_API_TOKEN,
    identificationToken: process.env.IDENTIFICATION_TOKEN,
    dataApiToken: process.env.DATA_API_TOKEN,
  });

  try {
    console.log('🚀 TypeScript Linked API example starting...');
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
  const fetchCompanyWorkflow = await linkedapi.account.fetchCompany({
    companyUrl: 'https://www.linkedin.com/company/linkedin/',
    retrieveEmployees: true,
    retrieveDms: true,
    retrievePosts: true,
    employeeRetrievalConfig: {
      limit: 2,
      filter: {
        position: 'engineer',
        locations: ['United States'],
      },
    },
    dmRetrievalConfig: {
      limit: 2,
    },
    postRetrievalConfig: {
      limit: 10,
      since: '2024-01-01',
    },
  });

  console.log('🔍 Company workflow started: ', fetchCompanyWorkflow.workflowId);
  const company = await fetchCompanyWorkflow.result();

  console.log('✅ Company page opened successfully');
  console.log(`🏢 Company: ${company.name}`);
  console.log(`📖 Description: ${company.description}`);
  console.log(`📍 Location: ${company.location}`);
  console.log(`🏭 Industry: ${company.industry}`);
  console.log(`👥 Employee Count: ${company.employeeCount}`);
  console.log(`📅 Founded: ${company.yearFounded}`);
  console.log(`👨‍💼 Employees Retrieved: ${company.employees?.length || 0}`);
  console.log(`📝 Posts Retrieved: ${company.posts?.length || 0}`);
}

async function accountApiSalesNavigatorExample(linkedapi: LinkedApi): Promise<void> {
  const nvCompanyResult = await linkedapi.account.salesNavigatorFetchCompany({
    companyHashedUrl: 'https://www.linkedin.com/sales/company/1035',
    retrieveEmployees: true,
    retrieveDms: true,
    employeeRetrievalConfig: {
      limit: 1,
      filter: {
        positions: ['Manager', 'Engineer'],
      },
    },
    dmRetrievalConfig: {
      limit: 2,
    },
  });

  console.log('🔍 Sales Navigator workflow started: ', nvCompanyResult.workflowId);
  const nvCompany = await nvCompanyResult.result();

  console.log('✅ Sales Navigator company page opened successfully');
  console.log(`🏢 Company: ${nvCompany.name}`);
  console.log(`📖 Description: ${nvCompany.description}`);
  console.log(`📍 Location: ${nvCompany.location}`);
  console.log(`🏭 Industry: ${nvCompany.industry}`);
  console.log(`🌐 Website: ${nvCompany.website}`);
  console.log(`👥 Employee Count: ${nvCompany.employeeCount}`);
  console.log(`📅 Founded: ${nvCompany.yearFounded || 'Not specified'}`);
  console.log(`👨‍💼 Employees Retrieved: ${nvCompany.employees?.length || 0}`);
  console.log(`🎯 Decision Makers Retrieved: ${nvCompany.dms?.length || 0}`);
}

async function dataApiExample(linkedapi: LinkedApi): Promise<void> {
  const dataCompanyResult = await linkedapi.data.fetchCompany({
    companyUrl: 'https://www.linkedin.com/sales/company/1337',
    retrieveEmployees: true,
    retrieveDms: true,
    employeeRetrievalConfig: {
      limit: 10,
      filter: {
        position: 'engineer',
        locations: ['United States'],
        industries: ['Technology', 'Software'],
        schools: ['Stanford University', 'MIT'],
        yearsOfExperiences: ['threeToFive', 'sixToTen'],
      },
    },
    dmRetrievalConfig: {
      limit: 2,
    },
  });

  console.log('🔍 Data API company workflow started: ', dataCompanyResult.workflowId);
  const dataCompany = await dataCompanyResult.result();

  console.log('✅ Data API company page opened successfully');
  console.log(`🏢 Company: ${dataCompany.name}`);
  console.log(`📖 Description: ${dataCompany.description}`);
  console.log(`📍 Location: ${dataCompany.location}`);
  console.log(`🏭 Industry: ${dataCompany.industry}`);
  console.log(`👥 Employee Count: ${dataCompany.employeeCount}`);
  console.log(`📅 Founded: ${dataCompany.yearFounded}`);
  console.log(`👨‍💼 Employees Retrieved: ${dataCompany.employees?.length || 0}`);
}

async function runExample(): Promise<void> {
  try {
    await fetchCompanyExample();
  } catch (error) {
    console.error('💥 Example failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runExample();
}