const axios = require('axios');
const dotenv = require('dotenv');
const {initWeaviate} = require('../services/DBWeaviateService');
const {initCollection} = require('../services/WeaviateService');

dotenv.config();
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_KEY = process.env.SHOPIFY_API_KEY;

async function searchProducts(searchQuery) {
  try {
    const client = await initWeaviate();

    if (!(await client.isLive())) {
      throw new Error('Weaviate client is not live');
    }

    await initCollection();

    const collectionExists = await client.collections.exists('ProductShopify');
    if (collectionExists) {
      const products = client.collections.get('ProductShopify');
      const response = await products.generate.nearText(
        searchQuery,
        {
          groupedTask: `
          Bạn là một nhân viên tư vấn bán hàng. Hãy giới thiệu cho khách hàng danh sách các sản phẩm dưới đây. 
          Với mỗi sản phẩm, hãy:
          - Ghi rõ tên sản phẩm (name)
          - Ghi giá sản phẩm (price)
          - Tự mô tả ngắn gọn, hấp dẫn về sản phẩm dựa trên tên sản phẩm.
          Trình bày kết quả một cách tự nhiên, thân thiện.
          `
        },
        {limit: 5}
      );
      console.log(response.generative.text);
      return response;
    } else {
      console.log("Collection 'ProductShopify' does not exist.");
      return {generative: {text: 'No products found. Database not initialized.'}, objects: []};
    }
  } catch (error) {
    console.error('Error in searchProducts:', error);
    throw error;
  }
}

async function pullAllProductsFromShopify() {
  let allProducts = [];
  let endpoint = `https://${SHOPIFY_STORE}/admin/api/2025-07/products.json?limit=250`;
  let hasNextPage = true;

  const headers = {
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_KEY,
    'Content-Type': 'application/json'
  };

  while (hasNextPage) {
    try {
      const response = await axios.get(endpoint, {headers});
      const products = response.data.products;
      allProducts = allProducts.concat(products);

      const linkHeader = response.headers['link'];
      if (linkHeader && linkHeader.includes('rel="next"')) {
        const matched = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        endpoint = matched ? matched[1] : null;
        hasNextPage = !!endpoint;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error('Lỗi khi gọi API Shopify:', error.response?.data || error.message);
      throw error;
    }
  }

  console.log(`Đã lấy ${allProducts.length} sản phẩm từ Shopify`);
  return allProducts;
}

async function insertShopifyProducts(products) {
  const client = await initCollection();
  const collection = client.collections.get('ProductShopify');

  for (const product of products) {
    try {
      const productId = product.id.toString();

      const existing = await collection.query
        .where({path: ['product_id'], operator: 'Equal', valueText: productId})
        .limit(1)
        .do();

      if (existing.objects.length > 0) {
        console.log(`⚠️  Bỏ qua sản phẩm đã tồn tại: ${product.title}`);
        continue;
      }

      const image = product.image?.src || product.images?.[0]?.src || '';
      const tags = product.tags || '';
      const variants = product.variants?.[0] || {};
      const stock = variants.inventory_quantity ?? 0;
      const price = parseFloat(variants.price || 0);

      await collection.data.insert({
        product_id: productId,
        name: product.title,
        price,
        description: product.body_html || '',
        image,
        category: product.product_type || '',
        productCategory: product.vendor || '',
        type: product.product_type || '',
        rating: null,
        stock,
        tags,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        isActive: !product.status || product.status === 'active',
        discount: 0
      });

      console.log(`Đã thêm sản phẩm: ${product.title}`);
    } catch (err) {
      console.error(`Lỗi thêm sản phẩm ${product.title}:`, err.message);
    }
  }
}

async function addProduct(productData) {
  try {
    const client = await initWeaviate();
    await initCollection();

    const collection = client.collections.get('ProductShopify');
    const result = await collection.data.insert({
      product_id: productData.product_id,
      name: productData.title,
      price: productData.variants?.[0]?.price || '0',
      description: productData.body_html || '',
      handle: productData.handle,
      tags: productData.tags?.split(',') || [],
      image: productData.images?.[0]?.src || '',
      shopify_id: productData.id.toString()
    });

    console.log('Product added to Weaviate:', productData.title);
    return result;
  } catch (error) {
    console.error('Error adding product to Weaviate:', error);
    throw error;
  }
}

module.exports = {
  searchProducts,
  addProduct,
  pullAllProductsFromShopify,
  insertShopifyProducts
};
