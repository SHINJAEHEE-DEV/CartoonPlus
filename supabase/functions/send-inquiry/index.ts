// Public inquiry endpoint. Secrets and recipient are configured in Supabase, never in the client.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const recipient = Deno.env.get('INQUIRY_RECIPIENT');
  const sender = Deno.env.get('INQUIRY_SENDER');
  const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!apiKey || !recipient || !sender || !turnstileSecret) return json(503, { error: 'Service unavailable' });
  try {
    if (Number(req.headers.get('content-length') || 0) > 12000) return json(413, { error: 'Request too large' });
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 12000) return json(413, { error: 'Request too large' });
    const body = JSON.parse(raw);
    const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
    const type = clean(body.type, 20);
    const name = clean(body.name, 80);
    const phone = clean(body.phone, 40);
    const message = clean(body.message, 4000);
    const region = clean(body.region, 100);
    const schedule = clean(body.schedule, 100);
    const token = clean(body.turnstileToken, 2048);
    if (!['franchise', 'general'].includes(type) || !name || !phone || !message || !token || body.consent !== true) return json(400, { error: 'Invalid request' });
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: turnstileSecret, response: token }),
    });
    const result = await verification.json();
    if (!verification.ok || result.success !== true) return json(403, { error: 'Verification failed' });
    const category = type === 'franchise' ? '가맹 상담' : '일반·제휴 문의';
    const text = [`문의 유형: ${category}`, `성명: ${name}`, `연락처: ${phone}`, ...(type === 'franchise' ? [`희망 지역: ${region || '미입력'}`, `희망 시기: ${schedule || '미입력'}`] : []), '', '문의 내용:', message].join('\n');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: sender, to: [recipient], subject: `[카툰플러스] ${category}`, text }),
    });
    if (!response.ok) return json(502, { error: 'Email delivery failed' });
    return json(200, { ok: true });
  } catch {
    return json(500, { error: 'Request failed' });
  }
});
