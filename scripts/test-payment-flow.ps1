# Youth Angola Streaming - Test Payment Flow
Write-Host "Testing complete payment flow..." -ForegroundColor Green

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

# Check if backend is running
Write-Host "Checking backend status..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/health" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Status "Backend is running on http://localhost:4000"
    } else {
        Write-WarningMsg "Backend returned status: $($response.StatusCode)"
    }
} catch {
    Write-WarningMsg "Backend not accessible: $_"
    Write-WarningMsg "Please start backend with: cd backend && npm run dev"
}

# Test authentication endpoints
Write-Host ""
Write-Host "Testing authentication endpoints..." -ForegroundColor Cyan

# Test login endpoint
try {
    $loginTest = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" -Method POST -Body (@{
        email = "admin@youthangola.com"
        password = "AdminYouth2024!"
    } | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    
    if ($loginTest.StatusCode -eq 200) {
        Write-Status "Login endpoint working"
        $authResponse = $loginTest.Content | ConvertFrom-Json
        $adminToken = $authResponse.token
    } else {
        Write-WarningMsg "Login endpoint returned: $($loginTest.StatusCode)"
    }
} catch {
    Write-WarningMsg "Login test failed: $_"
}

# Test donation endpoints
Write-Host ""
Write-Host "Testing donation endpoints..." -ForegroundColor Cyan

# Test create donation endpoint
if ($adminToken) {
    try {
        $donationTest = Invoke-WebRequest -Uri "http://localhost:4000/api/donations" -Method POST -Body (@{
            amount = 1000
            currency = "USD"
            method = "stripe"
            message = "Test donation"
        } | ConvertTo-Json) -ContentType "application/json" -Headers @{
            "Authorization" = "Bearer $adminToken"
        } -UseBasicParsing
        
        if ($donationTest.StatusCode -eq 200) {
            Write-Status "Donation creation endpoint working"
        } else {
            Write-WarningMsg "Donation endpoint returned: $($donationTest.StatusCode)"
        }
    } catch {
        Write-WarningMsg "Donation test failed: $_"
    }
} else {
    Write-WarningMsg "Skipping donation test - no admin token available"
}

# Test Stripe webhook endpoint
Write-Host ""
Write-Host "Testing Stripe webhook endpoint..." -ForegroundColor Cyan
try {
    $webhookTest = Invoke-WebRequest -Uri "http://localhost:4000/api/webhook/stripe" -Method POST -Body (@{
        type = "payment_intent.succeeded"
        data = @{
            object = @{
                id = "pi_test_123"
                amount = 1000
                currency = "usd"
                status = "succeeded"
            }
        }
    } | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    
    if ($webhookTest.StatusCode -eq 200) {
        Write-Status "Stripe webhook endpoint working"
    } else {
        Write-WarningMsg "Webhook endpoint returned: $($webhookTest.StatusCode)"
    }
} catch {
    Write-WarningMsg "Webhook test failed: $_"
}

# Test admin endpoints
Write-Host ""
Write-Host "Testing admin endpoints..." -ForegroundColor Cyan

if ($adminToken) {
    try {
        $adminTest = Invoke-WebRequest -Uri "http://localhost:4000/api/admin/stats" -Method GET -Headers @{
            "Authorization" = "Bearer $adminToken"
        } -UseBasicParsing
        
        if ($adminTest.StatusCode -eq 200) {
            Write-Status "Admin stats endpoint working"
        } else {
            Write-WarningMsg "Admin endpoint returned: $($adminTest.StatusCode)"
        }
    } catch {
        Write-WarningMsg "Admin test failed: $_"
    }
} else {
    Write-WarningMsg "Skipping admin test - no admin token available"
}

# Test VIP user creation
Write-Host ""
Write-Host "Testing VIP user creation..." -ForegroundColor Cyan

if ($adminToken) {
    try {
        $vipTest = Invoke-WebRequest -Uri "http://localhost:4000/api/vip/users" -Method POST -Body (@{
            name = "Test User"
            email = "test@example.com"
            password = "TestPassword123!"
            role = "VIP"
        } | ConvertTo-Json) -ContentType "application/json" -Headers @{
            "Authorization" = "Bearer $adminToken"
        } -UseBasicParsing
        
        if ($vipTest.StatusCode -eq 200) {
            Write-Status "VIP user creation working"
        } else {
            Write-WarningMsg "VIP creation returned: $($vipTest.StatusCode)"
        }
    } catch {
        Write-WarningMsg "VIP creation test failed: $_"
    }
} else {
    Write-WarningMsg "Skipping VIP test - no admin token available"
}

# Payment flow summary
Write-Host ""
Write-Host "Payment Flow Test Summary:" -ForegroundColor Green
Write-Host ""
Write-Host "Components tested:"
Write-Host "1. Backend server accessibility"
Write-Host "2. Authentication system"
Write-Host "3. Donation processing"
Write-Host "4. Stripe webhook handling"
Write-Host "5. Admin panel functionality"
Write-Host "6. VIP user management"
Write-Host ""
Write-Host "For production testing:"
Write-Host "1. Use real Stripe test keys"
Write-Host "2. Test with actual payment methods"
Write-Host "3. Verify email notifications"
Write-Host "4. Test webhook security"
Write-Host "5. Monitor transaction logs"
Write-Host ""

Write-Status "Payment flow testing completed!"
Write-Host ""
Write-Host "Next steps for production:"
Write-Host "1. Configure real Stripe keys in .env.production"
Write-Host "2. Test with Stripe test cards"
Write-Host "3. Verify email delivery"
Write-Host "4. Monitor payment processing"
Write-Host "5. Set up payment reconciliation"