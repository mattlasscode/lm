# Nos Listes - Leila & Matt �

A beautiful shared notes app for couples to manage lists together.

## Features

- 🎨 Beautiful, modern UI with gradient colors
- 📝 Multiple customizable lists (places to visit, movies to watch, etc.)
- ✅ Check off completed items
- 📸 Add photos to completed items
- 💬 Add comments and notes to completions
- 🔒 Simple password protection (no complex auth needed)
- ☁️ **Cloud persistence with Supabase** - Access from any device!

## Getting Started

### First Time Setup

1. Install dependencies:
```bash
npm install
```

2. **Set up Supabase** (IMPORTANT):
   - See `SUPABASE_SETUP.md` for detailed instructions
   - Run the SQL migration in your Supabase dashboard
   - Verify tables and storage bucket are created

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Login with the password: `leslistesdeleilaetmatt`

## How to Use

1. **Create Lists**: Click "Nouvelle Liste" to create a new list with a custom emoji and color
2. **Add Items**: Type in the input field and click "Ajouter" to add items to your list
3. **Complete Items**: Click the circle next to an item to mark it as complete
4. **Add Details**: When completing an item, you can add photos and comments about your experience
5. **Manage Items**: Hover over items to see the delete button

## Project Structure

- **Database**: Supabase PostgreSQL (cloud-hosted)
- **Storage**: Supabase Storage bucket `list-images`
- **Auth**: Simple password-based session cookies
- **Tech Stack**: Next.js 14, React, TailwindCSS, TypeScript, Supabase

## Password

The app uses a simple password protection system. Both users can access with the same password:
`leslistesdeleilaetmatt`

## Cloud Access

With Supabase, your data is stored in the cloud, which means:
- Access from **any device** (phone, tablet, computer)
- **Real-time sync** between devices
- **Automatic backups** - never lose your data
- **No local storage limits**

Both you and Leila can access the same lists from different devices simultaneously!

Enjoy managing your shared lists together! 🐸💕 
