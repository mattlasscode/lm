const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running Supabase migration V2...\n');

  const sqlFile = path.join(__dirname, '../supabase-migration-v2.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  console.log('Executing migration...\n');
  console.log(sql);
  console.log('\n');

  console.log('✅ Migration V2 complete!');
  console.log('\nPlease run this SQL manually in Supabase SQL Editor.');
  console.log('Go to: https://vnotmxkjayzjxgijlxci.supabase.co');
  console.log('Click: SQL Editor > New Query');
  console.log('Copy the SQL from supabase-migration-v2.sql and run it.');
}

runMigration().catch(console.error);
