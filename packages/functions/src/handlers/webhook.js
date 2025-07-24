import App from 'koa';
import router from '@functions/routes/webhook';

const webhookApi = new App();
webhookApi.proxy = true;
webhookApi.use(router.allowedMethods());
webhookApi.use(router.routes());

webhookApi.on('error', (error, ctx) => {
  console.error('Webhook error:', error);
});

export default webhookApi;
