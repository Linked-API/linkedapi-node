import { LinkedApiAdmin, LinkedApiError, parseWebhookEvent } from '@linkedapi/node';
import express from 'express';

// 1. Register a webhook and inspect deliveries via the admin client.
async function manageWebhook(): Promise<void> {
  const admin = new LinkedApiAdmin({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
  });

  try {
    console.log('🚀 Registering webhook...');

    const webhook = await admin.webhooks.set({
      url: 'https://example.com/hooks/linkedapi',
      payloadMode: 'fat',
    });
    console.log(`✅ Webhook ${webhook.id} → ${webhook.url}`);

    // Verify the endpoint end-to-end without waiting for a real event.
    await admin.webhooks.sendTest();

    const deliveries = await admin.webhooks.deliveries();
    console.log(`📬 Recent deliveries: ${deliveries.length}`);
    for (const delivery of deliveries) {
      console.log(`   ${delivery.eventType} → ${delivery.status} (attempts: ${delivery.attempts})`);
    }
  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

// 2. Receive events. Capture the RAW body so the payload is parsed exactly as delivered.
function startReceiver(): void {
  const app = express();
  app.use(express.raw({ type: 'application/json' }));

  app.post('/hooks/linkedapi', (req, res) => {
    const event = parseWebhookEvent(req.body as Buffer);

    switch (event.type) {
      case 'workflow.completed':
        console.log(`Workflow ${event.data.workflowId} finished: ${event.data.status}`);
        console.log('Result:', event.data.result);
        break;
      case 'account.reconnectionRequired':
        console.log(`Account ${event.data.accountId} needs reconnection — pause campaigns.`);
        break;
      case 'webhook.test':
        console.log('Test event received:', event.data.message);
        break;
      default:
        console.log(`Event ${event.type}`);
    }

    // Acknowledge fast (2xx). Non-2xx makes Linked API retry with backoff.
    res.sendStatus(200);
  });

  app.listen(3000, () => console.log('👂 Listening for webhooks on :3000'));
}

void manageWebhook();
startReceiver();
