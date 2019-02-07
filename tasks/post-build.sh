#!/bin/bash

# purge cloudflare cache

echo "Uploading site maps to Google"
# notify google of sitemap change
curl 'http://www.google.com/webmasters/sitemaps/ping?sitemap=https://omardelarosa.com/sitemap.xml'