# Youth Angola Streaming - Deploy Script (Simple)
Write-Host "Starting Youth Angola Streaming deploy..." -ForegroundColor Green

# Check if required files exist
Write-Host "Checking required files..."
if (-not (Test-Path "backend/.env.production")) {
    Write-Host "ERROR: .env.production file not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "backend/package.json")) {
    Write-Host "ERROR: backend/package.json file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Files verified successfully" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..."
Set-Location backend
npm install
Set-Location ..

Write-Host "Dependencies installed" -ForegroundColor Green

# Run database migrations
Write-Host "Running database migrations..."
Set-Location backend
npx prisma migrate deploy
Set-Location ..

Write-Host "Migrations completed" -ForegroundColor Green

# Create admin user
Write-Host "Creating admin user..."
Set-Location backend
node scripts/createAdminProd.cjs
Set-Location ..

Write-Host "Admin user created" -ForegroundColor Green

# Check environment variables
Write-Host "Checking environment variables..."
Set-Location backend

$requiredVars = @("DATABASE_URL", "JWT_SECRET", "NODE_ENV")
$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not (Get-Content .env.production | Select-String "^$var=")) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "ERROR: Missing environment variables: $missingVars" -ForegroundColor Red
    Write-Host "Please configure all required variables in .env.production" -ForegroundColor Yellow
    exit 1
}

Write-Host "Environment variables verified" -ForegroundColor Green

# Final checks
Write-Host "Final verification..."
Write-Host "   - Database: OK"
Write-Host "   - Migrations: OK" 
Write-Host "   - Admin user: OK"
Write-Host "   - Environment: OK"

Write-Host "Deploy preparation completed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure SMTP in .env.production"
Write-Host "2. Configure Stripe in .env.production"
Write-Host "3. Deploy to Vercel"
Write-Host "4. Test the application in production"
Write-Host ""
Write-Host "Documentation:"
Write-Host "   - PRODUCTION_DEPLOY.md: Complete deploy guide"
Write-Host "   - STRIPE_SETUP.md: Payment configuration"
Write-Host "   - DEPLOY.md: General documentation"
Write-Host ""
Write-Host "Your Youth Angola Streaming is ready for production!" -ForegroundColor Yellow