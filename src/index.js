export default {
  async fetch(request, env) {
    const apiKey = env.GEMINI_API_KEY;
    
    // Use API key untuk call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return new Response('API called!');
  }
}
