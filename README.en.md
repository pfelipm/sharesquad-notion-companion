[🇪🇸 Versión en español](README.md)

# ShareSquad Companion for Google Sheets™

![Image of the extension in action](./readme-archivos/EN%20destacado.png)

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
*   **Multi-language Support:** Automatic language detection (Spanish and English) for the user interface.

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
2.  In the dialog that appears, **select the spreadsheet tab** containing the imported group data.
3.  Click **"Export"**. A JSON file with the data will be automatically downloaded.
4.  Open the **ShareSquad extension** in Notion, go to the `Backup` tab.
5.  Use the extension's **"Import"** function to load the downloaded JSON file.

Your Google Groups and members will now appear as "squads" in the extension, ready to be added to any Notion page.

## Technical Details

*   **Architecture and Group Access:** The script uses [HtmlService](https://developers.google.com/apps-script/reference/html/html-service) to render dialogs and [GroupsApp](https://developers.google.com/apps-script/reference/groups/groups-app) to interact with Google Groups. `GroupsApp` was chosen over the [Admin SDK Directory API](https://developers.google.com/workspace/admin/directory/reference/rest) so the tool can be used by any Google user, not just Google Workspace administrators. This comes with a significant limitation: the `GroupsApp` service is less powerful and can only retrieve a group's direct members (not members of nested groups) and only their email (not the group's name).
*   **Internationalization (i18n):** Language detection is performed in the Apps Script backend using `Session.getActiveUserLocale()`. It is configured to display the interface in Spanish (ES) for Spanish-speaking locales and in English (EN) for all others. All UI texts are stored in a `STRINGS` object to facilitate translation and maintenance.
*   **Dependencies:** The dialog interface is built with HTML and styled with **Bootstrap 5**, loaded via a CDN to keep the tool lightweight.
*   **Sheet Identification:** To robustly identify spreadsheet tabs containing data imported by this tool, Google Sheets' [DeveloperMetadata](https://developers.google.com/apps-script/reference/spreadsheet/developer-metadata) functionality is used. This is more reliable than relying on tab names or specific cell content.

## Data Privacy

*   All code runs within the secure environment of your own Google account.
*   Your group and member data is stored only in your personal spreadsheet.
*   This tool does not transmit any information outside of your Google account.

## Credits and Contributions

This project was created and is maintained by [Pablo Felip](https://www.linkedin.com/in/pfelipm/).

## License

This project is distributed under the GPL-3.0 license. See the [LICENSE](/LICENSE) file for more details.
