# ThrowLab support site

Static marketing + legal pages for App Store Connect.

## Publish (GitHub Pages)

1. Create a **public** repo named `throwlab-support` under the GitHub account you want in the URL  
   (e.g. user `throwlabapp` → `https://throwlabapp.github.io/throwlab-support/`).
2. Push these files to the `main` branch root.
3. Repo **Settings → Pages**:
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
4. Wait ~1 minute, then verify:

| App Store Connect field | URL |
|-------------------------|-----|
| Support URL | `https://YOUR_USER.github.io/throwlab-support/` or `.../support.html` |
| Privacy Policy URL | `https://YOUR_USER.github.io/throwlab-support/privacy.html` |
| Terms of Use URL | `https://YOUR_USER.github.io/throwlab-support/terms.html` |

After you know the final URL, update the Privacy/Terms links inside the iOS paywall (`PaywallView.swift`) if they still point at the placeholder `throwlabapp.github.io`.

## Local preview

Open `index.html` in a browser, or:

```bash
cd ThrowLab-support-pages
python3 -m http.server 8080
```
