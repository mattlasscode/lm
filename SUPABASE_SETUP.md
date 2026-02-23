# Supabase Migration Instructions

## Setup Steps

### 1. Run the SQL Migration

1. Go to your Supabase project: https://vnotmxkjayzjxgijlxci.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase-migration.sql`
5. Click **Run** to execute the migration

This will create:
- `lists` table
- `items` table  
- `completions` table
- Indexes for performance
- Row Level Security policies
- Storage bucket `list-images` for image uploads

### 2. Verify Tables Created

Go to **Table Editor** and confirm you see:
- lists
- items
- completions

### 3. Verify Storage Bucket

Go to **Storage** and confirm you see:
- `list-images` bucket (public)

### 4. Environment Variables

Your `.env` file is already configured with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are used by the app to connect to Supabase.

## What Changed

### Database
- **Before**: SQLite local file (`data.db`)
- **After**: Supabase PostgreSQL (cloud-hosted)

### Image Storage
- **Before**: Local filesystem (`public/uploads/`)
- **After**: Supabase Storage bucket (`list-images`)

### Benefits
✅ **Multi-device access** - Access from any device with internet
✅ **Real-time sync** - Changes sync across devices
✅ **Automatic backups** - Supabase handles backups
✅ **Scalable storage** - No local disk limits
✅ **Secure** - Row Level Security enabled

## Testing

After running the migration:

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Login with: `leslistesdeleilaetmatt`

3. Create a test list

4. Add items and complete them with photos

5. Check Supabase dashboard to see data in real-time!

## Troubleshooting

If you get errors:
- Check that the SQL migration ran successfully
- Verify the storage bucket was created
- Check browser console for specific error messages
- Ensure `.env` variables are correct
