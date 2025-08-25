import LinkedApi, { LinkedApiError } from 'linkedapi-node';

async function customWorkflowExample(): Promise<void> {

  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API custom workflow example starting...');
    const workflowId = await linkedapi.customWorkflow.execute({
      actionType: 'st.searchPeople',
      limit: 3,
      filter: {
        locations: ["San Francisco"],
      },
      then: {
        actionType: 'st.doForPeople',
        then: {
          actionType: 'st.openPersonPage',
          basicInfo: true,
          then: {
            actionType: 'st.retrievePersonSkills',
          }
        }
      }
    });
    console.log('🔍 Workflow started: ', workflowId);
    const result = await linkedapi.customWorkflow.result(workflowId);

    console.log('✅ Custom workflow executed successfully');
    console.log('🔍 Result: ', JSON.stringify(result.data, null, 2));
  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

if (require.main === module) {
  customWorkflowExample();
}