const Shopify = require('shopify-api-node');
const dotenv = require('dotenv');
dotenv.config();

const shopify = new Shopify({
  shopName: 'avada-search-tool',
  accessToken: process.env.SHOPIFY_API_KEY
});

const webhookBaseUrl =
  'https://44978aa6be18.ngrok-free.app/avada-search-tool/us-central1/webhook/products';

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

async function listWebhooks() {
  try {
    const webhooks = await shopify.webhook.list();
    console.log('Existing webhooks:', webhooks);
    return webhooks;
  } catch (error) {
    console.error('Error listing webhooks:', error.message);
  }
}

async function deleteWebhook(webhookId) {
  try {
    await shopify.webhook.delete(webhookId);
    console.log(`Webhook ${webhookId} deleted`);
  } catch (error) {
    console.error('Error deleting webhook:', error.message);
  }
}

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

module.exports = {
  createWebhook,
  listWebhooks,
  deleteWebhook
};
