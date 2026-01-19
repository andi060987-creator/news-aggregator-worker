export default {
  async fetch(request) {
    return new Response('✅ News Aggregator Worker - LIVE!', {
      headers: { 'content-type': 'text/plain' }
    });
  }
};
