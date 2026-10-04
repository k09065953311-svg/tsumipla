// 積みプラ帳 Yahoo!ショッピング中継（Cloudflare Worker）
// Yahoo!の商品検索はブラウザから直接呼べない（CORS非対応）ため、ここで代わりに問い合わせて返す。
// 下の APPID に自分の Yahoo! Client ID を入れてから Deploy してください（マニュアルの「コードをコピー」を使うと自動で入ります）。
const APPID = 'ここにYahooのClientIDを貼る';
const ALLOW_ORIGIN = 'https://k09065953311-svg.github.io'; // このアプリ以外からは使わせない

export default {
  async fetch(request) {
    const cors = { 'Access-Control-Allow-Origin': ALLOW_ORIGIN, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Vary': 'Origin' };
    const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.headers.get('Origin') !== ALLOW_ORIGIN) return json({ error: 'forbidden', error_description: '積みプラ帳からのみ使えます' }, 403);

    const url = new URL(request.url);
    const params = new URLSearchParams();
    for (const key of ['jan_code', 'query', 'results', 'image_size']) {
      const v = url.searchParams.get(key);
      if (v) params.set(key, v.slice(0, 200));
    }
    if (!params.get('jan_code') && !params.get('query')) return json({ error: 'bad_request', error_description: '検索語がありません' }, 400);
    params.set('appid', APPID);

    const res = await fetch('https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?' + params, { cf: { cacheTtl: 86400, cacheEverything: true } });
    return new Response(res.body, { status: res.status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  },
};
