import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

// Load the service account key JSON file.
const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}');

// Initialize the Google Sheets API
const sheets = google.sheets({ version: 'v4' });
const auth = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

interface SheetData {
  userId: string;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { userId } = JSON.parse(event.body || '{}') as SheetData;
  const timestamp = new Date().toISOString();

  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    return { statusCode: 500, body: 'Google Sheet ID is not set' };
  }

  try {
    // Append the user ID and timestamp to Google Sheet
    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: sheetID,
      range: 'Sheet1!A:B', 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, userId]] // Logging the timestamp and userId
      }
    });

    return { statusCode: 200, body: 'User ID logged successfully' };
  } catch (error) {
    console.error('Error writing user ID to Google Sheet:', error);
    return { statusCode: 500, body: 'Error writing to Google Sheet' };
  }
};

export { handler };
