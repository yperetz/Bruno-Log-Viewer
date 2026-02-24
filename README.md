# Bruno Log Viewer

A desktop app for viewing and analyzing REST API request/response logs from [Bruno](https://www.usebruno.com/) API testing sessions. Completely vibe coded.

## What is it?

Bruno Log Viewer reads log files produced by a Bruno collection post-script. Each request you run in Bruno appends its request and response to a daily JSON log file. This app lets you browse those logs, inspect headers and bodies, and benefit from live updates when new requests are sent.

## Features

- Browse Bruno log files (`YYYY-MM-DD-Bruno-log.json`)
- Date picker to select which day's logs to view
- Request list sidebar with method/status badges
- Request and response detail panes (headers, body with JSON syntax highlighting)
- **Live updates** — automatically refreshes when the log file changes (e.g., Bruno appends new requests)
- Folder selection persisted across sessions

## Setup: Bruno Collection Post-Script

To generate the log files this viewer expects, add the following script to the **Post Response** script of your Bruno collection.

1. Open your Bruno collection in Bruno.
2. Go to **Collection** → **Edit** → **Scripts** (or Collection Settings).
3. Paste this script into the **Post Response** script:

```javascript
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const safeStringify = function (obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (err) {
    return obj
  }
};

const request = {
  url: req.getUrl(),
  headers: req.getHeaders(),
  method: req.getMethod(),
  body: req.getBody()
};

const response = {
  status: res.getStatus(),
  headers: res.getHeaders(),
  body: res.getBody()
};

const now = moment();
const formattedDate = now.format('YYYY-MM-DD');
const requestName = req.getName();
const filename = path.join(bru.cwd(), 'logs', `${formattedDate}-Bruno-log.json`);

// Create the new log entry
const newLogEntry = {
  requestName: requestName,
  timestamp: now.format(),
  request: request,
  response: response
};

// Read existing logs or create new structure
let logData = { logs: [] };
if (fs.existsSync(filename)) {
  try {
    const fileContent = fs.readFileSync(filename, 'utf8');
    logData = JSON.parse(fileContent);
  } catch (err) {
    console.error('Error reading log file:', err);
    logData = { logs: [] };
  }
}

// Prepend the new entry to the beginning of the array
logData.logs.unshift(newLogEntry);

// Write back to file
fs.writeFileSync(filename, safeStringify(logData));
```

4. Create a `logs` folder inside your Bruno collection root (or the script will fail on first write).
5. Enable filesystem access for collection scripts. Post-scripts need permission to use `fs`:

   - **Bruno 3.1.0+:** Enable **Developer Mode** over Safe Mode for your collection (Collection → Edit → Scripts). See [JavaScript Sandbox docs](https://docs.usebruno.com/configure/javascript-sandbox).
   - **Bruno < 3.1.0:** Add this to `bruno.json` at the root of your collection:

```json
{
  "scripts": {
    "filesystemAccess": {
      "allow": true
    }
  }
}
```

### Troubleshooting: Filesystem Access

Post-scripts need explicit permission to use `fs`:

- **Bruno 3.1.0+:** Enable **Developer Mode** over Safe Mode for your collection. When using Bruno CLI, pass `--sandbox=developer` when running collections.
- **Bruno < 3.1.0:** Add the `scripts.filesystemAccess.allow` setting in `bruno.json` as shown above.
- On Windows, if you get an error like `Module '...\fs' is not allowed to be required`, ensure Developer Mode (3.1.0+) or `filesystemAccess.allow` (older versions) is enabled for the collection.

**Security note:** Logs may contain sensitive data (headers, tokens, bodies). The `logs` folder is inside your collection directory. Consider adding `logs/` to `.gitignore` if your collection is version-controlled, or store the collection in a location you don’t commit.

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build
npm run build
```

## Usage

1. Click **Select folder** and choose the folder containing your Bruno log files (typically the `logs` folder inside your collection).
2. Select a date from the dropdown (only dates with log files are shown).
3. Click a request in the sidebar to view its details.
4. The view updates live when Bruno writes new entries to the log file.

## Test Data

A sample log file is included at `test-logs/2026-02-16-Bruno-log.json`. Select the `test-logs` folder to try the app.

## Tech Stack

- Electron + React + TypeScript + Vite
- Tailwind CSS, Prism.js, date-fns
- chokidar for file watching, electron-store for config persistence
