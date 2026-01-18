export async function categorizeWithGemini(text, apiKey) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const prompt = `Kategorikan berita berikut ke dalam SATU kategori saja. Pilih dari: Politik, Ekonomi, Olahraga, Teknologi, Hiburan, Kesehatan, Internasional, Daerah, Kriminal, Pendidikan.

Berita: "${text}"

Jawab HANYA dengan nama kategorinya saja, tidak perlu penjelasan.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    
    return 'Umum';
  } catch (error) {
    console.error('Error categorizing with Gemini:', error);
    return 'Umum';
  }
}

export async function extractKeywords(text, apiKey) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const prompt = `Extract 5 keywords/tags paling penting dari berita berikut:

"${text}"

Jawab dalam format: keyword1, keyword2, keyword3, keyword4, keyword5`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return '';
  }
}
