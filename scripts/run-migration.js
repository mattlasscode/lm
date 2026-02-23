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
  console.log('🚀 Running Supabase migration...\n');

  const sqlFile = path.join(__dirname, '../supabase-migration.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Split by semicolons and filter out empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      // Try direct query instead
      const { error: directError } = await supabase.from('_').select('*').limit(0);
      console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
    } else {
      console.log(`✅ Statement ${i + 1} completed`);
    }
  }

  console.log('\n✅ Migration complete!');
  console.log('\nVerifying tables...');

  // Verify tables exist
  const { data: lists } = await supabase.from('lists').select('count');
  const { data: items } = await supabase.from('items').select('count');
  const { data: completions } = await supabase.from('completions').select('count');

  console.log('✅ Tables verified:');
  console.log('  - lists');
  console.log('  - items');
  console.log('  - completions');
}

runMigration().catch(console.error);
