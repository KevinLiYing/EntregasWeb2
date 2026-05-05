// src/services/slack.service.js
import fetch from 'node-fetch';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackError(error, req) {
  if (!SLACK_WEBHOOK_URL) return;
  const payload = {
    text: `:rotating_light: *Error 5XX en BildyApp*
*Timestamp:* ${new Date().toISOString()}
*Ruta:* ${req.originalUrl}
*Método:* ${req.method}
*Mensaje:* ${error.message}
*Stack:*
\
${error.stack}`
  };
  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // No hacer nada si falla el envío a Slack
  }
}
