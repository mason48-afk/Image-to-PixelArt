# PixelPress — image to pixel art

Browser-local PNG/JPEG/WebP converter. No accounts, image uploads, runtime dependencies or backend. Includes eight languages (English, Spanish, German, French, Portuguese, Chinese, Hindi, Arabic), palette reduction, optional ordered dithering, contrast, original/result comparison, transparent PNG output and integer-scaled exports.

## Build and test

Node 22 or newer. Run `npm test` (also builds) or `npm run build`. Serve `dist/` as static files. Cloudflare Pages: production branch `main`, build command `npm test`, output `dist`, repository root `/`.

Images are limited to 20 MB and 24 megapixels. Output is 8–256 columns with proportional height capped at 1024; exports are capped at 16 megapixels. For exact 32×32 or 64×64 output, use a square source. This is image pixelation/palette reduction, not a replacement for hand-drawn sprite animation.

## Domain and revenue setup

1. Add the purchased domain under Cloudflare Pages → this project → Custom domains.
2. Set `origin` in `site.config.json` to the final HTTPS origin and commit. This updates canonical URLs, language alternates, sitemap and robots.
3. Add that domain to AdSense Sites using the existing publisher account. Verification metadata and `/ads.txt` are already included. Submit for review; approval and revenue are not guaranteed.
4. Configure applicable consent messages in AdSense Privacy & messaging, review the privacy page to reflect the actual setup, and create two responsive display ad units. Put their slot IDs in `adSlots`, then enable `adsenseApproved` and `consentConfigured`. These flags are deployment gates, not a consent platform. Empty placeholders are invisible while ads are off.
5. Add the new domain to Amazon Associates' website list and confirm the existing `masonp48-20` tracking ID is valid for this property. Shopping links include that tag, paid-link labels and an Associate disclosure. They point to Amazon.com searches for drawing tablets, fuse bead kits and pixel-art books.
6. Submit `/sitemap.xml` in Google Search Console after domain verification. SEO checks validate technical implementation, not rankings, traffic or keyword difficulty.

About and privacy information are currently in English; the converter, controls and six FAQs are translated. Uploaded images never leave the browser. Affiliate destinations receive information when visited. Ads do not load until enabled above.

## Maintenance

`public/pixel.mjs`: pixel conversion. `public/app.mjs`: image I/O and controls. `public/locales.mjs`: translations and FAQs. `template.html` and `build.mjs`: localized static pages. `test.mjs`: conversion and static SEO checks.
