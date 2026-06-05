# TREK Server 啟動腳本 (PowerShell)
# 使用方式: 右鍵 -> 用 PowerShell 執行

$host.UI.RawUI.WindowTitle = "TREK Server"

Write-Host ""
Write-Host "  ████████╗██████╗ ███████╗██╗  ██╗" -ForegroundColor Cyan
Write-Host "  ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝" -ForegroundColor Cyan
Write-Host "     ██║   ██████╔╝█████╗  █████╔╝ " -ForegroundColor Cyan
Write-Host "     ██║   ██╔══██╗██╔══╝  ██╔═██╗ " -ForegroundColor Cyan
Write-Host "     ██║   ██║  ██║███████╗██║  ██╗" -ForegroundColor Cyan
Write-Host "     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  自架旅行規劃器 v3.0.22" -ForegroundColor White
Write-Host "  ─────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

$ServerDir = Join-Path $PSScriptRoot "server"
Set-Location $ServerDir

$env:NODE_ENV = "production"
$env:PORT = "3001"
$env:TZ = "Asia/Taipei"
$env:LOG_LEVEL = "info"

# 等待3秒後自動開啟瀏覽器
$job = Start-Job {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3001"
}

Write-Host "  ✓ 伺服器啟動中..." -ForegroundColor Green
Write-Host "  ✓ 瀏覽器將自動開啟 http://localhost:3001" -ForegroundColor Green
Write-Host "  ✓ 按 Ctrl+C 停止伺服器" -ForegroundColor Yellow
Write-Host "  ─────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

npm start
