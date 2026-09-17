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
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = e.parameter;

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.interest || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
