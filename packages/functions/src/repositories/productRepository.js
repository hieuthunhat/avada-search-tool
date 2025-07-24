const WeaviateClient = require('../services/weaviataClient');

async function searchProducts(searchQuery) {
  const client = WeaviateClient.initWeaviate();
  try {
    if (await client.isLive()) {
      const collectionExists = await client.collections.exists('Product');
      if (collectionExists) {
        const products = client.collections.get('Product');
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
      } else {
        console.log("Collection 'Product' does not exist.");
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  searchProducts
};
