# Youth Angola Streaming - Database Test Script
Write-Host "Testing database connection..." -ForegroundColor Green

# Check if .env.production exists
if (-not (Test-Path "backend/.env.production")) {
    Write-Host "ERROR: .env.production file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "File .env.production found" -ForegroundColor Green

# Check current DATABASE_URL
Write-Host "Checking DATABASE_URL..."
$envPath = "backend/.env.production"
$currentDbUrl = Get-Content $envPath | Where-Object { $_ -match "^DATABASE_URL=" }

if ($currentDbUrl) {
    Write-Host "DATABASE_URL: $currentDbUrl" -ForegroundColor Cyan
} else {
    Write-Host "DATABASE_URL not configured" -ForegroundColor Yellow
}

# Test database connection
Write-Host "Testing database connection..."
Set-Location backend

# Test with prisma db pull
Write-Host "Testing with prisma db pull..."
$result = npx prisma db pull 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database connection successful!" -ForegroundColor Green
} else {
    Write-Host "Database connection failed" -ForegroundColor Red
    Write-Host "Error: $result" -ForegroundColor Red
}

# Test with prisma migrate status
Write-Host ""
Write-Host "Testing with prisma migrate status..."
$result2 = npx prisma migrate status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration status check successful!" -ForegroundColor Green
    Write-Host $result2
} else {
    Write-Host "Migration status check failed" -ForegroundColor Red
    Write-Host "Error: $result2" -ForegroundColor Red
}

Set-Location ..

# Database troubleshooting
Write-Host ""
Write-Host "Database troubleshooting guide:" -ForegroundColor Cyan
Write-Host ""
Write-Host "If connection failed, check:"
Write-Host "1. Supabase project is active"
Write-Host "2. Database URL is correct"
Write-Host "3. Your IP is allowed in Supabase settings"
Write-Host "4. Firewall is not blocking the connection"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. cd backend && npx prisma migrate deploy"
Write-Host "2. cd backend && node scripts/createAdminProd.cjs"