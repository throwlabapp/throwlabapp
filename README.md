# ThrowLab website

Updated marketing website for ThrowLab for iPhone, with a separate About Josh page.

## Deployment

Upload this folder’s contents to the existing repository. Cloudflare Worker serves `public/`; root HTML and asset files are kept in sync for static hosting. Existing D1 configuration is retained so saved records remain available.

## Checks

Run `npm test` and `python3 scripts/verify-website.py`. See WEBSITE_UPDATE_NOTES.md for the update details.
