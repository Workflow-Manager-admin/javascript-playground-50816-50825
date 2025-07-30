# JavaScript Playground

A modern, responsive React application for writing, running, and sharing JavaScript code in the browser.

## Features

- **Live code editor with syntax highlighting** (PrismJS)
- **In-browser JavaScript execution** (sandboxed)
- **Save, delete, and reload code snippets** (persists in localStorage)
- **Copy code to clipboard**
- **Generate shareable links** (URL hashes with auto-load)
- **Responsive layout:** Top navbar, main split with editor, saved snippets panel, and output area
- **Modern UI** using a light theme and the specified palette:  
  - Primary: `#1976d2`, Secondary: `#424242`, Accent: `#ffea00`

## Usage

- **Write code:** in the left editor panel  
- **Run:** click ▶ Run to execute and see output
- **Save:** click 💾 Save to keep a snippet on the left
- **Copy or Share:** use 📋 or 🔗 to copy code/share link
- **Load or Delete:** click a snippet to load, 🗑 to delete

## Get started

```bash
npm install
npm start
```

> No backend required.

## Technologies

- React
- PrismJS for syntax highlighting
- In-browser execution (Function constructor)
- nanoid, react-copy-to-clipboard

