require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseAnonKey ? supabaseAnonKey.length : 'undefined');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Users found:', data ? data.length : 0);
    
    // Test if tables exist
    const tables = ['users', 'profiles', 'donations', 'streams'];
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase.from(table).select('*').limit(1);
        if (tableError) {
          console.log(`⚠️  Table '${table}' not found or error:`, tableError.message);
        } else {
          console.log(`✅ Table '${table}' exists with ${tableData.length} records`);
        }
      } catch (err) {
        console.log(`⚠️  Table '${table}' error:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
  }
}

testConnection();