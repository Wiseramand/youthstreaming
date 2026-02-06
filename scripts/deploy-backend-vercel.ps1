# Youth Angola Streaming - Backend Vercel Deploy Script
Write-Host "🚀 Deploying Backend to Vercel..." -ForegroundColor Green

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

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI installation..."
try {
    $vercelVersion = vercel --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Vercel CLI found: $vercelVersion"
    } else {
        Write-ErrorMsg "Vercel CLI not found"
        Write-WarningMsg "Please install Vercel CLI: npm install -g vercel"
        exit 1
    }
} catch {
    Write-ErrorMsg "Error checking Vercel CLI: $_"
    Write-WarningMsg "Please install Vercel CLI: npm install -g vercel"
    exit 1
}

# Check if logged in to Vercel
Write-Host "Checking Vercel authentication..."
try {
    $vercelWhoami = vercel whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Authenticated to Vercel: $vercelWhoami"
    } else {
        Write-WarningMsg "Not logged in to Vercel"
        Write-Host "Please run: vercel login"
        Write-WarningMsg "Or use: vercel --token <your-token>"
    }
} catch {
    Write-WarningMsg "Please login to Vercel: vercel login"
}

# Check if .env.production is configured
Write-Host "Checking production environment configuration..."
if (-not (Test-Path "backend/.env.production")) {
    Write-ErrorMsg ".env.production file not found!"
    Write-WarningMsg "Please create .env.production with production settings"
    exit 1
}

# Check required environment variables
$envPath = "backend/.env.production"
$requiredVars = @("DATABASE_URL", "JWT_SECRET", "NODE_ENV", "STRIPE_SECRET_KEY", "SMTP_HOST")
$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not (Get-Content $envPath | Select-String "^$var=")) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-ErrorMsg "Missing environment variables: $($missingVars -join ', ')"
    Write-WarningMsg "Please configure all required variables in .env.production"
    exit 1
}

Write-Status "Environment variables configured"

# Navigate to backend directory
Set-Location backend

# Deploy backend to Vercel
Write-Host "Deploying backend to Vercel..."
try {
    Write-Host "Running: vercel --prod --yes"
    $deployResult = vercel --prod --yes 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Backend deployed successfully!"
        Write-Host "Deploy result: $deployResult"
    } else {
        Write-ErrorMsg "Backend deployment failed"
        Write-Host "Error: $deployResult"
    }
} catch {
    Write-ErrorMsg "Error during deployment: $_"
}

Set-Location ..

Write-Host ""
Write-Status "Backend deployment completed!"
Write-Host ""
Write-Host "🎯 Next Steps:"
Write-Host "1. Check the deployment URL from Vercel"
Write-Host "2. Test the API endpoints"
Write-Host "3. If database connection issues persist, check Supabase configuration in Vercel environment variables"
Write-Host "4. Run database migrations if needed"
Write-Host ""
Write-Host "🎉 Your backend is now deployed to Vercel!"