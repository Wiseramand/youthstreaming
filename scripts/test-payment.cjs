const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testPayment() {
  try {
    console.log('Testing Stripe Payment Integration...');
    
    // Test 1: Create a test customer
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test Customer',
      description: 'Test customer for Youth Angola Streaming',
    });
    
    console.log('✓ Customer created:', customer.id);
    
    // Test 2: Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      customer: customer.id,
      description: 'Test donation for Youth Angola Streaming',
      metadata: {
        userId: 'test-user-id',
        purpose: 'donation'
      }
    });
    
    console.log('✓ Payment Intent created:', paymentIntent.id);
    console.log('✓ Client Secret:', paymentIntent.client_secret);
    
    // Test 3: Confirm payment intent (test mode)
    const confirmedPayment = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      { payment_method: 'pm_card_visa' }
    );
    
    console.log('✓ Payment confirmed:', confirmedPayment.status);
    
    // Test 4: Create a test product
    const product = await stripe.products.create({
      name: 'VIP Membership',
      description: 'Monthly VIP access to exclusive content',
    });
    
    console.log('✓ Product created:', product.id);
    
    // Test 5: Create a test price
    const price = await stripe.prices.create({
      unit_amount: 2500, // $25.00
      currency: 'usd',
      recurring: { interval: 'month' },
      product: product.id,
    });
    
    console.log('✓ Price created:', price.id);
    console.log('✓ All payment tests passed!');
    
  } catch (error) {
    console.error('❌ Payment test failed:', error.message);
  }
}

// Run the test
if (process.env.STRIPE_SECRET_KEY) {
  testPayment();
} else {
  console.log('⚠️  Stripe secret key not configured. Set STRIPE_SECRET_KEY environment variable.');
  console.log('For testing, use your test secret key from: https://dashboard.stripe.com/test/apikeys');
}