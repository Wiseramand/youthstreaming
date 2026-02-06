# Stripe Payment Setup Guide

## Configuring Stripe for Youth Angola Streaming

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in to your account
3. In the left sidebar, click on "Developers" → "API keys"
4. Copy your **Test Secret Key** (starts with `sk_test_`)

### 2. Environment Configuration

Add your Stripe keys to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Webhook Setup

1. In Stripe Dashboard, go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Set the URL to: `https://your-backend-url.com/api/webhook/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Copy the webhook secret and add it to your `.env` file

### 4. Testing Payments

Use these test card numbers for testing:

**Successful payments:**
- 4242 4242 4242 4242 (Visa)
- 5555 5555 5555 4444 (Mastercard)

**Failed payments:**
- 4000 0000 0000 9995 (Card declined)

### 5. Production Setup

When ready for production:

1. Switch to live mode in Stripe Dashboard
2. Replace test keys with live keys in your `.env` file
3. Update webhook endpoint to production URL
4. Test thoroughly before going live

### 6. Testing the Integration

Run the payment test script:

```bash
node scripts/test-payment.cjs
```

This will test:
- Customer creation
- Payment intent creation
- Payment confirmation
- Product and price creation

### 7. Important Notes

- Never commit your `.env` file to version control
- Use test mode during development
- Monitor your Stripe dashboard for successful transactions
- Set up proper error handling in your application
- Consider implementing fraud detection and chargeback protection

### 8. Support

For Stripe integration issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [API Reference](https://stripe.com/docs/api)