# Nos Listes - Leila & Matt 💕

A beautiful shared notes app for couples to manage lists together.

## Features

- 🎨 Beautiful, modern UI with gradient colors
- 📝 Multiple customizable lists (places to visit, movies to watch, etc.)
- ✅ Check off completed items
- 📸 Add photos to completed items
- 💬 Add comments and notes to completions
- 🔒 Simple password protection (no complex auth needed)
- 💾 SQLite database for data persistence

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Login with the password: `leslistesdeleilaetmatt`

## How to Use

1. **Create Lists**: Click "Nouvelle Liste" to create a new list with a custom emoji and color
2. **Add Items**: Type in the input field and click "Ajouter" to add items to your list
3. **Complete Items**: Click the circle next to an item to mark it as complete
4. **Add Details**: When completing an item, you can add photos and comments about your experience
5. **Manage Items**: Hover over items to see the delete button

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **Database**: SQLite with better-sqlite3
- **Icons**: Lucide React
- **Language**: TypeScript

## Password

The app uses a simple password protection system. Both users can access with the same password:
`leslistesdeleilaetmatt`

Enjoy managing your shared lists! 💖
