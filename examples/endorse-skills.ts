import LinkedApi, { LinkedApiError } from '@linkedapi/node';

async function endorseSkillsExample(): Promise<void> {
  const linkedApi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });
  const personUrl = 'https://www.linkedin.com/in/example-person';

  try {
    const workflow = await linkedApi.endorsePersonSkill.execute({
      personUrl,
      skillName: 'Project Management',
    });
    const result = await linkedApi.endorsePersonSkill.result(workflow.workflowId);
    if (result.errors.length > 0) {
      console.error('Skill endorsement failed:', result.errors);
    } else {
      console.log('Skill endorsed successfully');
    }

    const skillsWorkflow = await linkedApi.endorsePersonSkills.execute({
      personUrl,
      skillNamePatterns: ['business', 'project\\s*manage'],
    });
    const skillsResult = await linkedApi.endorsePersonSkills.result(skillsWorkflow.workflowId);
    if (skillsResult.errors.length > 0) {
      console.error('Unable to read the profile skills:', skillsResult.errors);
    }
    for (const { skillName, success, error } of skillsResult.data ?? []) {
      if (success) {
        console.log('Endorsed:', skillName);
      } else {
        console.error('Endorsement failed:', skillName, error);
      }
    }
  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('Linked API error:', error.type, error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

if (require.main === module) {
  void endorseSkillsExample();
}
