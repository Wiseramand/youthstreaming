# Youth Angola Streaming - Database Setup (Simple)
Write-Host "Configuring database for production..." -ForegroundColor Green

# Check if .env.production exists
if (-not (Test-Path "backend/.env.production")) {
    Write-Host "ERROR: .env.production file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "File .env.production found" -ForegroundColor Green

# Check current DATABASE_URL
Write-Host "Checking current DATABASE_URL..."
$envPath = "backend/.env.production"
$currentDbUrl = Get-Content $envPath | Where-Object { $_ -match "^DATABASE_URL=" }

if ($currentDbUrl) {
    Write-Host "Current DATABASE_URL: $currentDbUrl" -ForegroundColor Cyan
} else {
    Write-Host "DATABASE_URL not configured" -ForegroundColor Yellow
}

# Check if it's using Supabase
if ($currentDbUrl -match "supabase.co") {
    Write-Host "Supabase detected - checking connection..." -ForegroundColor Yellow
    
    # Test connection
    Write-Host "Testing Supabase connection..."
    Set-Location backend
    try {
        $result = npx prisma db pull --force-reset 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Supabase connection successful!" -ForegroundColor Green
        } else {
            Write-Host "Supabase connection failed" -ForegroundColor Red
            Write-Host "Error: $result" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error testing connection: $_" -ForegroundColor Red
    }
    Set-Location ..
} else {
    Write-Host "Database not identified as Supabase" -ForegroundColor Yellow
}

# Database setup guide
Write-Host ""
Write-Host "Database configuration guide:" -ForegroundColor Cyan
Write-Host ""
Write-Host "To configure the production database, follow these steps:"
Write-Host ""
Write-Host "1. Get your production database URL:"
Write-Host "   - If using Supabase: https://app.supabase.com/project/your-project/settings/database"
Write-Host "   - If using another provider: get the connection string"
Write-Host ""
Write-Host "2. Update DATABASE_URL in .env.production:"
Write-Host "   DATABASE_URL='postgresql://user:password@host:port/dbname?sslmode=require'"
Write-Host ""
Write-Host "3. Run migrations:"
Write-Host "   cd backend"
Write-Host "   npx prisma migrate deploy"
Write-Host ""
Write-Host "4. Create admin user:"
Write-Host "   node scripts/createAdminProd.cjs"
Write-Host ""

# Check migrations status
if ($currentDbUrl -match "supabase.co") {
    Write-Host "Supabase detected - checking migrations status..."
    
    Set-Location backend
    try {
        $migrations = npx prisma migrate status 2>&1
        Write-Host "Migration status:" -ForegroundColor Cyan
        Write-Host $migrations
    } catch {
        Write-Host "Error checking migrations: $_" -ForegroundColor Red
    }
    Set-Location ..
}

Write-Host "Database configuration completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Verify DATABASE_URL is correct"
Write-Host "2. Run: cd backend && npx prisma migrate deploy"
Write-Host "3. Run: cd backend && node scripts/createAdminProd.cjs"
Write-Host "4. Test the application in production"