import LinkedApi, { LinkedApiError, SIGNAL_EVENT_TYPE, SIGNAL_TYPE } from '@linkedapi/node';

async function signalsExample(): Promise<void> {
  const linkedapi = new LinkedApi({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
    identificationToken: process.env.IDENTIFICATION_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Signals example starting...');

    const signalId = await createSignal(linkedapi);
    await listSignals(linkedapi);
    await pollSignals(linkedapi, '2026-10-12T00:00:00Z');

    await linkedapi.pauseSignal({ signalId });
    await linkedapi.resumeSignal({ signalId });
    await linkedapi.deleteSignal({ signalId });
  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.type, error.message);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function createSignal(linkedapi: LinkedApi): Promise<string> {
  const { data: signal } = await linkedapi.createSignal({
    type: SIGNAL_TYPE.personPosts,
    personUrl: 'https://www.linkedin.com/in/example-person',
    label: 'lead-1042',
  });
  console.log('✅ Signal:', signal?.id, signal?.status, signal?.nextCheckAt);

  return signal!.id;
}

async function listSignals(linkedapi: LinkedApi): Promise<void> {
  const { data } = await linkedapi.getSignals({ status: 'active' });
  data?.signals.forEach((signal) => {
    console.log(`📡 ${signal.type} ${signal.label ?? ''} next check ${signal.nextCheckAt}`);
  });
}

// Pass the `detectedAt` of the newest event you already have as `since`, and handle each event once by its `id`.
async function pollSignals(linkedapi: LinkedApi, since: string): Promise<void> {
  const { data } = await linkedapi.pollSignals({ since });
  for (const event of data?.events ?? []) {
    switch (event.type) {
      case SIGNAL_EVENT_TYPE.postPublished:
      case SIGNAL_EVENT_TYPE.postFound:
        console.log(`📝 ${event.label}: ${event.post.url}`);
        break;
      case SIGNAL_EVENT_TYPE.commentAdded:
        console.log(`💬 ${event.postUrl}: ${event.comment.text}`);
        break;
      case SIGNAL_EVENT_TYPE.reactionAdded:
        console.log(`👍 ${event.postUrl}: ${event.reaction.type}`);
        break;
      case SIGNAL_EVENT_TYPE.profileViewed:
        console.log(`👀 ${event.viewer.name} (${event.viewer.publicUrl})`);
        break;
      default:
        console.log(`🤝 ${event.type}: ${event.personUrl}`);
    }
  }
}

if (require.main === module) {
  signalsExample();
}
