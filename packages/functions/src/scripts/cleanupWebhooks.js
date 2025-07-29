const Shopify = require('shopify-api-node');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Shopify API client instance
 * @type {Shopify}
 */
const shopify = new Shopify({
  shopName: 'avada-search-tool',
  accessToken: process.env.SHOPIFY_ACCESS_KEY
});

/**
 * Delete all existing webhooks from the Shopify store
 * @async
 * @function deleteAllWebhooks
 * @returns {Promise<void>} Promise that resolves when all webhooks are deleted
 * @throws {Error} Throws error if webhook listing or deletion fails
 */
async function deleteAllWebhooks() {
  try {
    const webhooks = await shopify.webhook.list();
    console.log(`Found ${webhooks.length} webhooks to delete`);

    for (const webhook of webhooks) {
      console.log(`Deleting webhook ${webhook.id}: ${webhook.topic} -> ${webhook.address}`);
      await shopify.webhook.delete(webhook.id);
      console.log(`Deleted webhook ${webhook.id}`);
    }

    console.log('All webhooks cleaned up!');
  } catch (error) {
    console.error('Error cleaning up webhooks:', error.message);
  }
}

deleteAllWebhooks();
