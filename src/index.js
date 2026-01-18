import { fetchNews } from './newsAPI.js';
import { categorizeWithGemini, extractKeywords } from './geminiAI.js';
import { updateSpreadsheet } from './googleSheets.js';
import { sendTelegramNotification } from './telegram.js';

export default {
  async scheduled(event, env, ctx) {
    try {
      console.log('🚀 Starting news aggregation...');
      
      const rawNews = await fetchNews(env.NEWSDATA_API_KEY);
      
      if (!rawNews || rawNews.length === 0) {
        console.log('⚠️ No news found');
        return;
      }

      const processedNews = [];
      
      for (const news of rawNews.slice(0, 10)) {
        try {
          const category = await categorizeWithGemini(news.title + ' ' + news.description, env.GEMINI_API_KEY);
          const keywords = await extractKeywords(news.title + ' ' + news.description, env.GEMINI_API_KEY);
          
          processedNews.push({
            title: news.title,
            summary: news.description || 'No summary available',
            url: news.link,
            category: category,
            date: news.pubDate || new Date().toISOString(),
            source: news.source_id || news.source_name || 'Unknown',
            thumbnail: news.image_url || '',
            keywords: keywords
          });
        } catch (error) {
          console.error('Error processing news:', error);
        }
      }

      if (processedNews.length > 0) {
        await updateSpreadsheet(processedNews, env);
        
        const message = `✅ *News Update*\n\n${processedNews.length} berita baru berhasil ditambahkan!\n\n` +
          `Kategori:\n${getCategorySummary(processedNews)}\n\n` +
          `Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;
        
        await sendTelegramNotification(message, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID);
        
        console.log(`✅ Successfully processed ${processedNews.length} news`);
      }

    } catch (error) {
      console.error('❌ Error in scheduled task:', error);
      
      await sendTelegramNotification(
        `❌ *Error in News Aggregator*\n\n${error.message}`,
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHAT_ID
      );
    }
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/trigger') {
      await this.scheduled(null, env, null);
      return new Response('News aggregation triggered!', { status: 200 });
    }
    
    return new Response('News Aggregator Worker is running!', { status: 200 });
  }
};

function getCategorySummary(news) {
  const categories = {};
  news.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1;
  });
  
  return Object.entries(categories)
    .map(([cat, count]) => `- ${cat}: ${count} berita`)
    .join('\n');
}
