const ChatRepository = require('../repositories/chatRepository');

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

    const results = await ChatRepository.searchProducts(query);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        query,
        movies: (results?.objects || []).map(movie => ({
          id: movie.uuid,
          title: movie.properties?.title ?? 'Untitled',
          overview: movie.properties?.overview ?? '',
          vote_average: movie.properties?.vote_average ?? null,
          release_date: movie.properties?.release_date ?? null,
          distance: movie.metadata?.distance ?? null
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
