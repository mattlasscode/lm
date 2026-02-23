# Deployment Guide

## ⚠️ CRITICAL: Run Supabase Migration First

Before deploying or using the app, you **MUST** set up the database tables in Supabase.

### Step 1: Run SQL Migration

1. Go to your Supabase dashboard: https://vnotmxkjayzjxgijlxci.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open `supabase-migration.sql` in this project
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **RUN** (or press Cmd/Ctrl + Enter)

You should see success messages for:
- Creating tables: `lists`, `items`, `completions`
- Creating indexes
- Enabling Row Level Security
- Creating storage bucket `list-images`

### Step 2: Verify Tables

1. Go to **Table Editor** in Supabase
2. Confirm you see these tables:
   - `lists`
   - `items`
   - `completions`

### Step 3: Verify Storage

1. Go to **Storage** in Supabase
2. Confirm you see the bucket: `list-images`
3. It should be marked as **Public**

## Deploying to Vercel

The app is already deployed at: https://lm-l6rko96lq-mattlasscodes-projects.vercel.app/

### Environment Variables

Make sure these are set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://vnotmxkjayzjxgijlxci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are already in your `.env` file and should be automatically synced to Vercel.

### Redeploy After Migration

After running the SQL migration:

1. Go to your Vercel dashboard
2. Find the `lm` project
3. Click **Redeploy** (or just push to git)

The app should now work without errors!

## Troubleshooting

### "500 Internal Server Error"
- **Cause**: Database tables don't exist yet
- **Fix**: Run the SQL migration in Supabase (see Step 1 above)

### "relation does not exist" errors
- **Cause**: Tables weren't created properly
- **Fix**: Re-run the SQL migration, check for errors in Supabase SQL Editor

### Images not uploading
- **Cause**: Storage bucket doesn't exist or isn't public
- **Fix**: Check Storage in Supabase, ensure `list-images` bucket exists and is public

## Testing

After deployment:
1. Visit your Vercel URL
2. Create a test list
3. Add items
4. Complete items with photos
5. Check Supabase dashboard to see data in real-time

Everything should sync across all devices! 🐸
