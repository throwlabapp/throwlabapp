# ThrowLab website + 2026 NADGC signup

Updated marketing pages, FAQs, reading guide, privacy disclosure, and Library SVG phone artwork. Existing pricing remains $4.99/month and $39.99/year. The separate NADGC offer is $19.99 for the first year.

## Cloudflare Worker setup

This edition matches the existing **throwlabapp** Worker shown in your screenshot, connected to the GitHub repository **throwlabapp/throwlabapp**. The D1 ID you supplied is already configured:

`afc5ecba-133b-4a90-8262-7c9566dfb38d`

Do not use the earlier Pages deploy commands with this edition. No production deployment or live database test has been performed here.

### 1. Connect the database in Cloudflare

On the Worker's Overview screen, click **Add a binding** under Bindings. Select **D1 database**. Set the binding/variable name to **DB**, select **throwlab-signups**, and save. Keep the database in the same Cloudflare account as the Worker.

The supplied `wrangler.jsonc` declares the same binding, so subsequent code deployments keep it connected.

### 2. Create the signup table if it has not been created yet

Open **D1 → throwlab-signups → Console** and run the contents of `migrations/0001_signups.sql`. If you already ran the CREATE TABLE statement provided in chat, this step is complete. The SQL uses CREATE TABLE IF NOT EXISTS, so rerunning it does not delete rows.

### 3. Update your existing connected GitHub repository

Extract this ZIP. Copy the **contents** of `throwlabapp-main` into the root directory used by the existing **throwlabapp/throwlabapp** repository's Cloudflare build. The root must contain `wrangler.jsonc`, `package.json`, `src/`, `functions/`, `public/`, and `migrations/`. Keep only the supplied Wrangler configuration at that root; merge any existing custom-domain/route settings into it if your old configuration contains them.

Do not upload only `public/`, and do not add an extra enclosing folder unless you also change the Cloudflare build root directory.

In Cloudflare, open **throwlabapp → Settings → Build** and check:

- Repository: existing **throwlabapp/throwlabapp**.
- Root directory: the folder containing the supplied `wrangler.jsonc` (repository root if copied as above).
- Build command: empty; this website has no frontend build step.
- Deploy command: `npx wrangler deploy`.

Commit the update to your existing production branch. Cloudflare's connected Worker build then deploys the website and signup handler. Keep your existing custom domain attached to the same Worker.

### Alternative: deploy from your computer

Open Terminal in this extracted project directory, then run:

```bash
npm install
npx wrangler login
npx wrangler deploy
```

If the signup table was not created in the dashboard, run this before deploying:

```bash
npx wrangler d1 migrations apply throwlab-signups --remote
```

This updates the existing Worker named `throwlabapp`. If it is Git-connected, also update its repository so a later Git deployment does not replace these changes with old code.

Official references: https://developers.cloudflare.com/workers/static-assets/binding/ and https://developers.cloudflare.com/workers/ci-cd/builds/configuration/

### 4. Test the live signup

Open `/nadgcatx2026/?kiosk=1` on your website, submit a test signup, and query D1 as shown below. Confirm a new row appears with `event = '2026-nadgc'` before collecting visitor addresses.

The worker serves `/api/signup` through the D1-backed handler; ordinary pages and images use Workers Static Assets. Static pages are outside the API handler. No database or email export is in the public assets directory.

## Event page and iPad

After deployment:

- Public signup: `/nadgcatx2026/`
- Shared iPad: `/nadgcatx2026/?kiosk=1`

The event heading uses “Analyze your disc’s flight. Dial in your throw.” The form requires first name, email, and explicit email consent. No payment information. No event-page analytics or browser storage of entered details. iPad mode clears a successful signup after 10 seconds, with a Next signup button for immediate reset. An abandoned form clears after 90 seconds without input. Disable saved contact autofill in the event iPad's Safari settings and use Guided Access to keep it on the page. Keep Wi-Fi or a hotspot available: this intentionally does not store visitor details offline. On an unconfirmed request it shows an error and allows retrying without duplicates.

Before the event, submit a test signup from the real iPad and confirm it appears in D1. Test a duplicate, airplane mode/retry, and the next-person reset. The supplied automated checks cover handler validation and storage failures; production D1 binding, real Safari layout, and deliverability require this live check.

## View and export emails

Cloudflare dashboard → Storage & databases → D1 → `throwlab-signups` → Console:

```sql
SELECT first_name,email,event,consent_version,created_at
FROM signups WHERE event='2026-nadgc' ORDER BY created_at;
```

For a CSV file, run from the project root:

```bash
npx wrangler d1 execute throwlab-signups --remote --command "SELECT first_name,email,event,consent_version,created_at FROM signups WHERE event='2026-nadgc' ORDER BY created_at" --json > signups.json
python3 scripts/export-signups.py < signups.json > nadgc-signups.csv
```

Keep these exports private and outside `public/`. Import the CSV into your email service when ready. This project collects signups; it does not send welcome emails or newsletters. Honor unsubscribe requests sent to support@throwlabapp.com and exclude those addresses from any sends. Remove the matching row in D1 when deletion is requested, and remove it from any exports/email services too. Use a parameterized query or the dashboard's row editor when deleting; do not paste untrusted addresses into SQL strings.

The API uses parameterized inserts, unique email/event pairs, explicit consent version, bounded input, an Origin check, and a spam-trap field. Add Cloudflare rate limiting or Turnstile if public signup abuse occurs; avoid low per-IP limits that would block many event visitors on the same Wi-Fi.

## Apple offer

Configure the actual $19.99 first-year offer in App Store Connect before sending redemption instructions. Joining this list neither starts a subscription nor applies a discount. Confirm eligibility, duration, and renewal price before sending the campaign. No App Store offer, coupon, or automatic redemption is created by this website.

## Local checks

```bash
npm test
npx wrangler d1 migrations apply throwlab-signups --local
npx wrangler dev
```

Use a local test database separate from production. Only the public directory is static content; functions, migrations, tests, and export scripts remain outside it.

## Build 33 audit

See `BUILD_33_WEBSITE_AUDIT.md` for the source references, corrections, page coverage, and verification limits. The supplied SVG artwork was adapted into phone-only illustrations; it is not a new iOS simulator capture.

## Standalone event access

The NADGC page is unlinked from the main website: no navigation link, homepage banner, main FAQ entry, or sitemap entry. It includes a noindex directive. Access it directly at `/nadgcatx2026/`, or `/nadgcatx2026/?kiosk=1` for the event iPad. This is an unlisted public URL, not a password-protected page. Event privacy disclosures remain in the privacy policy.

## Event messaging update

The standalone `/nadgcatx2026/` page leads with ThrowLab updates: “Stay in the loop with ThrowLab.” The first-year $19.99 offer is a smaller 2026 NADGC bonus, and the button reads “Keep me updated.” Your main tagline remains above the phone artwork. This package is prepared for later deployment; no live changes have been made.
