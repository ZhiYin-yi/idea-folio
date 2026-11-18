# idea-folio · 初始化脚本
# 用法：
#   pwsh scripts/init.ps1 -Target "D:\work\my-site"
#   pwsh scripts/init.ps1 -Target "D:\work\my-site" -Images "C:\pics\a.jpg","C:\pics\b.jpg"

param(
  [Parameter(Mandatory = $true)][string]$Target,
  [string[]]$Images = @(),
  [int]$Port = 5299,
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$skill = Split-Path -Parent $PSScriptRoot
$template = Join-Path $skill "assets\template"
$defaults = Join-Path $skill "assets\defaults"
$python = $env:SKY_PYTHON
if (-not $python) { $python = "python" }

if (-not (Test-Path $template)) { throw "找不到模板：$template" }
if (Test-Path $Target) {
  $count = (Get-ChildItem $Target -Force -ErrorAction SilentlyContinue | Measure-Object).Count
  if ($count -gt 0) { throw "目标目录不是空的：$Target" }
}

Write-Host "1/4 复制模板 → $Target"
New-Item -ItemType Directory -Force -Path $Target | Out-Null
Copy-Item (Join-Path $template "*") $Target -Recurse -Force

Write-Host "2/4 生成图片槽位"
$imgArgs = @((Join-Path $skill "scripts\images.py"), "--project", $Target, "--defaults", $defaults)
if ($Images.Count -gt 0) { $imgArgs += @("--in") + $Images }
& $python @imgArgs
if ($LASTEXITCODE -ne 0) { throw "图片处理失败" }

if (-not $SkipInstall) {
  Write-Host "3/4 安装依赖（约 30–60 秒）"
  Push-Location $Target
  npm install --registry=https://registry.npmmirror.com --no-audit --no-fund | Out-Host
  Pop-Location
  if ($LASTEXITCODE -ne 0) { throw "npm install 失败" }
}

Write-Host "4/4 启动开发服务器 → http://127.0.0.1:$Port"
Write-Host "     验收：node `"$skill\scripts\verify.mjs`" --url http://127.0.0.1:$Port --out shots"
Push-Location $Target
Start-Process -FilePath "node" `
  -ArgumentList "node_modules\vite\bin\vite.js --host 127.0.0.1 --port $Port" `
  -WorkingDirectory $Target -WindowStyle Hidden `
  -RedirectStandardOutput (Join-Path $Target "_vite.log") `
  -RedirectStandardError (Join-Path $Target "_vite.err")
Pop-Location

Start-Sleep -Seconds 6
$code = (curl.exe -s -o NUL -w "%{http_code}" --max-time 8 "http://127.0.0.1:$Port/" 2>&1)
Write-Host "     HTTP $code"
