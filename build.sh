#!/bin/sh
# src/app.html から GitHub Pages 用 index.html と、プレビュー用 artifact.html を作る
set -e
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  printf '<meta name="theme-color" content="#1D4FD7">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icon-192.png">\n<link rel="icon" href="icon-192.png">\n'
  printf '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="積みプラ帳">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%%}</style>\n</head>\n<body>\n'
  sed 's#<!--ZXING-->#<script src="lib/zxing.min.js"></script>#' src/app.html
  printf '\n</body>\n</html>\n'
} > index.html
sed 's#<!--ZXING-->#<script src="https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js"></script>#' src/app.html > artifact.html
echo built
