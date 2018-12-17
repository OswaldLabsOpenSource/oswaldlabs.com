# Oswald Labs Website

This is the repo for Oswald Labs' official website. It's built on Hugo as opposed to the previous version in Middleman.

## Todo before production

- [ ] Migration
- [ ] Rich Snippets docs, add all everywhere
- [ ] Screenshot API for meta image or platform image generator
- [ ] Remove robots.txt prevent
- [ ] Check current sitemap.xml and make redirects
- [ ] Dark theme/dyslexia theme for plugin footer
- [ ] Add Minify to Gulp build process

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
