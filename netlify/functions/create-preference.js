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
    // 1. Parsear datos del formulario
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

    // 2. Guardar lead en Supabase
    if (nombre || email) {
      const SUPABASE_URL = 'https://xgrqpuhbkxdrlxgdkxqr.supabase.co/rest/v1/brujo_rodrigo_leads';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncnFwdWhia3hkcmx4Z2RreHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzYzMzEsImV4cCI6MjEwNTkxMjMzMX0.TkpTE_o8z1sthAYB-83sGS3SAJErYqIy813bLSgXe4o';

      try {
        const supaRes = await fetch(SUPABASE_URL, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ nombre, telefono, email, pais })
        });
        console.log('Supabase status:', supaRes.status);
        if (!supaRes.ok) {
          const errText = await supaRes.text();
          console.error('Supabase error:', errText);
        }
      } catch (supaErr) {
        console.error('Supabase fetch error:', supaErr.message);
      }
    }

    // 3. Crear preferencia en MercadoPago
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            title: 'Punto de Quiebre y Activación Energética - Brujo Rodrigo',
            quantity: 1,
            unit_price: 24990,
            currency_id: 'ARS'
          }
        ],
        payer: {
          name: nombre,
          email: email
        },
        back_urls: {
          success: 'https://chat.whatsapp.com/JYww1H2KlkQ2V5GSmud8vw?s=cl&p=i&mlu=0&ilr=4',
          failure: 'https://ayresdebahia.com',
          pending: 'https://ayresdebahia.com'
        },
        auto_return: 'approved'
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ init_point: data.init_point })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
