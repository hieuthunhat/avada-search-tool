const ProductRepository = require('../repositories/productRepository');

async function searchProduct(ctx) {
  try {
    const query = ctx.query?.query;

    if (!query) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Query parameter is required',
        data: null
      };
      return;
    }

    const results = await ProductRepository.searchProducts(query);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        answer: results.generative.text,
        products: (results?.objects || []).map(product => ({
          id: product.uuid,
          name: product.properties?.name ?? 'Unnamed',
          price: product.properties?.price ?? '0',
          image: product.properties?.image ?? '',
          tags: product.properties?.tags ?? [],
          type: product.properties?.type ?? '',
          description: product.properties?.description ?? ''
        }))
      }
    };
  } catch (error) {
    console.error('Error in searchProduct controller:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Internal server error',
      data: null
    };
  }
}

module.exports = {
  searchProduct
};
