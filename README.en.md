[🇪🇸 Versión en español](README.md)

# ShareSquad Companion for Google Sheets™

## Overview

**ShareSquad Companion** is a Google Sheets tool designed to work as a companion to the **[ShareSquad for Notion™](https://github.com/pfelipm/sharesquad-notion)** Chrome extension.

Its purpose is to act as a **bridge between your Google Groups and the ShareSquad extension**. It allows you to import your Google Group members into a spreadsheet and then export them in the exact JSON format that the ShareSquad extension requires to function.

### Why does this tool exist?

The ShareSquad extension was designed to be a lightweight, agnostic tool focused solely on improving guest management in Notion. Directly integrating Google Groups functionality into the extension would have posed two significant challenges:

1.  **Authentication Complexity (OAuth):** Accessing a user's Google Groups requires an authentication process (OAuth 2.0) that must be verified and approved by Google. This is a complex and laborious step for an experimental, unpublished extension.
2.  **Ecosystem Specificity:** Direct integration would conceptually tie the extension to the Google ecosystem, when its primary function is linked to Notion, an independent platform.

**ShareSquad Companion** is the pragmatic solution to this problem: a separate tool that runs securely within the user's own Google environment, allowing them to prepare their group data for easy import into the extension.

## Features

*   **Import from Google Groups:** Scans the groups the user belongs to and dumps the members (group email and member email) into a new spreadsheet.
*   **Compatible JSON Export:** Converts the data from the generated spreadsheet into the JSON format that the ShareSquad extension's import function can read.

## Installation

Installation does not require downloading anything. You simply need to make a copy of the public Google Sheets template:

1.  **Open the Template:** Click the following link to open the master spreadsheet:
    *   **[ShareSquad Companion Public Template](https://docs.google.com/spreadsheets/d/1Y3wp_gu7BZqxnn5Hnzo5nWmtJKh_HmnqNXQFJ_XSY54/edit)**
2.  **Make a Copy:** Go to the `File` menu → `Make a copy`.
3.  **Done!** The copy you've created in your own Google Drive contains all the necessary code and is ready to use. When you open it, a new menu named **"ShareSquad Companion"** will appear.

## How to Use

The process has two phases: importing from Google Groups to the sheet, and exporting from the sheet to the JSON format.

### Phase 1: Import Groups into the Spreadsheet

1.  **Open your copy** of the Spreadsheet.
2.  In the menu, go to `ShareSquad Companion` → `Import groups...`.
3.  **Authorize the script:** The first time you use it, Google will ask for your permission for the script to access your Google Groups and modify your spreadsheets. This is a necessary and safe step, as the code runs solely within your account.
4.  **Select the groups:** In the dialog that appears, choose the groups whose members you want to import.
5.  Click **"Import"**. A new tab will be created in your sheet with the emails of the group and its members.

### Phase 2: Export to JSON and Use in the Extension

1.  Once the sheet is generated, go to the menu `ShareSquad Companion` → `Export to JSON...`.
2.  **Select the sheet** you just created.
3.  Click **"Export"**. A dialog will appear with the text in JSON format.
4.  **Copy all the text** from the box.
5.  Open the **ShareSquad extension** in Notion, go to the `Backup` tab.
6.  Paste the JSON text into the **"Import"** area and click the import button.

Your Google Groups and members will now appear as "squads" in the extension, ready to be added to any Notion page.

## Data Privacy

*   All code runs within the secure environment of your own Google account.
*   Your group and member data is stored only in your personal spreadsheet.
*   This tool does not transmit any information outside of your Google account.

## License

This project is distributed under the GPL-3.0 license. See the `LICENSE` file for more details.
