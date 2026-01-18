export async function fetchNews(apiKey) {
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=id&language=id&timeframe=15`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsData API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'success' && data.results) {
      return data.results;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}
