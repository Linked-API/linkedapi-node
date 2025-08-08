import LinkedApi, { LinkedApiError, LinkedApiWorkflowError } from 'linkedapi-node';

async function fetchCompanyExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    apiToken: process.env.API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 TypeScript Linked API example starting...');
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
  const fetchCompanyWorkflow = await linkedapi.fetchCompany({
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

async function salesNavigatorExample(linkedapi: LinkedApi): Promise<void> {
  const nvCompanyResult = await linkedapi.salesNavigatorFetchCompany({
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

if (require.main === module) {
  fetchCompanyExample();
}