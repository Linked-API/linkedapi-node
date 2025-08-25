import LinkedApi, { LinkedApiError } from 'linkedapi-node';

async function statisticsExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Statistics example starting...');

    await retrieveSSI(linkedapi);
    await retrievePerformance(linkedapi);
    await getRecentUsageStats(linkedapi);

  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function retrieveSSI(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📊 Retrieving SSI (Social Selling Index)...');

  const workflowId = await linkedapi.retrieveSSI.execute();
  console.log('📊 Retrieve SSI workflow started:', workflowId);

  const ssiResult = (await linkedapi.retrieveSSI.result(workflowId)).data!;
  console.log('✅ SSI retrieval completed');
  console.log(`📈 SSI Score: ${ssiResult.ssi}/100`);
  console.log(`🏆 Industry Top: ${ssiResult.industryTop}%`);
  console.log(`🌐 Network Top: ${ssiResult.networkTop}%`);
  if (ssiResult.ssi >= 75) {
    console.log('   🌟 Excellent SSI score! You\'re in the top tier.');
  } else if (ssiResult.ssi >= 50) {
    console.log('   👍 Good SSI score. Room for improvement.');
  } else {
    console.log('   📈 Consider improving your social selling activities.');
  }
}

async function retrievePerformance(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📈 Retrieving Performance Statistics...');

  const workflowId = await linkedapi.retrievePerformance.execute();
  console.log('📈 Retrieve performance workflow started:', workflowId);

  const performanceResult = (await linkedapi.retrievePerformance.result(workflowId)).data!;
  console.log('✅ Performance retrieval completed');
  console.log(`👥 Followers: ${performanceResult.followersCount.toLocaleString()}`);
  console.log(`👀 Post Views (Last 7 Days): ${performanceResult.postViewsLast7Days.toLocaleString()}`);
  console.log(`🔍 Profile Views (Last 90 Days): ${performanceResult.profileViewsLast90Days.toLocaleString()}`);
  console.log(`🔎 Search Appearances (Previous Week): ${performanceResult.searchAppearancesPreviousWeek.toLocaleString()}`);
}


async function getRecentUsageStats(linkedapi: LinkedApi): Promise<void> {
  console.log('\n📊 Getting usage statistics for the last 7 days...');

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  const apiUsage = await linkedapi.getApiUsage({
    start: startDate.toISOString(),
    end: endDate.toISOString()
  });

  console.log('✅ API Usage retrieved successfully');
  console.log(`📈 Total actions executed: ${apiUsage.length || 0}`);

  if (apiUsage.length > 0) {
    console.log('\n📋 Recent actions:');
    apiUsage.slice(0, 10).forEach((action) => {
      const status = action.success ? '✅' : '❌';
      const date = new Date(action.time).toLocaleDateString();
      const time = new Date(action.time).toLocaleTimeString();
      console.log(`   ${status} ${action.actionType} - ${date} ${time}`);
    });
  }
}

if (require.main === module) {
  statisticsExample();
}
