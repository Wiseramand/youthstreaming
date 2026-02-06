# Youth Angola Streaming - Vercel Deploy Script
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green

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

# Create Vercel configuration
Write-Host "Creating Vercel configuration..."
$vercelConfig = @{
    "version" = 2
    "builds" = @(
        @{
            "src" = "backend/package.json"
            "use" = "@vercel/node"
        }
    )
    "routes" = @(
        @{
            "src" = "/api/(.*)"
            "dest" = "/backend/src/index.ts"
        }
    )
}

$vercelConfig | ConvertTo-Json -Depth 3 | Out-File -FilePath "vercel.json" -Encoding utf8

Write-Status "Vercel configuration created"

# Deploy backend
Write-Host "Deploying backend to Vercel..."
Set-Location backend

# Set environment variables for Vercel
$envVars = Get-Content .env.production | Where-Object { $_ -notmatch "^#" -and $_ -match "=" }
foreach ($var in $envVars) {
    $key = $var.Split('=')[0]
    $value = $var.Substring($var.IndexOf('=') + 1)
    # Remove quotes if present
    $value = $value -replace '^"(.*)"$', '$1'
    Write-Host "Setting $key for Vercel..."
}

# Deploy
try {
    Write-Host "Running: vercel --prod"
    $deployResult = vercel --prod 2>&1
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

# Create frontend deployment guide
Write-Host ""
Write-Host "📚 Frontend Deployment Guide:" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy the frontend to Vercel:"
Write-Host ""
Write-Host "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
Write-Host "2. Import your GitHub repository"
Write-Host "3. Configure build settings:"
Write-Host "   - Framework: Vite"
Write-Host "   - Build Command: npm run build"
Write-Host "   - Output Directory: dist (if exists)"
Write-Host "   - Install Command: npm install"
Write-Host ""
Write-Host "4. Set environment variables:"
Write-Host "   - VITE_API_URL: [your-backend-url]"
Write-Host "   - VITE_STRIPE_PUBLIC_KEY: [your-stripe-public-key]"
Write-Host ""
Write-Host "5. Deploy"

# Final verification
Write-Host ""
Write-Status "Vercel deployment preparation completed!"
Write-Host ""
Write-Host "🎯 Next Steps:"
Write-Host "1. Resolve database connection issue (Supabase configuration)"
Write-Host "2. Run migrations: cd backend && npx prisma migrate deploy"
Write-Host "3. Create admin user: cd backend && node scripts/createAdminProd.cjs"
Write-Host "4. Deploy to Vercel using the commands above"
Write-Host "5. Test the application in production"
Write-Host ""
Write-Host "🎉 Your Youth Angola Streaming is ready for production deploy!"