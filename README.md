# Sihina Piyapath 2.0 — Website

CSR project website for the 03A Weekday Batch, SAB Campus of CA Sri Lanka.
Plain HTML/CSS/JS with no build step, so anyone on the team can edit it straight on GitHub.

## Files

All files sit together in the main folder of the repository (no sub-folders):

- `index.html`: the whole page (text, sections, team names)
- `style.css`: colours and layout
- `config.js`: ⭐ settings: Google Sheet link, WhatsApp number, dates
- `main.js`: live book list, WhatsApp buttons, countdown, photo viewer
- `*.jpg`, `*.png`, `*.mp4`: logo, photos and videos

## 1. Put the site on GitHub Pages (one time)

1. Create a GitHub account, then click **New repository**. Name it `sihina-piyapath` and make it **Public**.
2. On the repository page, click **Add file → Upload files**. Select **all the files** and drag them
   into the box together. Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Branch*, choose **main** and **/ (root)**, then **Save**.
4. After 1–2 minutes your site is live at `https://YOUR-USERNAME.github.io/sihina-piyapath/`.

## 2. Live book list

The site reads the **Book List** tab of the project Google Sheet directly (the link is already in
`config.js`). Keep the sheet shared as **Anyone with the link → Viewer**, and don't rename the
"Book List" tab. To update the site, just change **Received** in the sheet. The website shows it
within a few minutes.

## 3. Everyday edits

| To change… | Edit |
|---|---|
| Who gets "I'll donate this" messages | `WHATSAPP_NUMBER` in `config.js` |
| Drop-off deadline / donation day | `DROP_OFF_DEADLINE`, `DONATION_DAY` in `config.js`. Also update the text in `index.html` (search for "2 Nov" and "4 Nov"). |
| Text, team names, contact cards | `index.html` (search for the words you want to change) |
| A photo | Upload a new file with the **same name** to replace it |

Keep photos under about 300 KB each (resize to 1400 px wide) so the page loads fast on mobile data.

## 4. After the donation day (4 Nov)

Add a "2.0 Donation Day" gallery: copy the `<section ... id="story">` block in `index.html`,
change the text and point it at the new photo file names.

## Notes

- Dilshan's WhatsApp button uses his WhatsApp QR link (his number is never shown). If he taps
  "Reset QR code" in WhatsApp, that link stops working and must be replaced in `index.html`.
- The proposal and 1.0 report links point to Google Drive. Keep those files shared as "Anyone with the link".
