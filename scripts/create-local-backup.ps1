$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot "outputs"
$backupPath = Join-Path $outputDirectory "MingKai-B2B-Complete-Local-Backup.zip"
$sourcePath = Join-Path $outputDirectory "MingKai-B2B-Site-Source.zip"

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
if (Test-Path -LiteralPath $backupPath) {
  Remove-Item -LiteralPath $backupPath -Force
}
if (Test-Path -LiteralPath $sourcePath) {
  Remove-Item -LiteralPath $sourcePath -Force
}

$relativeItems = @(
  "app", "components", "db", "docs", "drizzle", "lib", "public", "scripts", "build", "vendor",
  ".openai", ".env.example", ".gitignore", ".npmrc", "README.md", "package.json", "package-lock.json",
  "pnpm-lock.yaml", "pnpm-workspace.yaml", "tsconfig.json", "next.config.ts", "vite.config.ts",
  "drizzle.config.ts", "cloudflare-env.d.ts", "postcss.config.mjs", "components.json", "eslint.config.mjs",
  "next-env.d.ts", "Start-Local-Preview.bat", "Create-Complete-Backup.bat"
)

$backupItems = $relativeItems |
  Where-Object { Test-Path -LiteralPath (Join-Path $projectRoot $_) }

$localState = Join-Path $projectRoot ".wrangler"
if (Test-Path -LiteralPath $localState) {
  $backupItems += ".wrangler"
}

Push-Location $projectRoot
try {
  & tar.exe -a -c -f $sourcePath @backupItems
  if ($LASTEXITCODE -ne 0) {
    throw "The Windows archive tool could not create the source package (exit code $LASTEXITCODE)."
  }
  & tar.exe -a -c -f $backupPath @backupItems
  if ($LASTEXITCODE -ne 0) {
    throw "The Windows archive tool returned exit code $LASTEXITCODE."
  }
} finally {
  Pop-Location
}
Write-Host "Backup complete: $backupPath"
Write-Host "Updated source package: $sourcePath"
if (Test-Path -LiteralPath $localState) {
  Write-Host "Included local product, inquiry and media-preview data from .wrangler."
} else {
  Write-Host "No local content data folder exists yet; the backup contains the source only."
}
