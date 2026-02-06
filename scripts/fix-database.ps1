# Youth Angola Streaming - Database Fix Script
Write-Host "🔧 Fixing database connection issues..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param(
        [string]$Message
    )
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-WarningMsg {
    param(
        [string]$Message
    )
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-ErrorMsg {
    param(
        [string]$Message
    )
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if .env.production exists
if (-not (Test-Path "backend/.env.production")) {
    Write-ErrorMsg ".env.production file not found!"
    exit 1
}

Write-Status ".env.production file found"

# Check current DATABASE_URL
Write-Host "Checking current DATABASE_URL..."
$envPath = "backend/.env.production"
$currentDbUrl = Get-Content $envPath | Where-Object { $_ -match "^DATABASE_URL=" }

if ($currentDbUrl) {
    Write-Host "Current DATABASE_URL: $currentDbUrl" -ForegroundColor Cyan
} else {
    Write-WarningMsg "DATABASE_URL not configured"
}

# Test database connection
Write-Host "Testing database connection..."
Set-Location backend

# Try different connection methods
Write-Host "Method 1: Testing with prisma db pull..."
try {
    $result1 = npx prisma db pull 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Database connection successful with prisma db pull!"
    } else {
        Write-ErrorMsg "prisma db pull failed"
        Write-Host "Error: $result1" -ForegroundColor Red
    }
} catch {
    Write-ErrorMsg "Error with prisma db pull: $_"
}

Write-Host ""
Write-Host "Method 2: Testing with prisma migrate status..."
try {
    $result2 = npx prisma migrate status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Migration status check successful!"
        Write-Host $result2
    } else {
        Write-ErrorMsg "Migration status check failed"
        Write-Host "Error: $result2" -ForegroundColor Red
    }
} catch {
    Write-ErrorMsg "Error with migration status: $_"
}

Set-Location ..

# Database troubleshooting guide
Write-Host ""
Write-Host "🔧 Database Troubleshooting Guide:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Common issues and solutions:"
Write-Host ""
Write-Host "1. Network/Firewall Issues:"
Write-Host "   - Check if your IP is allowed in Supabase settings"
Write-Host "   - Verify firewall is not blocking the connection"
Write-Host "   - Try connecting from a different network"
Write-Host ""
Write-Host "2. Database URL Issues:"
Write-Host "   - Verify the DATABASE_URL is correct"
Write-Host "   - Check if the password contains special characters that need encoding"
Write-Host "   - Ensure sslmode=require is set"
Write-Host ""
Write-Host "3. Supabase Project Issues:"
Write-Host "   - Verify the project is active"
Write-Host "   - Check if the database is running"
Write-Host "   - Verify the connection limits are not exceeded"
Write-Host ""
Write-Host "4. Environment Issues:"
Write-Host "   - Ensure .env.production is properly configured"
Write-Host "   - Check if all required dependencies are installed"
Write-Host "   - Verify Node.js and Prisma versions are compatible"
Write-Host ""

# Next steps
Write-Host "🎯 Next Steps to Fix Database:"
Write-Host ""
Write-Host "1. Check Supabase project status:"
Write-Host "   https://app.supabase.com/project/your-project"
Write-Host ""
Write-Host "2. Verify database connection settings:"
Write-Host "   - Go to Settings > Database"
Write-Host "   - Check connection string"
Write-Host "   - Verify allowed IPs"
Write-Host ""
Write-Host "3. Test connection manually:"
Write-Host "   cd backend"
Write-Host "   npx prisma db pull"
Write-Host ""
Write-Host "4. If still failing, try:"
Write-Host "   - Restarting the Supabase database"
Write-Host "   - Checking Supabase status page"
Write-Host "   - Contacting Supabase support"
Write-Host ""

Write-Status "Database troubleshooting completed!"
Write-Host ""
Write-Host "Once the database connection is fixed, run:"
Write-Host "1. cd backend && npx prisma migrate deploy"
Write-Host "2. cd backend && node scripts/createAdminProd.cjs"