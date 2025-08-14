import LinkedApi from '../src';

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
    "fetchPerson",
  );

  // Or if you want to restore a raw workflow (for executeCustomWorkflow)
  const rawHandler = await linkedapiAfterRestart.restoreWorkflow(
    savedWorkflowId,
  );

  console.log("Restoration started: ", restoredHandler.workflowId);

  const result = await restoredHandler.result();
  console.log("👤 Restored name:", result.name);
  console.log("💼 Restored experience:", result.experiences?.length);
  console.log("Restored result:", JSON.stringify(result, null, 2));

  const rawResult = await rawHandler.result();
  console.log("Raw result:", JSON.stringify(rawResult, null, 2));
}

if (require.main === module) {
  example();
}
