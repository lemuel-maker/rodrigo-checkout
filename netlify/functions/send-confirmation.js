exports.handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const WHATSAPP_LINK = 'https://chat.whatsapp.com/JYww1H2KlkQ2V5GSmud8vw';

  try {
    const body = JSON.parse(event.body || '{}');
    const { nombre, email } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Email requerido' })
      };
    }

    const nombreDisplay = nombre || 'Gracias por tu compra';

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Bienvenido al Punto de Quiebre!</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:0 0 32px 0;">
              <p style="margin:0;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;">El Brujo Rodrigo</p>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0a00,#2d1500);border:1px solid #c9a84c;border-radius:12px;padding:48px 40px;text-align:center;">
              <p style="margin:0 0 16px 0;font-size:32px;">✨</p>
              <h1 style="margin:0 0 12px 0;font-size:28px;font-weight:700;color:#c9a84c;line-height:1.2;">¡Tu pago fue recibido!</h1>
              <p style="margin:0 0 32px 0;font-size:16px;color:#e8d5b0;">Hola ${nombreDisplay} — ya sos parte del evento</p>

              <div style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:20px;margin:0 0 32px 0;">
                <p style="margin:0;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">Punto de Quiebre</p>
                <p style="margin:4px 0 0 0;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">y Activación Energética</p>
                <p style="margin:16px 0 0 0;font-size:15px;color:#e8d5b0;">Jueves 22 de octubre · 19:30hs</p>
                <p style="margin:4px 0 0 0;font-size:15px;color:#e8d5b0;">En vivo por YouTube</p>
              </div>

              <p style="margin:0 0 24px 0;font-size:15px;color:#e8d5b0;line-height:1.6;">
                Gracias por confiar en este proceso. Rodrigo te espera para una noche de transformación profunda.
                El acceso al evento se enviará por el grupo de WhatsApp exclusivo para participantes.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" bgcolor="#c9a84c" style="border-radius:8px;">
                    <a href="${WHATSAPP_LINK}" target="_blank" style="display:inline-block;background-color:#c9a84c;color:#1a0a00;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:8px;letter-spacing:1px;font-family:Arial,sans-serif;">📱 Unirme al Grupo de WhatsApp</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">
                Este acceso es personal e intransferible. Guardá este email como comprobante.<br>
                ¿Tenés alguna consulta? Escribinos a soporte@ayresdebahia.com
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #222;padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#444;">
                El Brujo Rodrigo · Ayres de Bahía<br>
                <a href="https://ayresdebahia.com" style="color:#c9a84c;text-decoration:none;">ayresdebahia.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'El Brujo Rodrigo <soporte@ayresdebahia.com>',
        to: [email],
        subject: '✨ ¡Tu lugar en el Punto de Quiebre está confirmado!',
        html: htmlContent
      })
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', JSON.stringify(resendData));
      throw new Error(resendData.message || 'Error enviando email');
    }

    console.log('Email enviado:', resendData.id, 'a', email);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, id: resendData.id })
    };

  } catch (err) {
    console.error('send-confirmation error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
