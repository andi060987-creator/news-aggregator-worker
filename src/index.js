export default {
  async scheduled(event, env, ctx) {
    console.log('Cron triggered!', new Date().toISOString());
  },

  async fetch(request, env) {
    return new Response('News Aggregator Worker is running! ✅', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
