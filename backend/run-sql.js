require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSQL() {
  try {
    console.log('🚀 Executando SQL no Supabase...');
    
    // Read SQL file
    const sql = fs.readFileSync('./create-tables.sql', 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length > 0) {
        console.log(`📝 Executando statement ${i + 1}/${statements.length}...`);
        
        try {
          // For Supabase, we need to use the RPC endpoint or SQL editor
          // Since we can't execute raw SQL directly with the client,
          // we'll provide instructions
          console.log(`⚠️  Statement ${i + 1}: ${statement.substring(0, 100)}...`);
        } catch (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ SQL statements prontos para execução!');
    console.log('\n📋 Para executar no Supabase Studio:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/[PROJECT_ID]/sql');
    console.log('2. Crie uma nova query');
    console.log('3. Cole o conteúdo do arquivo create-tables.sql');
    console.log('4. Execute a query');
    
  } catch (error) {
    console.error('❌ Error reading SQL file:', error.message);
  }
}

runSQL();