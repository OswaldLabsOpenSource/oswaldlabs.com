# Oswald Labs Website

This is the repo for Oswald Labs' official website. It's built on Hugo as opposed to the previous version in Middleman.

## Todo before production

- [ ] Migration
- [ ] Rich Snippets docs, add all everywhere
- [ ] Screenshot API for meta image or platform image generator
- [ ] Remove robots.txt prevent
- [x] Check current sitemap.xml and make redirects
- [ ] Dark theme/dyslexia theme for plugin footer
- [ ] Add Minify to Gulp build process
- [ ] Look into metas, titles
- [ ] Blog post ideas
   - [ ] Open Dyslexic results
   - [ ] A case for web accessibility plugins
   - [ ] Translation with Netlify prerender for /nl URLs

## Development

Run a local Gulp/Hugo server:

```bash
yarn serve
```

Run Prettier while writing CSS or JS:

```bash
yarn prettier
```

## Production

Just pust to `master` branch and Netlify will deploy (currently set to temp URL)
