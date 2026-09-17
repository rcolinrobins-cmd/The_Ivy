/**
 * The Ivy — "The Guest List" form handler.
 *
 * Setup (one-time, done in Google Sheets/Apps Script, not in this repo):
 *   1. Create a new Google Sheet. Add a header row to the first sheet:
 *        Timestamp | Name | Email | Interest
 *   2. Extensions -> Apps Script. Delete the default code and paste this
 *      file's contents in.
 *   3. Deploy -> New deployment -> type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Click Deploy, authorize it when prompted, then copy the Web app URL
 *      (looks like https://script.google.com/macros/s/.../exec).
 *   4. Paste that URL into GOOGLE_SHEET_ENDPOINT in index.html.
 *
 * Any time you edit this file in the Apps Script editor, create a new
 * deployment (or use "Manage deployments" -> edit -> new version) for the
 * change to actually take effect at the existing URL.
 *
 * SECURITY NOTE — this endpoint is public by necessity (a static site has
 * nowhere to keep a real secret; the URL is visible in index.html's source
 * to anyone), so nothing here can fully stop a determined attacker who
 * reads the source and crafts their own request — but every check below
 * still meaningfully raises the cost of casual spam/abuse and protects the
 * *data* even when a bad request gets through:
 *   - Input is sanitized against spreadsheet-formula injection (a value
 *     like "=IMPORTXML(...)" would otherwise execute as a live formula the
 *     moment the sheet is opened) and length-capped.
 *   - Malformed/suspicious submissions (honeypot filled in, submitted
 *     faster than a human could fill the form, invalid email) are dropped
 *     silently — same "success" response either way, so a bot can't tell
 *     it was caught and adjust.
 *   - Per-email and global rate limits protect the *form's availability*:
 *     Apps Script has a daily execution-time quota, and enough flood
 *     traffic could exhaust it and break the form for everyone until the
 *     quota resets, independent of whether any individual request "looks"
 *     malicious.
 * Further options, not implemented here because they need your own setup:
 *   - A CAPTCHA (e.g. reCAPTCHA v3) if spam gets past the checks below —
 *     needs your own site key/secret from Google.
 *   - Double-check the Google Sheet's own sharing settings periodically —
 *     it holds real names/emails.
 */

// Values the page's own dropdown can send. Anything else becomes "other"
// rather than being rejected outright, since it just means the request
// didn't come from our page's JS (bug, or someone bypassing it) rather
// than being a reason to drop real signal.
var ALLOWED_INTERESTS = ['taking-a-tour', 'booking-an-event', 'vendor-partnership'];

// A human takes a few seconds to read three fields and pick a dropdown
// option; near-instant submissions are almost always scripted.
var MIN_FILL_TIME_MS = 1200;

// How long the same email must wait before submitting again, and how many
// total submissions are allowed per rolling minute across everyone. Both
// exist to keep the form working for real visitors during a flood, not
// just to keep the sheet tidy.
var PER_EMAIL_COOLDOWN_SECONDS = 60;
var GLOBAL_LIMIT_PER_MINUTE = 30;

function doPost(e) {
  var data = (e && e.parameter) || {};

  // Honeypot — see the field's comment in index.html. Real users never
  // see or fill it; many generic form-filling bots do.
  if (data.company) {
    return successResponse();
  }

  if (!isHumanPace(data.elapsedMs)) {
    return successResponse();
  }

  var name = sanitize(data.name, 100);
  var email = sanitize(data.email, 200);
  var interest = ALLOWED_INTERESTS.indexOf(data.interest) !== -1 ? data.interest : 'other';

  if (!name || !isValidEmail(email)) {
    return successResponse();
  }

  if (isRateLimited(email)) {
    return successResponse();
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), name, email, interest]);

  return successResponse();
}

function successResponse() {
  // Deliberately the same shape for every path above, whether a row was
  // actually appended or the request was silently dropped — so a bot (or
  // an attacker probing the endpoint) can't distinguish "accepted" from
  // "caught" and adjust its behavior accordingly.
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function isHumanPace(elapsedMs) {
  var n = Number(elapsedMs);
  return !!n && n >= MIN_FILL_TIME_MS;
}

/**
 * Trims, length-caps, and neutralizes spreadsheet-formula injection: a
 * value starting with =, +, -, or @ would otherwise run as a live formula
 * the instant the sheet is opened (e.g. "=IMPORTXML(...)" or a formula
 * that calls out to an external URL) — a real, well-known "CSV/spreadsheet
 * injection" attack against exactly this kind of setup. Prefixing with an
 * apostrophe forces Sheets to treat the cell as plain text.
 */
function sanitize(value, maxLength) {
  var str = String(value || '').trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(str)) {
    str = "'" + str;
  }
  return str;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Apps Script doesn't expose the caller's IP address to doPost, so this
 * rate-limits by email instead, using CacheService rather than the sheet
 * itself so the bookkeeping doesn't cost an extra read on every request.
 */
function isRateLimited(email) {
  var cache = CacheService.getScriptCache();

  var emailKey = 'email:' + email;
  if (cache.get(emailKey)) {
    return true;
  }
  cache.put(emailKey, '1', PER_EMAIL_COOLDOWN_SECONDS);

  var minuteKey = 'minute:' + Math.floor(Date.now() / 60000);
  var count = Number(cache.get(minuteKey) || '0') + 1;
  cache.put(minuteKey, String(count), 90);

  return count > GLOBAL_LIMIT_PER_MINUTE;
}
