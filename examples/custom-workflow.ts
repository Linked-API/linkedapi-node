import LinkedApi, { LinkedApiError } from 'linkedapi-node';

async function customWorkflowExample(): Promise<void> {

  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API custom workflow example starting...');
    const customWorkflow = await linkedapi.executeCustomWorkflow({
      actionType: 'st.searchPeople',
      limit: 5,
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
    console.log('🔍 Workflow started: ', customWorkflow.workflowId);
    const result = (await customWorkflow.result()).data!;

    console.log('✅ Custom workflow executed successfully');
    console.log('🔍 Result: ', result.completion);
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