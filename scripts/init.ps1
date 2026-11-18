# idea-folio · 初始化脚本
# 用法（二选一，看机器上装了哪个）：
#   pwsh    scripts/init.ps1 -Target "D:\work\my-site"
#   powershell -ExecutionPolicy Bypass -File scripts/init.ps1 -Target "D:\work\my-site"
#
# 常用参数：
#   -Images "a.jpg","b.jpg"   用自己的图（不放则用自带默认图）
#   -Port 5299                开发服务器端口
#   -SkipInstall              跳过 npm install
#   -NoServe                  只建站不启动服务器

param(
  [Parameter(Mandatory = $true)][string]$Target,
  [string[]]$Images = @(),
  [int]$Port = 5299,
  [switch]$SkipInstall,
  [switch]$NoServe
)

$ErrorActionPreference = "Stop"

# Windows PowerShell 5.1 默认按 ANSI 读脚本、按 GBK 输出，中文会乱码
try {
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  $OutputEncoding = [System.Text.Encoding]::UTF8
} catch { }

$skill = Split-Path -Parent $PSScriptRoot
$template = Join-Path $skill "assets\template"
$defaults = Join-Path $skill "assets\defaults"

if (-not (Test-Path $template)) { throw "找不到模板：$template" }

# 目标目录必须为空
if (Test-Path $Target) {
  $count = (Get-ChildItem $Target -Force -ErrorAction SilentlyContinue | Measure-Object).Count
  if ($count -gt 0) { throw "目标目录不是空的：$Target" }
}

# 找 Python：环境变量 → python → py -3
$python = $env:SKY_PYTHON
if (-not $python) {
  $cmd = Get-Command python -ErrorAction SilentlyContinue
  if ($cmd) { $python = "python" }
  else {
    $py = Get-Command py -ErrorAction SilentlyContinue
    if ($py) { $python = "py" }
  }
}
if (-not $python) {
  throw "找不到 Python。装一个，或设置环境变量 SKY_PYTHON 指向 python.exe"
}

Write-Host "1/4 复制模板 -> $Target"
New-Item -ItemType Directory -Force -Path $Target | Out-Null
Copy-Item (Join-Path $template "*") $Target -Recurse -Force

Write-Host "2/4 生成图片槽位"
$env:PYTHONIOENCODING = "utf-8"
$imgArgs = @((Join-Path $skill "scripts\images.py"), "--project", $Target, "--defaults", $defaults)
if ($Images.Count -gt 0) { $imgArgs += @("--in") + $Images }
if ($python -eq "py") {
  & py -3 @imgArgs
} else {
  & $python @imgArgs
}
if ($LASTEXITCODE -ne 0) { throw "图片处理失败（Pillow 装了吗？pip install pillow）" }

if (-not $SkipInstall) {
  Write-Host "3/4 安装依赖（约 30-60 秒）"
  Push-Location $Target
  npm install --registry=https://registry.npmmirror.com --no-audit --no-fund | Out-Host
  $npmCode = $LASTEXITCODE
  Pop-Location
  if ($npmCode -ne 0) { throw "npm install 失败" }
}

if ($NoServe) {
  Write-Host "4/4 跳过启动（-NoServe）"
  Write-Host "     手动启动：cd `"$Target`"; npm run dev"
  return
}

Write-Host "4/4 启动开发服务器 -> http://127.0.0.1:$Port"
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
Write-Host "     验收：node `"$skill\scripts\verify.mjs`" --url http://127.0.0.1:$Port --out shots"
