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
 * Base URL for webhook endpoints using ngrok tunnel
 * @type {string}
 */
const webhookBaseUrl = `${process.env.NGROK_URL}/avada-search-tool/us-central1/webhook/products`;

/**
 * Create a new Shopify webhook for product events
 * @async
 * @function createWebhook
 * @param {string} topic - Shopify webhook topic (e.g., 'products/create', 'products/update', 'products/delete')
 * @param {string} endpoint - Webhook endpoint path (e.g., 'create', 'update', 'delete')
 * @returns {Promise<Object|undefined>} Created webhook object or undefined if creation fails
 * @throws {Error} Throws error if webhook creation fails
 */
async function createWebhook(topic, endpoint) {
  try {
    const webhook = await shopify.webhook.create({
      topic,
      address: `${webhookBaseUrl}/${endpoint}`,
      format: 'json'
    });
    console.log(`Webhook for ${topic} created:`, webhook);
    return webhook;
  } catch (error) {
    console.error(`Error creating webhook for ${topic}:`, error.message);
  }
}

/**
 * List all existing Shopify webhooks for the store
 * @async
 * @function listWebhooks
 * @returns {Promise<Array|undefined>} Array of existing webhook objects or undefined if listing fails
 * @throws {Error} Throws error if webhook listing fails
 */
async function listWebhooks() {
  try {
    const webhooks = await shopify.webhook.list();
    console.log('Existing webhooks:', webhooks);
    return webhooks;
  } catch (error) {
    console.error('Error listing webhooks:', error.message);
  }
}

/**
 * Delete a Shopify webhook by ID
 * @async
 * @function deleteWebhook
 * @param {number|string} webhookId - The ID of the webhook to delete
 * @returns {Promise<void>} Promise that resolves when webhook is deleted
 * @throws {Error} Throws error if webhook deletion fails
 */
async function deleteWebhook(webhookId) {
  try {
    await shopify.webhook.delete(webhookId);
    console.log(`Webhook ${webhookId} deleted`);
  } catch (error) {
    console.error('Error deleting webhook:', error.message);
  }
}

/**
 * Setup all required product webhooks for real-time synchronization
 * @async
 * @function setup
 * @returns {Promise<void>} Promise that resolves when all webhooks are set up
 * @throws {Error} Throws error if webhook setup process fails
 */
async function setup() {
  console.log('Listing existing webhooks...');
  await listWebhooks();

  console.log('Creating product webhooks...');
  await createWebhook('products/create', 'create');
  await createWebhook('products/update', 'update');
  await createWebhook('products/delete', 'delete');

  console.log('All webhooks set up!');
}

setup();

/**
 * Module exports for webhook management functions
 * @exports createWebhook - Function to create individual webhooks
 * @exports listWebhooks - Function to list existing webhooks
 * @exports deleteWebhook - Function to delete webhooks by ID
 */
module.exports = {
  createWebhook,
  listWebhooks,
  deleteWebhook
};
