import LinkedApi, { FUNCTION_NAME } from 'linkedapi-node';

async function example(): Promise<void> {
  // First run
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  const startHandler = await linkedapi.fetchPerson({
    personUrl: 'https://www.linkedin.com/in/example-person/',
    retrieveExperience: true,
    retrieveEducation: true,
  });

  const savedWorkflowId = startHandler.workflowId;

  // ... App stops here

  // App restart: rebuild LinkedApi client
  const linkedapiAfterRestart = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  const restoredHandler = await linkedapiAfterRestart.restoreWorkflow(
    savedWorkflowId,
    FUNCTION_NAME.fetchPerson,
  );

  // Or if you want to restore a raw workflow (for executeCustomWorkflow)
  const rawHandler = await linkedapiAfterRestart.restoreWorkflow(
    savedWorkflowId,
    FUNCTION_NAME.executeCustomWorkflow,
  );

  console.log("Restoration started: ", restoredHandler.workflowId);

  const result = await restoredHandler.result();
  if (result.data) {
    console.log("👤 Restored name:", result.data.name);
    console.log("💼 Restored experience:", result.data.experiences?.length);
    console.log("Restored result:", JSON.stringify(result, null, 2));
  }
  if (result.errors.length > 0) {
    console.error('🚨 Errors:', JSON.stringify(result.errors, null, 2));
  }

  const rawResult = await rawHandler.result();
  console.log("Raw result:", JSON.stringify(rawResult, null, 2));
}

if (require.main === module) {
  example();
}
