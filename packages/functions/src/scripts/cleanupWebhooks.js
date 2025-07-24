import Shopify from 'shopify-api-node';
import dotenv from 'dotenv';
dotenv.config();

const shopify = new Shopify({
  shopName: 'avada-search-tool',
  accessToken: process.env.SHOPIFY_API_KEY
});

async function deleteAllWebhooks() {
  try {
    const webhooks = await shopify.webhook.list();
    console.log(`Found ${webhooks.length} webhooks to delete`);
    for (const webhook of webhooks) {
      console.log(`Deleting webhook ${webhook.id}: ${webhook.topic} -> ${webhook.address}`);
      await shopify.webhook.delete(webhook.id);
      console.log(`✅ Deleted webhook ${webhook.id}`);
    }
    console.log('🧹 All webhooks cleaned up!');
  } catch (error) {
    console.error('❌ Error cleaning up webhooks:', error);
  }
}

deleteAllWebhooks();
