# Oswald Labs Website

![Netlify status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fplatform.oswaldlabs.com%2Fnetlify-status%2F57369451-c166-4c9e-87e2-f51b86d4424e)

This is the repo for Oswald Labs' official website. It's built on Hugo as opposed to the previous version in Middleman.

## Todo before production

- [x] Migration
- [x] Rich Snippets docs, add all everywhere
- [x] Screenshot API for meta image or platform image generator
- [x] Check RSS feed and add dates for everything
- [x] Remove robots.txt prevent
- [x] Check current sitemap.xml and make redirects
- [x] Dark theme/dyslexia theme for plugin footer
- [x] Add Minify to Gulp build process
- [x] Look into metas, titles
= [x] Fix subnav active bug for secondary link
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
