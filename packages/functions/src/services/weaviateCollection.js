const weaviate = require('weaviate-client');
const dotenv = require('dotenv');
const WeaviateService = require('./weaviataClient');
dotenv.config();

const {configure} = weaviate;

/**
 * Initialize Weaviate collection for Shopify products
 * Creates ProductShopify2 collection with proper schema and AI configuration
 * @returns {Promise<Object>} Weaviate client instance
 */
async function initCollection() {
  const client = await WeaviateService.initWeaviate();

  try {
    if (await client.isLive()) {
      const collectionExists = await client.collections.exists('ProductShopify2');

      if (!collectionExists) {
        /**
         * Create Weaviate collection with complete product schema
         * Properties include:
         * - product_id: Shopify product ID (TEXT)
         * - name, description, category, tags: Product details (TEXT)
         * - price, rating, discount: Numeric values (NUMBER/INT)
         * - image: Product image URL (TEXT)
         * - createdAt, updatedAt: Timestamps (DATE)
         * - isActive: Product status (TEXT)
         */
        await client.collections.create({
          name: 'ProductShopify2',
          properties: [
            {name: 'product_id', dataType: configure.dataType.TEXT},
            {name: 'name', dataType: configure.dataType.TEXT},
            {name: 'price', dataType: configure.dataType.NUMBER},
            {name: 'description', dataType: configure.dataType.TEXT},
            {name: 'image', dataType: configure.dataType.TEXT},
            {name: 'category', dataType: configure.dataType.TEXT},
            {name: 'productCategory', dataType: configure.dataType.TEXT},
            {name: 'type', dataType: configure.dataType.TEXT},
            {name: 'rating', dataType: configure.dataType.NUMBER},
            {name: 'stock', dataType: configure.dataType.INT},
            {name: 'tags', dataType: configure.dataType.TEXT},
            {name: 'createdAt', dataType: configure.dataType.DATE},
            {name: 'updatedAt', dataType: configure.dataType.DATE},
            {name: 'isActive', dataType: configure.dataType.TEXT},
            {name: 'discount', dataType: configure.dataType.NUMBER}
          ],
          vectorizers: weaviate.configure.vectorizer.text2VecOpenAI(),
          generative: configure.generative.openAI()
        });

        console.log('ProductShopify2 collection created successfully with OpenAI vectorizer!');
      } else {
        console.log('Collection already exists.');
      }
    }
    return client;
  } catch (error) {
    console.error('Error:', error);
  }
}

initCollection();
