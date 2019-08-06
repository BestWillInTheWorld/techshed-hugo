# techshed-hugo

## Create New Site
`hugo new site <sitename>`

## Adding a Theme
Ensure there's a themes directory in you Hugo site.

`cd` to that themes directory

`cd <site folder>/themes`

Clone the theme as a submodule:

```
git submodule add https://github.com/themefisher/infinity-hugo.git
```
Go back up to the site folder.  

Apply any theme alterations as overrides in this folder.  This is likely to involve replacing images and CSS.

Key places you might be editing are:
* `/static`
  * for images, css and favicon
* `/layouts`
  * for additional page layouts or overrides to the theme

In order to ensure required folders are available in the git repo, add an empty `.keep` file to the following locations:
* `/content`
* `/data`

## Adding Content for the Theme
Most themes populate the content via parameters. These parameters can be provided to the site via the Hugo config file (config.toml, config.json or config.yaml).

## Other Config (at the top of config.toml)
```toml
baseURL = "<root url of live site>"
languageCode = "en-gb"
title = "Techshed Frome"
theme = "infinity-hugo"
publishDir = "docs"
```

## Generating Site and Testing
* generate site: `hugo` - generates static site into `publishDir` from config (defaults to /public if not configured)
* local testing `hugo server`