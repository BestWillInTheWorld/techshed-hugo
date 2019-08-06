# techshed-hugo

Which static site builder?

There are a huge number to choose from, each using different templating and configutation.  Some build faster, some give access to more modern PWA features or SPA structure.  Most provide really performant, secure way to build static content, allowing a variety of options for free, reliable hosting.

In addition, headless CMS can be used with most static site builders to enable easy content management without requiring developer involvement in simple changes to the text on a site, or the creation of a new web page.

Initially, I've selected for its strong dev community, proven/stable reputation, quick builds and published site performance, widespread hosting support and reducing the need for contributors to learn specific frameworks to get involved.

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

In order to ensure required folders are available in the git repo, add an empty `.keep` file to the following locations (particularly necessary if you're deploying to Netlify):
* `/content`
* `/data`
* `/public`

## Adding Content for the Theme
Most themes populate the content via parameters. These parameters can be provided to the site via the Hugo config file (config.toml, config.json or config.yaml).

The Hugo config enables scoping of parameters to a specific context within the site e.g. to expose values just to the "navigation" partial layout for our theme, we can use:

```toml
[params]

    # Navigation
    [params.navigation]
        logo = "images/logo.png"
        home = "Home"
        about = "About"
        service = "What"
        posts = "Blog"
        contact = "Contact"
```

## Global Config (at the top of config.toml)
Values in the global scope are used as [build parameters for Hugo](https://gohugo.io/getting-started/configuration/#all-configuration-settings) when running the `hugo` command to build the site e.g.

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

## Adding Netlify CMS Support

THe process below describes the [manual process for addin NetlifyCMS](https://www.netlifycms.org/docs/add-to-your-site/) into the site, since initially, I'm looking for the simplest build chain to get our static site generated, with a headless CMS to manage content sections and create new posts.

* Create a new admin folder to host the CMS in `/static/admin`.
* Inside the admin folder, create an index.html file
* Populate `/admin/index.html` with the code below (from the [NetlifyCMS docs](https://www.netlifycms.org/docs/add-to-your-site/))
```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Content Manager</title>
    </head>
    <body>
        <!-- Include the script that builds the page and powers Netlify CMS -->
        <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
    </body>
</html>
```
* Create `/admin/config.yml`
  * since we're hosting on Netlify, using their git-backend plugin to drive the build from source code on GitHub, we need to add the following config to tell the CMS how to commit the code.  We'll also configure the option to enable draft posts and image/media uploads via the CMS.
```yml
backend:
  name: git-gateway
  branch: master # Branch to update (optional; defaults to master)
# Enable "drafts" in CMS workflow
publish_mode: editorial_workflow
# Media files will be stored in the repo under static/images/uploads
media_folder: "static/images/uploads" 
# The src attribute for uploaded media will begin with /images/uploads
public_folder: "/images/uploads" 
``` 
* Since we're hosting on Netlify, their Identity sevice is available to wire-up identity & authentication to GitHub.
  * I've already enabled this in the Netlify hosting config following their [docs](https://www.netlifycms.org/docs/add-to-your-site/).
  * We also need to wire this into the `/admin/index.html` page and our default `\index.html` page for the whole site by adding the following into the `<head>` section of those pages:
    * `<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>`
    * In our case, the theme we're using has a full layout for `/index.html` the following assumes you're using a template of a similar structure, if not, you'll need to work out what's controlling the `<head>` for your site's `index.html` and follow a simlar process for that file.
      * We need to make sure we've overridden the default version using `/layouts/index.html` and make the changes in there 
      * We had already overridden for the `index.html` layout for some layout/CSS/content tweaks - if you haven't then copy the `index.html` from your template into `/layouts/index.html` as a starting point
    * In the site's main index page, we also need to add script to redirect CMS users to ensure they end up in the admin section adter authenticating with Netlify's Identity service:
      * Add the following to the bottom of the `<body>` section of `/layouts/index.html` just before the closing `</body>` tag:
```html
  <script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```
* I'll look at the templating of blog posts and new pages later