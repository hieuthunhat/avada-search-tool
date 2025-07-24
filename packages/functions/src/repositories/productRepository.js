const WeaviateClient = require('../services/weaviataClient');
const {generateUuid5} = require('weaviate-client');

const className = 'ProductShopify2';

async function searchProducts(searchQuery) {
  const client = WeaviateClient.initWeaviate();
  try {
    if (!(await client.isLive())) {
      throw new Error('Service is not connected');
    }
    const collectionExists = await client.collections.exists(className);
    if (!collectionExists) {
      throw new Error(`Collection '${className}' does not exist.`);
    }
    const products = client.collections.get(className);
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
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function addProduct({product}) {
  const client = await WeaviateClient.initWeaviate();
  const products = client.collections.get(className);
  const uuid = generateUuid5(product.id.toString(), className);

  try {
    const exists = await products.data.exists(uuid);
    if (exists) throw new Error('Product existed');

    await products.data.insert({
      id: uuid,
      properties: {
        product_id: product.id.toString(),
        name: product.title,
        price: parseFloat(product.variants?.[0]?.price || 0),
        description: product.body_html || '',
        image: product.image?.src || '',
        category: product.product_type || '',
        productCategory: product.tags || '',
        type: product.vendor || '',
        rating: 0,
        stock: product.variants?.[0]?.inventory_quantity || 0,
        tags: product.tags || '',
        isActive: product.status === 'active',
        discount: 0
      }
    });
  } catch (error) {
    console.error('Error when adding product to Weaviate', error.message);
  }
}

async function updateProduct({product}) {
  const client = await WeaviateClient.initWeaviate();
  const products = client.collections.get(className);
  if (!products) throw new Error("Can't find product to update");
  const uuid = generateUuid5(product.id.toString(), className);

  const properties = {
    product_id: product.id.toString(),
    name: product.title,
    price: parseFloat(product.variants?.[0]?.price),
    description: product.body_html,
    image: product.image?.src,
    category: product.product_type,
    productCategory: product.tags,
    type: product.vendor,
    rating: 0,
    stock: product.variants?.[0]?.inventory_quantity,
    tags: product.tags,
    isActive: product.status,
    discount: 0
  };

  try {
    const exists = await products.data.exists(uuid);
    if (!exists) {
      throw new Error('Product not existed');
    }
    await products.data.update({id: uuid, properties});
  } catch (error) {
    console.error(error.message);
  }
}

const deleteProduct = async ({product}) => {
  const client = await WeaviateClient.initWeaviate();
  const products = client.collections.get(className);
  const uuid = generateUuid5(product.id.toString(), className);

  try {
    const exists = await products.data.exists(uuid);
    if (!exists) {
      throw new Error('Product not existed to delete');
    }
    await products.data.deleteById(uuid);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  searchProducts,
  addProduct,
  updateProduct,
  deleteProduct
};
