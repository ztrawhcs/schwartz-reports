const TRANSPARENT_GIF = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));
const WEBHOOK_URL = 'https://tollcast.fly.dev/api/px-webhook';

export async function onRequest(context) {
  const trackingId = context.params.id.replace(/\.gif$/, '');
  const ip = context.request.headers.get('cf-connecting-ip') || '';
  const ua = context.request.headers.get('user-agent') || '';
  const ts = new Date().toISOString();

  context.waitUntil(
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ts, trackingId, ip, ua }),
    }).catch(() => {})
  );

  return new Response(TRANSPARENT_GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': TRANSPARENT_GIF.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
