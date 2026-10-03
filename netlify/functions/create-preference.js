exports.handler = async (event) => {
  const ACCESS_TOKEN = 'APP_USR-5827827854134964-093017-c5fc0f820ccf28854affd98c0038772a-59581519';

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    let nombre = '', telefono = '', email = '', pais = '';
    if (event.body) {
      try {
        const body = JSON.parse(event.body);
        nombre   = body.nombre   || '';
        telefono = body.telefono || '';
        email    = body.email    || '';
        pais     = body.pais     || '';
      } catch (_) {}
    }

    if (nombre || email) {
      const SUPABASE_URL = 'https://xgrqpuhbkxdrlxgdkxqr.supabase.co/rest/v1/brujo_rodrigo_leads';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncnFwdWhia3hkcmx4Z2RreHF
