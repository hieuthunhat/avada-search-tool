const axios = require('axios');
const {addProduct} = require('../repositories/productRepository');

/**
 * Synchronize all products from Shopify to Weaviate collection
 * @async
 * @function syncAllProducts
 * @returns {Promise<void>} Promise that resolves when all products are synced
 * @throws {Error} Throws error if Shopify API is unreachable or authentication fails
 * @example
 */
const syncAllProducts = async () => {
  try {
    let pageInfo = null;
    let hasMore = true;
    const syncedUuids = new Set();

    while (hasMore) {
      try {
        const params = {limit: 250};
        if (pageInfo) {
          params.page_info = pageInfo;
        }

        const res = await axios.get(
          `https://${process.env.SHOPIFY_STORE}/admin/api/2025-07/products.json`,
          {
            params,
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_KEY,
              'Content-Type': 'application/json'
            }
          }
        );

        const products = res.data.products;
        if (!products || products.length === 0) break;

        for (const product of products) {
          try {
            await addProduct({product});

            syncedUuids.add(product.id.toString());
          } catch (err) {
            console.error(`Failed to sync product ${product.id}:`, err.message);
          }
        }

        const linkHeader = res.headers.link;
        if (linkHeader && linkHeader.includes('rel="next"')) {
          const nextPageMatch = linkHeader.match(/page_info=([^&>]+)/);
          pageInfo = nextPageMatch ? nextPageMatch[1] : null;
          hasMore = !!pageInfo;
        } else {
          hasMore = false;
        }
      } catch (apiError) {
        console.error('Shopify API Error:', apiError.response?.data || apiError.message);
        break;
      }
    }

    console.log(`Successfully synced ${syncedUuids.size} products to Weaviate`);
  } catch (error) {
    console.error('Sync process failed:', error.message);
  }
};

/**
 * Module exports
 * @exports syncAllProducts
 */
module.exports = {
  syncAllProducts
};

syncAllProducts();
