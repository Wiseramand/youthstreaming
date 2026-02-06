# Youth Angola Streaming - Fix Database Issue
Write-Host "Fixing database connection issue..." -ForegroundColor Green

Write-Host ""
Write-Host "Database Connection Problem:" -ForegroundColor Red
Write-Host "Error: Can't reach database server at db.jqqduvdldrsjkvaiqxxy.supabase.co:5432"
Write-Host "This is a network/firewall issue preventing connection to Supabase"
Write-Host ""

Write-Host "Step-by-Step Solution:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. CHECK SUPABASE PROJECT STATUS"
Write-Host "   - Go to: https://app.supabase.com/project/your-project"
Write-Host "   - Verify the project is active and running"
Write-Host "   - Check if the database is online"
Write-Host ""

Write-Host "2. ADD YOUR IP TO SUPABASE ALLOWLIST"
Write-Host "   - Go to: Settings > Database > Connection Security"
Write-Host "   - Add your current IP address to the allowlist"
Write-Host "   - Or set to Allow all IPs for testing"
Write-Host ""

Write-Host "3. TEST CONNECTION AGAIN"
Write-Host "   cd backend"
Write-Host "   npx prisma db pull"
Write-Host ""

Write-Host "4. IF STILL FAILING, TRY:"
Write-Host "   - Restart your router/modem"
Write-Host "   - Try connecting from a different network"
Write-Host "   - Use a VPN to test from different locations"
Write-Host "   - Check if your ISP is blocking the connection"
Write-Host ""

Write-Host "5. ALTERNATIVE: USE LOCAL DATABASE FOR TESTING"
Write-Host "   - Install PostgreSQL locally"
Write-Host "   - Update DATABASE_URL to local connection"
Write-Host "   - Run migrations locally first"
Write-Host ""

Write-Host "Current DATABASE_URL:" -ForegroundColor Yellow
$envPath = "backend/.env.production"
$currentDbUrl = Get-Content $envPath | Where-Object { $_ -match "^DATABASE_URL=" }
Write-Host "   $currentDbUrl"
Write-Host ""

Write-Host "Next Steps After Fixing Database:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Test database connection:"
Write-Host "   cd backend && npx prisma db pull"
Write-Host ""
Write-Host "2. Run migrations:"
Write-Host "   cd backend && npx prisma migrate deploy"
Write-Host ""
Write-Host "3. Create admin user:"
Write-Host "   cd backend && node scripts/createAdminProd.cjs"
Write-Host ""
Write-Host "4. Test the application:"
Write-Host "   cd backend && npm run dev"
Write-Host ""

Write-Host "Database issue resolution guide completed!"
Write-Host "Follow the steps above to fix the connection problem."
Write-Host "Once fixed, the application will be ready for production deploy."