# 🚀 Nexus Submission Portal - Complete Guide

**Version:** 1.0.0  
**Last Updated:** December 16, 2025  
**Platform:** Web Application (React + Express)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage Guide](#usage-guide)
7. [API Reference](#api-reference)
8. [File Structure](#file-structure)
9. [Customization](#customization)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The **Nexus Submission Portal** is a modern, sleek web application designed for **HackForge'2025** hackathon. It allows teams to submit their project files to sponsoring companies via MEGA cloud storage.

### Key Highlights
- ✨ Beautiful cyberpunk-inspired UI with aurora animations
- 🏢 Multi-company support (Senesense Solutions, Webbed, Techknots)
- 📁 Secure file upload to MEGA cloud storage
- 🔄 Two upload modes: File Request (public links) or Direct Upload (credentials)
- 📱 Fully responsive design

---

## ✅ Features

### Frontend Features
| Feature | Description |
|---------|-------------|
| Splash Screen | Animated loading screen (2.5 seconds) |
| Company Selector | Dropdown to choose sponsoring company |
| Team Name Input | Text field for team identification |
| File Dropzone | Drag & drop ZIP file upload area |
| AI Analysis | Optional file analysis with tags (if enabled) |
| Success Modal | Confirmation with upload instructions |
| Aurora Background | Animated gradient background effects |

### Backend Features
| Feature | Description |
|---------|-------------|
| Express Server | RESTful API on port 3001 |
| CORS Support | Cross-origin requests from localhost:3000 |
| File Validation | ZIP files only, max 100MB |
| Multi-mode Upload | File Request URL or Direct MEGA credentials |
| Mock Mode | Testing without real MEGA accounts |
| Health Check | API status endpoint |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────┘

    ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
    │   FRONTEND    │          │   BACKEND     │          │   MEGA.nz     │
    │   React App   │────────→ │   Express API │────────→ │   Cloud       │
    │   Port 3000   │          │   Port 3001   │          │   Storage     │
    └───────────────┘          └───────────────┘          └───────────────┘
           │                          │                          │
           │ Vite + React             │ Express + TypeScript     │ megajs library
           │ TailwindCSS              │ Multer (file handling)   │ or File Request
           │ TypeScript               │ dotenv (config)          │
           └──────────────────────────┴──────────────────────────┘
```

### Data Flow

```
User Action                     Backend Processing              Storage
───────────                     ──────────────────              ───────
1. Fill form                    
2. Click Submit  ───────────→   3. Validate data
                                4. Check mode (File Request/Direct)
                                   ├── File Request: Return URL ──→ Opens MEGA page
                                   └── Direct: Upload file ───────→ MEGA API upload
5. See success  ←───────────    6. Send response
```

---

## 📦 Installation

### Prerequisites
- Node.js v18+ 
- npm v9+
- Git (optional)

### Quick Start

```bash
# 1. Navigate to project directory
cd nexus-submission-portal

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install

# 4. Configure environment (see Configuration section)
# Edit server/.env with your settings

# 5. Start backend server
npm run dev
# Server runs on http://localhost:3001

# 6. In a new terminal, start frontend
cd ..
npm run dev
# Frontend runs on http://localhost:3000

# 7. Open browser to http://localhost:3000
```

### Production Build

```bash
# Frontend
npm run build
npm run preview

# Backend (use PM2 or similar for production)
npm run build
node dist/server.js
```

---

## ⚙️ Configuration

### Environment Variables (server/.env)

```env
# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=3001

# ===========================================
# MODE SELECTION (Choose ONE)
# ===========================================
# USE_FILE_REQUEST=true  → Opens MEGA File Request page for user to upload
# MOCK_MODE=true         → Simulates uploads (for testing)
# Both false             → Direct upload to MEGA (requires credentials)

USE_FILE_REQUEST=true
MOCK_MODE=false

# ===========================================
# MEGA FILE REQUEST URLs
# (Only needed if USE_FILE_REQUEST=true)
# ===========================================
SENESENSE_FILE_REQUEST_URL=https://mega.nz/filerequest/YOUR_URL_HERE
WEBBED_FILE_REQUEST_URL=https://mega.nz/filerequest/YOUR_URL_HERE
TECHKNOTS_FILE_REQUEST_URL=https://mega.nz/filerequest/YOUR_URL_HERE

# ===========================================
# MEGA CREDENTIALS
# (Only needed if USE_FILE_REQUEST=false and MOCK_MODE=false)
# ===========================================
SENESENSE_MEGA_EMAIL=your-email@example.com
SENESENSE_MEGA_PASSWORD=your-password
WEBBED_MEGA_EMAIL=your-email@example.com
WEBBED_MEGA_PASSWORD=your-password
TECHKNOTS_MEGA_EMAIL=your-email@example.com
TECHKNOTS_MEGA_PASSWORD=your-password
```

### Mode Comparison

| Mode | USE_FILE_REQUEST | MOCK_MODE | Requirements | Use Case |
|------|-----------------|-----------|--------------|----------|
| File Request | `true` | `false` | File Request URLs | Production (easy) |
| Direct Upload | `false` | `false` | Email/Password | Production (automated) |
| Mock/Testing | `false` | `true` | None | Development/Testing |

---

## 📖 Usage Guide

### For Event Organizers

#### Setting Up File Request URLs

1. Log into your MEGA account
2. Go to the folder where you want submissions
3. Right-click → "Get File Request link"
4. Copy the URL (format: `https://mega.nz/filerequest/XXXX`)
5. Add to `.env` file for each company

#### Managing Submissions

- All submissions go to the configured MEGA folder
- Files are named: `{TeamName}_{Timestamp}_{OriginalFilename}.zip`
- Check MEGA dashboard to see incoming submissions

### For Participants (End Users)

#### Step-by-Step Submission

1. **Open the portal**: Navigate to the submission URL
2. **Wait for splash screen**: Watch the cool loading animation
3. **Select your company**: Click dropdown, choose your sponsoring company
4. **Enter team name**: Type your team's name exactly as registered
5. **Upload file** (Direct mode): Drag & drop or click to select ZIP file
6. **Click Submit**: Press the "Submit Project" button
7. **Complete upload** (File Request mode): 
   - A new MEGA tab opens
   - Upload your ZIP file there
   - Name it: `TeamName_project.zip`
   - Wait for upload to complete

---

## 🔌 API Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### GET /health
Check server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-16T10:30:00.000Z",
  "mode": "file-request" | "mock" | "direct-upload"
}
```

#### GET /config
Get current configuration.

**Response:**
```json
{
  "useFileRequest": true,
  "mockMode": false,
  "companies": ["Senesense Solutions", "Webbed", "Techknots"]
}
```

#### POST /get-upload-url
Get MEGA File Request URL for a company. (File Request mode only)

**Request:**
```json
{
  "company": "Webbed",
  "teamName": "Team Alpha"
}
```

**Response:**
```json
{
  "success": true,
  "fileRequestUrl": "https://mega.nz/filerequest/EgbH2MkfHBs",
  "companyName": "Webbed",
  "message": "Please upload your file to Webbed's upload page"
}
```

#### POST /upload
Upload file directly to MEGA. (Direct upload mode only)

**Request:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Yes | ZIP file (max 100MB) |
| company | String | Yes | Company name |
| teamName | String | Yes | Team name |
| aiTags | String | No | AI-generated tags |
| aiSummary | String | No | AI-generated summary |

**Response:**
```json
{
  "success": true,
  "message": "Project submitted successfully!"
}
```

---

## 📁 File Structure

```
nexus-submission-portal/
│
├── 📄 index.html              # HTML entry point
├── 📄 index.tsx               # React entry point
├── 📄 App.tsx                 # Main application component
├── 📄 types.ts                # TypeScript type definitions
├── 📄 vite.config.ts          # Vite configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 package.json            # Frontend dependencies
│
├── 📁 components/             # React components
│   ├── CompanySelector.tsx    # Company dropdown
│   ├── FileDropzone.tsx       # Drag & drop file area
│   ├── TeamInput.tsx          # Team name input
│   ├── SuccessModal.tsx       # Success confirmation modal
│   ├── Icons.tsx              # SVG icon components
│   └── Tooltip.tsx            # Tooltip component
│
├── 📁 services/               # Frontend services
│   └── gemini.ts              # AI analysis (if enabled)
│
└── 📁 server/                 # Backend server
    ├── 📄 .env                # Environment configuration
    ├── 📄 package.json        # Backend dependencies
    ├── 📄 tsconfig.json       # TypeScript configuration
    │
    └── 📁 src/
        ├── server.ts          # Express server entry point
        ├── config.ts          # Configuration & credential mapping
        │
        ├── 📁 routes/
        │   └── submit.ts      # API route handlers
        │
        └── 📁 services/
            └── megaUpload.ts  # MEGA upload service
```

---

## 🎨 Customization

### Changing Companies

Edit `components/CompanySelector.tsx`:

```tsx
const companies: Company[] = [
  { id: 'company1', name: 'Your Company 1', logo: '🏢' },
  { id: 'company2', name: 'Your Company 2', logo: '🏛️' },
  { id: 'company3', name: 'Your Company 3', logo: '🏗️' },
];
```

Also update `server/src/config.ts` to handle the new company names.

### Changing Theme Colors

The app uses TailwindCSS. Key colors:
- Primary: `indigo-500` / `indigo-600`
- Accent: `cyan-500` / `cyan-400`
- Success: `emerald-500` / `teal-400`
- Background: `black` / `slate-900`

### Changing Event Name

Edit `App.tsx`:
```tsx
<span>HackForge'2025</span>  // Change this
<h1>Data Upload</h1>         // And this
```

### Changing File Type

Edit `server/src/routes/submit.ts`:
```typescript
fileFilter: (_req, file, cb) => {
  // Modify allowed MIME types here
  if (file.mimetype === 'application/zip' || ...) {
    cb(null, true);
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### "Failed to connect to server"
- **Cause**: Backend not running or wrong port
- **Fix**: Ensure `npm run dev` is running in `/server` directory
- **Check**: Visit http://localhost:3001/api/health

#### "USE_FILE_REQUEST is false even though set in .env"
- **Cause**: Server didn't reload after .env change
- **Fix**: Restart the backend server completely (Ctrl+C, then `npm run dev`)

#### "Upload failed" in Direct mode
- **Cause**: Invalid MEGA credentials
- **Fix**: Verify email/password in `.env` are correct
- **Check**: Try logging in manually at mega.nz

#### "Only ZIP files are allowed"
- **Cause**: Wrong file type uploaded
- **Fix**: Compress project folder to `.zip` format

#### CORS errors in browser console
- **Cause**: Frontend/backend on wrong ports
- **Fix**: Ensure frontend is on :3000, backend on :3001

### Debug Mode

Add to `server/.env`:
```env
DEBUG=true
```

Check server console for detailed logs.

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review console logs (browser & terminal)
3. Verify `.env` configuration
4. Restart both servers

---

## 📜 License

© 2025 Webbed. All rights reserved.

---

*Built with ❤️ for HackForge'2025*
