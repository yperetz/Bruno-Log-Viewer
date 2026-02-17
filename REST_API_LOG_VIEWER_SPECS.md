# REST API Log Viewer - Technical Specification

## Overview

A web-based tool for viewing and analyzing REST API logs captured from Bruno API client testing sessions. The tool provides an intuitive interface for browsing historical API requests and responses with detailed inspection capabilities.

## Project Scope

### Purpose
Enable developers to efficiently review and debug API interactions by providing a structured view of logged requests and responses from daily testing sessions.

### Target Users
- Backend developers debugging API issues
- QA engineers validating API behavior
- DevOps engineers troubleshooting integration problems

---

## Data Format Specification

### Log File Structure

#### File Naming Convention
```
YYYY-MM-DD-Bruno-log.json
```
- **Pattern**: `{date}-Bruno-log.json`
- **Example**: `2026-02-16-Bruno-log.json`
- **Location**: Configurable logs folder path

#### JSON Schema

**Root Object:**
```json
{
  "logs": [/* Array of LogEntry objects */]
}
```

**LogEntry Object:**
```typescript
{
  "requestName": string,      // Human-readable request identifier
  "timestamp": string,         // ISO 8601 format with timezone (YYYY-MM-DDTHH:mm:ss+TZ:TZ)
  "request": {
    "url": string,            // Full request URL
    "method": string,         // HTTP method (GET, POST, PUT, DELETE, etc.)
    "headers": object,        // Key-value pairs of request headers
    "body"?: any              // Optional request payload (JSON object/array or primitive)
  },
  "response": {
    "status": number,         // HTTP status code
    "headers": object,        // Key-value pairs of response headers
    "body": any               // Response payload (JSON object/array, string, or primitive)
  }
}
```

**Data Constraints:**
- Timestamps must be in ISO 8601 format with timezone offset
- Headers object may contain `false` as a value (treat as string "false")
- Response body must support JSON objects, arrays, strings, and primitives
- Logs array is sorted with newest entries first within each file

---

## Functional Requirements

### FR-1: Date Selection
**Priority**: P0

**Description**: Users must be able to select which day's logs to view.

**Acceptance Criteria:**
- [ ] Display a date picker component prominently in the UI
- [ ] Date picker defaults to the most recent available log file date
- [ ] Only dates with existing log files are selectable
- [ ] Selecting a date loads and displays that day's log entries
- [ ] Loading indicator shown while fetching/parsing log file
- [ ] Error message displayed if log file is missing or corrupted

**Edge Cases:**
- No log files exist in folder → Display empty state with instructions
- Selected date file is malformed → Show error with file path
- Very large log files (>10MB) → Implement pagination or virtualization

---

### FR-2: Request List Sidebar
**Priority**: P0

**Description**: A sidebar displays all requests from the selected date in chronological order (newest first).

**Acceptance Criteria:**
- [ ] Sidebar fixed on left side of viewport
- [ ] Each entry shows:
  - Request name (bold, truncated if > 30 chars with ellipsis)
  - HTTP method badge (color-coded: GET=blue, POST=green, PUT=orange, DELETE=red)
  - Timestamp in `HH:mm:ss` format
  - Status code badge (color-coded: 2xx=green, 3xx=yellow, 4xx=orange, 5xx=red)
- [ ] Entries sorted newest to oldest by timestamp
- [ ] Clicking an entry selects it and loads details in main panes
- [ ] Selected entry visually highlighted (background color change)
- [ ] Sidebar scrollable independently from main content
- [ ] Display total count of requests (e.g., "16 requests")

**Visual Design:**
- Width: 280-320px
- Height: Full viewport minus header
- Background: Light gray (#f5f5f5)
- Entry padding: 12px
- Hover state: Slightly darker background

---

### FR-3: Request Details Pane
**Priority**: P0

**Description**: Display complete information about the selected HTTP request.

**Acceptance Criteria:**
- [ ] Located in main content area, left pane (if using split view) or top pane (if stacked)
- [ ] Display sections in order:
  1. **Request Overview**
     - Request name as heading (H2)
     - Full URL (copyable, with copy-to-clipboard button)
     - HTTP method
     - Timestamp (full ISO format)
  2. **Request Headers**
     - Table format with "Header" and "Value" columns
     - Headers sorted alphabetically by key
     - Monospace font for values
     - Handle `false` value gracefully (display as string)
  3. **Request Body**
     - Labeled "Request Body" heading
     - If no body exists, display "No request body"
     - JSON payload prettified with 2-space indentation
     - Syntax highlighting for JSON
     - Copy button for entire body
     - Line numbers in code block

**Formatting Rules:**
- Use `JSON.stringify(body, null, 2)` for prettification
- Syntax highlighting colors: keys (blue), strings (green), numbers (orange), booleans/null (purple)
- Max height with scrolling for large bodies

---

### FR-4: Response Details Pane
**Priority**: P0

**Description**: Display complete information about the HTTP response received.

**Acceptance Criteria:**
- [ ] Located in main content area, right pane (if using split view) or bottom pane (if stacked)
- [ ] Display sections in order:
  1. **Response Overview**
     - HTTP status code with status text (e.g., "200 OK")
     - Status code color-coded by category
     - Response time/duration (if available in future logs)
  2. **Response Headers**
     - Table format with "Header" and "Value" columns
     - Headers sorted alphabetically by key
     - Monospace font for values
     - Highlight important headers (content-type, content-length)
  3. **Response Body**
     - Labeled "Response Body" heading
     - JSON payload prettified with 2-space indentation
     - Syntax highlighting for JSON
     - Copy button for entire body
     - Line numbers in code block
     - Support non-JSON responses (display as plain text)

**Formatting Rules:**
- Same prettification and syntax highlighting as request body
- If body is not valid JSON, display raw text in monospace
- Collapsible sections for large nested objects/arrays

---

### FR-5: Configuration
**Priority**: P1

**Description**: Allow users to configure the logs folder path.

**Acceptance Criteria:**
- [ ] Settings/configuration UI (modal or dedicated page)
- [ ] Input field for logs folder path
- [ ] "Browse" button to select folder (if running as desktop app)
- [ ] Validate folder exists and is readable
- [ ] Save configuration to localStorage or config file
- [ ] Display current configuration on initial load

---

## Non-Functional Requirements

### NFR-1: Performance
- Initial load time: < 2 seconds for log files up to 5MB
- Request selection response: < 100ms
- Support log files with up to 1000 entries without performance degradation
- Implement virtual scrolling for sidebar if > 500 entries

### NFR-2: Browser Compatibility
- Support latest versions of Chrome, Firefox, Safari, Edge
- Minimum resolution: 1280x720
- Responsive design for viewport widths 1024px and above

### NFR-3: Usability
- Keyboard navigation support:
  - Arrow keys to navigate sidebar entries
  - Enter to select entry
  - Ctrl/Cmd+F to search within logs
- Accessible to screen readers (ARIA labels)
- Clear error messages with actionable guidance

### NFR-4: Code Quality
- Follow airbnb/standard JavaScript style guide
- Component-based architecture (React/Vue/vanilla JS components)
- Unit test coverage > 80% for business logic
- ESLint/Prettier configured for consistent formatting

---

## Technical Architecture

### Technology Stack Recommendations

**Option A: Web Application (Recommended)**
- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS or Material-UI
- **State Management**: React Context or Zustand
- **Code Highlighting**: Prism.js or highlight.js
- **Date Handling**: date-fns or Day.js
- **Build Tool**: Vite

**Option B: Desktop Application**
- **Framework**: Electron with React
- **File System Access**: Node.js fs module
- **Packaging**: electron-builder

**Option C: Lightweight Static Tool**
- **Vanilla JavaScript** with no framework
- **Styling**: Custom CSS or Bootstrap
- **Advantages**: No build step, runs locally via file://

### Component Hierarchy
```
App
├── Header
│   └── DatePicker
├── Sidebar
│   ├── RequestListHeader (count, filters)
│   └── RequestListItem[] (virtualized)
├── MainContent
│   ├── RequestPane
│   │   ├── RequestOverview
│   │   ├── HeadersTable
│   │   └── BodyViewer
│   └── ResponsePane
│       ├── ResponseOverview
│       ├── HeadersTable
│       └── BodyViewer
└── ConfigModal (optional)
```

### Data Flow
1. User selects date → Load JSON file from logs folder
2. Parse JSON and validate schema
3. Populate sidebar with log entries (newest first)
4. Auto-select first entry or maintain previous selection
5. Display selected entry's request/response details
6. User clicks different entry → Update detail panes

### File Loading Strategy
- **Web app**: Use File API with directory picker or drag-and-drop
- **Desktop app**: Direct file system access via Node.js
- **Server-based**: API endpoint to list/fetch log files

---

## UI/UX Specifications

### Layout
```
┌─────────────────────────────────────────────────────┐
│ Header: Logo | Date Picker | Config Icon           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Main Content Area (Split Panes)        │
│          │  ┌─────────────────┬─────────────────┐  │
│ Request  │  │  Request Pane   │  Response Pane  │  │
│ List     │  │                 │                 │  │
│ (fixed)  │  │  - Overview     │  - Overview     │  │
│          │  │  - Headers      │  - Headers      │  │
│ [Entry1] │  │  - Body         │  - Body         │  │
│ [Entry2] │  │                 │                 │  │
│ [Entry3] │  │  (scrollable)   │  (scrollable)   │  │
│   ...    │  │                 │                 │  │
│          │  └─────────────────┴─────────────────┘  │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Color Scheme
- **HTTP Methods**:
  - GET: `#3b82f6` (blue)
  - POST: `#10b981` (green)
  - PUT: `#f59e0b` (orange)
  - DELETE: `#ef4444` (red)
  - PATCH: `#8b5cf6` (purple)
  - OPTIONS: `#6b7280` (gray)

- **Status Codes**:
  - 2xx: `#10b981` (green)
  - 3xx: `#eab308` (yellow)
  - 4xx: `#f97316` (orange)
  - 5xx: `#dc2626` (red)

- **UI Elements**:
  - Primary background: `#ffffff`
  - Secondary background: `#f5f5f5`
  - Border: `#e5e7eb`
  - Text primary: `#1f2937`
  - Text secondary: `#6b7280`
  - Accent: `#3b82f6`

### Typography
- **Headers**: Inter or Roboto, 600 weight
- **Body text**: Inter or Roboto, 400 weight
- **Code/JSON**: JetBrains Mono or Fira Code, 400 weight
- **Font sizes**:
  - H1: 24px
  - H2: 20px
  - H3: 16px
  - Body: 14px
  - Code: 13px

---

## Implementation Phases

### Phase 1: MVP (Week 1-2)
**Goal**: Core viewing functionality

- [ ] Set up project structure and development environment
- [ ] Implement log file loading from single folder path
- [ ] Build sidebar with request list (basic styling)
- [ ] Create request/response detail panes
- [ ] Implement JSON prettification and basic syntax highlighting
- [ ] Date selection dropdown (manual file selection fallback)

**Deliverable**: Working prototype that displays logs from hardcoded folder path

### Phase 2: Enhanced UX (Week 3)
**Goal**: Polish user experience

- [ ] Add date picker with automatic date detection
- [ ] Implement copy-to-clipboard functionality
- [ ] Add loading states and error handling
- [ ] Enhance syntax highlighting with full color scheme
- [ ] Add search/filter in sidebar (by request name, method, status)
- [ ] Keyboard navigation support

**Deliverable**: Production-ready UI with full navigation

### Phase 3: Advanced Features (Week 4+)
**Goal**: Developer productivity enhancements

- [ ] Configuration UI for logs folder path
- [ ] Export selected request as cURL command
- [ ] Export selected request as code snippet (fetch, axios)
- [ ] Response time visualization (if data added to logs)
- [ ] Request comparison tool (diff two requests)
- [ ] Dark mode support

**Deliverable**: Feature-complete tool with productivity enhancements

---

## Testing Requirements

### Unit Tests
- JSON parsing and validation
- Timestamp formatting utilities
- Date filtering logic
- Header table rendering
- Body prettification edge cases (null, undefined, circular refs)

### Integration Tests
- File loading workflow
- Request selection updates both panes
- Date change reloads data
- Copy-to-clipboard functionality

### Manual Testing Scenarios
1. Load logs with 0, 1, 100, 1000 entries
2. Test with malformed JSON files
3. Test with missing request/response fields
4. Test with very large body payloads (>1MB)
5. Test with non-JSON response bodies
6. Test with special characters in headers/body
7. Test keyboard navigation
8. Test on different screen sizes

---

## Error Handling

### Error Scenarios & Messages

| Scenario | Error Message | Action |
|----------|---------------|--------|
| Logs folder not found | "Logs folder not found at: {path}. Please configure the correct path in settings." | Show config modal |
| Log file corrupted | "Unable to parse log file for {date}. The file may be corrupted." | Offer to skip file |
| No logs in date range | "No logs found for selected date." | Show empty state |
| Invalid JSON schema | "Log file {filename} has invalid format. Expected 'logs' array." | Skip file, log to console |
| File read permission denied | "Cannot read log files. Please check folder permissions." | Show permission instructions |
| Large file warning | "This log file is large ({size}MB). Loading may take a moment." | Show warning, proceed |

---

## Future Enhancements

### Potential Features (Not in Initial Scope)
- Live log streaming for real-time debugging
- Log aggregation across multiple days with timeline view
- Request replay functionality (re-send request)
- Mock server generation from logs
- Performance metrics dashboard (average response times, error rates)
- GraphQL query/response support
- WebSocket connection logs support
- Export logs to Postman/Insomnia collections
- Team collaboration features (annotations, sharing)

---

## Development Setup

### Prerequisites
```bash
# Node.js version
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone repository
git clone <repo-url>
cd rest-api-log-viewer

# Install dependencies
npm install

# Configure logs folder path
cp .env.example .env
# Edit .env and set LOGS_FOLDER_PATH=/path/to/logs

# Start development server
npm run dev
```

### Project Structure
```
rest-api-log-viewer/
├── src/
│   ├── components/
│   │   ├── DatePicker/
│   │   ├── Sidebar/
│   │   ├── RequestPane/
│   │   ├── ResponsePane/
│   │   └── shared/
│   ├── utils/
│   │   ├── logParser.js
│   │   ├── dateFormatter.js
│   │   └── jsonPrettifier.js
│   ├── hooks/
│   │   └── useLogFiles.js
│   ├── types/
│   │   └── log.types.ts
│   └── App.jsx
├── public/
├── tests/
├── package.json
├── vite.config.js
└── README.md
```

---

## Acceptance Criteria Summary

**Definition of Done:**
- [ ] All P0 functional requirements implemented
- [ ] All non-functional requirements met
- [ ] Unit test coverage > 80%
- [ ] Manual testing scenarios passed
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Performance benchmarks met (< 2s load for 5MB files)
- [ ] Accessible (passes WAVE/axe validation)
- [ ] Responsive design tested on 1280px, 1920px viewports

---

## Appendix

### Sample Test Data
Create test log files in `test-logs/` folder:
- Small file: 10 entries (~50KB)
- Medium file: 100 entries (~500KB)
- Large file: 1000 entries (~5MB)
- Edge case file: Invalid JSON, missing fields, special characters

### Reference Implementations
- **HTTP status codes**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **JSON prettification**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
- **ISO 8601 date parsing**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString

### Glossary
- **Bruno**: API client tool used for testing (similar to Postman/Insomnia)
- **Log Entry**: Single request/response pair with metadata
- **Prettify**: Format JSON with indentation and line breaks for readability
- **Virtual Scrolling**: Technique to render only visible list items for performance

---

## Contacts & Ownership

**Product Owner**: [Name/Email]  
**Tech Lead**: [Name/Email]  
**Repository**: [GitHub URL]  
**Documentation**: [Wiki/Confluence URL]

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-16  
**Status**: Ready for Development
