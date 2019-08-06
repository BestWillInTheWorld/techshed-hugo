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

The Hugo config enables scoping of parameters to a specific namespace within the site e.g. to make it simpler to address values intended for the "navigation" partial layout for our theme, we can use:

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
That allows the partial layout to pull in values for use within the page, using Handlebars syntax for Hugo e.g.
```
{{ with .Site.Params.navigation.logo }}
<img src="{{ . }}" alt="logo">
{{ end }}
```
## Overriding Theme Elements
For our purposes, I've overridden the partial layout `hero-area.html` - which displays the main image at the top of the home page - in order to remove the conutdown timer from the original theme.  This is done by adding a copy of the theme's version of `hero-area.html` to `/layouts/partials/hero-area.html` and making changes there.

Similarly, other files from the theme, can be overridden by adding modified copies of the files to the relevant directory in the root of the project.

I've also overidden some CSS + several images via `/static/css/style.css` and `/static/images/` 

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
############
# required #
############
backend:
  name: git-gateway
  branch: master # Branch to update (optional; defaults to master)
# Media files will be stored in the repo under static/images/uploads
media_folder: "static/images/uploads" 
# The src attribute for uploaded media will begin with /images/uploads
public_folder: "/images/uploads"
# required, doesn't ahve to be in use
media_library:
  name: media_lib
  # required - below is besed on example from https://github.com/netlify/netlify-cms/blob/master/dev-test/config.yml
collections:
  - name: 'posts' # Used in routes, ie.: /admin/collections/:slug/edit
    label: 'Posts' # Used in the UI
    label_singular: 'Post' # Used in the UI, ie: "New Post"
    description: >
      The description is a great place for tone setting, high level information, and editing
      guidelines that are specific to a collection.
    folder: '_posts'
    slug: '{{year}}-{{month}}-{{day}}-{{slug}}'
    summary: '{{title}} -- {{year}}/{{month}}/{{day}}'
    create: true # Allow users to create new documents in this collection
    fields: # The fields each document in this collection have
      - { label: 'Title', name: 'title', widget: 'string', tagname: 'h1' }
      - {
          label: 'Publish Date',
          name: 'date',
          widget: 'datetime',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm',
          format: 'YYYY-MM-DD HH:mm',
        }
      - label: 'Cover Image'
        name: 'image'
        widget: 'image'
        required: false
        tagname: ''

      - { label: 'Body', name: 'body', widget: 'markdown', hint: 'Main content goes here.' }
    meta:
      - { label: 'SEO Description', name: 'description', widget: 'text' }

############
# optional #
############
site_url: https://5d49a1a8b2cb050008f19ee6--mystifying-bose-12c84e.netlify.com/
display_url: 5d49a1a8b2cb050008f19ee6--mystifying-bose-12c84e.netlify.com
logo_url: https://5d49a1a8b2cb050008f19ee6--mystifying-bose-12c84e.netlify.com/images/logo.png
``` 
* Since we're hosting on Netlify, their Identity sevice is available to wire-up identity & authentication to GitHub.
  * I've already enabled this in the Netlify hosting config following their [docs](https://www.netlifycms.org/docs/add-to-your-site/).
    * I've also enabled Git Gateway to enable the CMS to write back to my repo
      * `Settings > Identity > Services > Git Gateway`
      * Permissions requested (full access to all repos) seem extreme, but Github allows you to control which Repos the netlify app has access to.
  * We also need to wire this into the `/admin/index.html` page and our site's index page via `/layouts/partials/header.html` by adding the following into the `<head>` section of those pages:
    * `<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>`
      * We need to override the default version copying the `header.html` from the template to `/layouts/partials/header.html` and make the changes in there 
    * In the site's main index page, we also need to add script to redirect CMS users to ensure they end up in the admin section adter authenticating with Netlify's Identity service:
      * Add the following to the bottom of the `<body>` section of `/layouts/partials/footer.html` just before the closing `</body>` tag:
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
After that setup, the CMS allows me to signup (against this sepcific site) and log in.  I managed to upload an image to test the connection to GitHub, but since I've not set up the structure for "Posts" (or any pages) yet in the Hugo config, there's not much else to show yet...


## TODO
* Wire up CMS to enable index.html changes
  * Needs markdown files in `/content/` for to define the structure and values
    * this will take over from the theme's original setup of populating the content from the global `config.toml` parameters
    * plus needs definitions adding to the CMS config file: `/static/admin/config.yml`
  * use https://github.com/netlify-templates/one-click-hugo-cms/blob/master/site/ as a guide
* Look at CMS setup for 
  * creating new pages
  * blog posts
    * +RSS
  * FAQ