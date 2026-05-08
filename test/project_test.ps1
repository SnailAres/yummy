# Project Test Script - Snack Rating Mini Program

Write-Host "========================================"
Write-Host "Project Completeness Test"
Write-Host "========================================"
Write-Host ""

$scriptPath = $PSScriptRoot
$rootPath = Split-Path -Path $scriptPath -Parent

$totalTests = 0
$passedTests = 0
$failedTests = 0

function Test-File {
    param($path, $desc)
    $totalTests++
    $fullPath = Join-Path -Path $rootPath -ChildPath $path
    if (Test-Path -Path $fullPath) {
        Write-Host "[PASS] $desc" -ForegroundColor Green
        $script:passedTests++
        return $true
    } else {
        Write-Host "[FAIL] $desc" -ForegroundColor Red
        $script:failedTests++
        return $false
    }
}

# Test 1: Project Structure
Write-Host "1. Project Structure Test"
Write-Host "----------------------------------------"
Test-File "miniprogram/app.json" "Global config file"
Test-File "miniprogram/app.js" "Global JS file"
Test-File "miniprogram/app.wxss" "Global style file"
Write-Host ""

# Test 2: Page Files
Write-Host "2. Page Files Test"
Write-Host "----------------------------------------"
Test-File "miniprogram/pages/index/index.js" "Index JS"
Test-File "miniprogram/pages/index/index.wxml" "Index WXML"
Test-File "miniprogram/pages/index/index.wxss" "Index WXSS"

Test-File "miniprogram/pages/detail/detail.js" "Detail JS"
Test-File "miniprogram/pages/detail/detail.wxml" "Detail WXML"
Test-File "miniprogram/pages/detail/detail.wxss" "Detail WXSS"

Test-File "miniprogram/pages/upload/upload.js" "Upload JS"
Test-File "miniprogram/pages/upload/upload.wxml" "Upload WXML"
Test-File "miniprogram/pages/upload/upload.wxss" "Upload WXSS"

Test-File "miniprogram/pages/my/my.js" "My JS"
Test-File "miniprogram/pages/my/my.wxml" "My WXML"
Test-File "miniprogram/pages/my/my.wxss" "My WXSS"
Write-Host ""

# Test 3: Cloud Functions
Write-Host "3. Cloud Functions Test"
Write-Host "----------------------------------------"
Test-File "cloudfunctions/getSnacks/index.js" "getSnacks index.js"
Test-File "cloudfunctions/getSnacks/config.json" "getSnacks config.json"

Test-File "cloudfunctions/rateSnack/index.js" "rateSnack index.js"
Test-File "cloudfunctions/rateSnack/config.json" "rateSnack config.json"

Test-File "cloudfunctions/submitSnack/index.js" "submitSnack index.js"
Test-File "cloudfunctions/submitSnack/config.json" "submitSnack config.json"
Write-Host ""

# Test 4: Image Resources
Write-Host "4. Image Resources Test"
Write-Host "----------------------------------------"
Test-File "miniprogram/images/home.png" "Home icon"
Test-File "miniprogram/images/home-active.png" "Home active icon"
Test-File "miniprogram/images/my.png" "My icon"
Test-File "miniprogram/images/my-active.png" "My active icon"
Test-File "miniprogram/images/default-goods-image.png" "Default goods image"
Write-Host ""

# Summary
Write-Host "========================================"
Write-Host "Test Summary"
Write-Host "========================================"
Write-Host "Total: $totalTests"
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -if ($failedTests -gt 0) { "Red" } else { "Green" }
Write-Host ""

if ($failedTests -eq 0) {
    Write-Host "[SUCCESS] All tests passed! Project is ready." -ForegroundColor Green
} else {
    Write-Host "[WARNING] Found $failedTests issues. Please fix them." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================"
Write-Host "Functional Testing Guide"
Write-Host "========================================"
Write-Host "1. Open project in WeChat DevTools"
Write-Host "2. Configure cloud environment in app.js"
Write-Host "3. Deploy cloud functions"
Write-Host "4. Create database collections (snacks, ratings)"
Write-Host "5. Test features:"
Write-Host "   - Home page零食列表"
Write-Host "   - Search功能"
Write-Host "   - Detail page viewing"
Write-Host "   - Rating (1-10分)"
Write-Host "   - Upload new snack"
Write-Host "   - My records page"
Write-Host ""