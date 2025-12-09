# get-context.ps1

# 1. HARDCODED OUTPUT FILE
$outputFile = Join-Path $PWD.Path "context.txt"

# 2. CLEAR/CREATE THE FILE (So you don't append to old versions)
"Project Context Generated on $(Get-Date)" | Set-Content -Path $outputFile

# 3. DEFINE IGNORE PATTERNS
$excludePatterns = @(
    "node_modules", 
    ".git", 
    ".expo", 
    "android", 
    "ios", 
    "assets",
    "dist",
    "web-build",
    "package-lock.json",
    "yarn.lock",
    ".DS_Store",
    "*.png",
    "*.jpg",
    "*.heic",
    "context.txt",      # Don't include the context file itself!
    "get-context.ps1"   # Don't include this script
)

Write-Host "Scanning files..." -ForegroundColor Cyan

# 4. GET FILES AND WRITE TO CONTEXT.TXT
Get-ChildItem -Recurse -File | ForEach-Object {
    $file = $_
    $relativePath = $file.FullName.Substring($PWD.Path.Length + 1)
    
    # Check exclusions
    $shouldSkip = $false
    foreach ($pattern in $excludePatterns) {
        if ($relativePath -like "*$pattern*") {
            $shouldSkip = $true
            break
        }
    }

    if (-not $shouldSkip) {
        # Formatting the output for the text file
        $header = "`n========================================`nFILE: $relativePath`n========================================"
        
        # Append header to file
        Add-Content -Path $outputFile -Value $header
        
        # Append content to file
        try {
            $content = Get-Content $file.FullName -Raw
            Add-Content -Path $outputFile -Value $content
        }
        catch {
            Add-Content -Path $outputFile -Value "[Binary or Unreadable Content]"
        }
        
        Write-Host "Added: $relativePath" -ForegroundColor Green
    }
}

Write-Host "`nDone! Context saved to: $outputFile" -ForegroundColor Yellow