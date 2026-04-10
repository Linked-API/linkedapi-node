import LinkedApi, { LinkedApiError } from '@linkedapi/node';

async function fetchCompanyExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
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
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function standardExample(linkedapi: LinkedApi): Promise<void> {
  const workflowId = await linkedapi.fetchCompany.execute({
    companyUrl: 'https://www.linkedin.com/company/linkedin/',
    retrieveEmployees: true,
    retrieveDMs: true,
    retrievePosts: true,
    employeesRetrievalConfig: {
      limit: 2,
      filter: {
        position: 'engineer',
        locations: ['United States'],
      },
    },
    dmsRetrievalConfig: {
      limit: 2,
    },
    postsRetrievalConfig: {
      limit: 10,
      since: '2024-01-01',
    },
  });

  console.log('🔍 Company workflow started: ', workflowId);
  const companyData = await linkedapi.fetchCompany.result(workflowId);
  if (companyData.data) {
    const company = companyData.data;
    console.log('✅ Company page opened successfully');
    console.log(`🏢 Company: ${company.name}`);
    console.log(`📖 Description: ${company.description}`);
    console.log(`📍 Location: ${company.location}`);
    console.log(`🏭 Industry: ${company.industry}`);
    console.log(`👥 Employees Count: ${company.employeesCount}`);
    console.log(`📅 Founded: ${company.yearFounded}`);
    console.log(`👨‍💼 Employees Retrieved: ${company.employees?.length || 0}`);
    console.log(`📝 Posts Retrieved: ${company.posts?.length || 0}`);
  }
  if (companyData.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(companyData.errors, null, 2));
  }
}

async function salesNavigatorExample(linkedapi: LinkedApi): Promise<void> {
  const workflowId = await linkedapi.nvFetchCompany.execute({
    companyHashedUrl: 'https://www.linkedin.com/sales/company/1035',
    retrieveEmployees: true,
    retrieveDMs: true,
    employeesRetrievalConfig: {
      limit: 1,
      filter: {
        positions: ['Manager', 'Engineer'],
      },
    },
    dmsRetrievalConfig: {
      limit: 2,
    },
  });

  console.log('🔍 Sales Navigator workflow started: ', workflowId);
  const nvCompanyData = await linkedapi.nvFetchCompany.result(workflowId);
  if (nvCompanyData.data) {
    const nvCompany = nvCompanyData.data;
    console.log('✅ Sales Navigator company page opened successfully');
    console.log(`🏢 Company: ${nvCompany.name}`);
    console.log(`📖 Description: ${nvCompany.description}`);
    console.log(`📍 Location: ${nvCompany.location}`);
    console.log(`🏭 Industry: ${nvCompany.industry}`);
    console.log(`🌐 Website: ${nvCompany.website}`);
    console.log(`👥 Employees Count: ${nvCompany.employeesCount}`);
    console.log(`📅 Founded: ${nvCompany.yearFounded || 'Not specified'}`);
    console.log(`👨‍💼 Employees Retrieved: ${nvCompany.employees?.length || 0}`);
    console.log(`🎯 Decision Makers Retrieved: ${nvCompany.dms?.length || 0}`);
  }
  if (nvCompanyData.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(nvCompanyData.errors, null, 2));
  }
}

if (require.main === module) {
  fetchCompanyExample();
}