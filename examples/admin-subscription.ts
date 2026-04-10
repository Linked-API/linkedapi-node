import { LinkedApiAdmin, LinkedApiError } from '@linkedapi/node';

async function adminSubscriptionExample(): Promise<void> {
  const admin = new LinkedApiAdmin({
    linkedApiToken: process.env.LINKED_API_TOKEN!,
  });

  try {
    console.log('🚀 Linked API Admin Subscription example starting...');

    await getSubscriptionStatus(admin);
    await getSeats(admin);
    await getPricing(admin);

  } catch (error) {
    if (error instanceof LinkedApiError) {
      console.error('🚨 Linked API Error:', error.message);
      console.error('📝 Details:', error.details);
    } else {
      console.error('💥 Unknown error:', error);
    }
  }
}

async function getSubscriptionStatus(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n📊 Getting subscription status...');

  const status = await admin.subscription.getStatus();
  console.log('✅ Subscription status retrieved');
  console.log(`   Status: ${status.status ?? 'no subscription'}`);
  console.log(`   Cancel at period end: ${status.cancelAtPeriodEnd}`);
}

async function getSeats(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n💺 Getting subscription seats...');

  const { seats } = await admin.subscription.getSeats();
  console.log('✅ Seats retrieved');
  console.log(`   Total seat groups: ${seats.length}`);
  for (const seat of seats) {
    console.log(`   ${seat.seatType} × ${seat.quantity} (${seat.billingPeriod})`);
  }
}

async function getPricing(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n💰 Getting pricing information...');

  const { products } = await admin.subscription.getPricing();
  console.log('✅ Pricing retrieved');
  for (const product of products) {
    const price = (product.unitPrice / 100).toFixed(2);
    const currencySymbol = product.currency === 'eur' ? '€' : '$';
    console.log(`   ${product.seatType} ${product.billingPeriod}: ${currencySymbol}${price}/seat`);
  }
}

async function setSeats(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n🔧 Setting subscription seats...');

  const result = await admin.subscription.setSeats({
    quantity: 5,
    seatType: 'plus',
    billingPeriod: 'year',
  });

  if (result.status === 'complete') {
    console.log('✅ Seats updated successfully');
  } else {
    console.log('💳 Checkout required. Complete payment:');
    console.log(`   ${result.paymentLink}`);
  }
}

async function getBillingLink(admin: LinkedApiAdmin): Promise<void> {
  console.log('\n🔗 Getting billing portal link...');

  const { stripeLink } = await admin.subscription.getBillingLink();
  console.log('✅ Billing link retrieved');
  console.log(`   ${stripeLink}`);
}

if (require.main === module) {
  adminSubscriptionExample();
}
