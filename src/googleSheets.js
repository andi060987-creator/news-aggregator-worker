export async function updateSpreadsheet(newsData, env) {
  try {
    const spreadsheetId = env.GOOGLE_SHEET_ID || await createNewSheet(env);
    
    const rows = newsData.map(news => [
      news.title,
      news.summary,
      news.url,
      news.category,
      news.date,
      news.source,
      news.thumbnail,
      news.keywords
    ]);
    
    await appendToSheet(spreadsheetId, rows, env);
    
    console.log('✅ Spreadsheet updated successfully');
    return spreadsheetId;
  } catch (error) {
    console.error('Error updating spreadsheet:', error);
    throw error;
  }
}

async function appendToSheet(spreadsheetId, rows, env) {
  const url = `https://script.google.com/macros/s/${env.GOOGLE_APPS_SCRIPT_ID}/exec`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'append',
      spreadsheetId: spreadsheetId,
      data: rows
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to append to sheet');
  }
  
  return await response.json();
}

async function createNewSheet(env) {
  const url = `https://script.google.com/macros/s/${env.GOOGLE_APPS_SCRIPT_ID}/exec`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create',
      title: 'News Aggregator - Auto Generated'
    })
  });
  
  const data = await response.json();
  return data.spreadsheetId;
}
