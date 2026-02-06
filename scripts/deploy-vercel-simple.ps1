# Youth Angola Streaming - Vercel Deploy (Simple)
Write-Host "Deploying to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..."
try {
    $vercelVersion = vercel --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Vercel CLI found: $vercelVersion" -ForegroundColor Green
    } else {
        Write-Host "Vercel CLI not found" -ForegroundColor Red
        Write-Host "Install with: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Error checking Vercel CLI: $_" -ForegroundColor Red
    exit 1
}

# Check authentication
Write-Host "Checking Vercel authentication..."
try {
    $vercelWhoami = vercel whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Authenticated: $vercelWhoami" -ForegroundColor Green
    } else {
        Write-Host "Not logged in to Vercel" -ForegroundColor Yellow
        Write-Host "Run: vercel login" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Please login to Vercel: vercel login" -ForegroundColor Yellow
}

# Check environment configuration
Write-Host "Checking environment configuration..."
if (-not (Test-Path "backend/.env.production")) {
    Write-Host ".env.production file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ".env.production found" -ForegroundColor Green

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
Write-Host "Vercel configuration created" -ForegroundColor Green

# Deploy backend
Write-Host "Deploying backend to Vercel..."
Set-Location backend

try {
    Write-Host "Running: vercel --prod"
    $deployResult = vercel --prod 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backend deployed successfully!" -ForegroundColor Green
        Write-Host "Deploy result: $deployResult"
    } else {
        Write-Host "Backend deployment failed" -ForegroundColor Red
        Write-Host "Error: $deployResult"
    }
} catch {
    Write-Host "Error during deployment: $_" -ForegroundColor Red
}

Set-Location ..

# Frontend deployment guide
Write-Host ""
Write-Host "Frontend Deployment Guide:" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy frontend to Vercel:"
Write-Host "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
Write-Host "2. Import GitHub repository"
Write-Host "3. Configure build settings:"
Write-Host "   - Framework: Vite"
Write-Host "   - Build Command: npm run build"
Write-Host "   - Output Directory: dist"
Write-Host "   - Install Command: npm install"
Write-Host ""
Write-Host "4. Set environment variables:"
Write-Host "   - VITE_API_URL: [your-backend-url]"
Write-Host "   - VITE_STRIPE_PUBLIC_KEY: [your-stripe-public-key]"
Write-Host ""
Write-Host "5. Deploy"

# Next steps
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "1. Resolve database connection issue (Supabase configuration)"
Write-Host "2. Run migrations: cd backend; npx prisma migrate deploy"
Write-Host "3. Create admin user: cd backend; node scripts/createAdminProd.cjs"
Write-Host "4. Deploy to Vercel using commands above"
Write-Host "5. Test application in production"
Write-Host ""
Write-Host "Your Youth Angola Streaming is ready for production deploy!"