#Requires -RunAsAdministrator
<#
.SYNOPSIS
  将 Windows 上所有网卡收到的 TCP 8080 转发到当前默认 WSL 发行版的 8080。
  用于：Docker 跑在 WSL2 里，手机/本机用 http://<Windows局域网IP>:8080/ 却 ERR_CONNECTION_REFUSED。

.NOTES
  以「管理员身份」运行 PowerShell，再执行：
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
    cd <smartwardrobe_private>\docs
    .\windows-wsl-portproxy-8080.ps1
#>

$ErrorActionPreference = "Stop"

$wslOut = wsl.exe -e sh -c "hostname -I" 2>$null
if (-not $wslOut) {
    Write-Host "无法获取 WSL IP。请确认已安装 WSL2 且默认发行版可运行 wsl hostname -I" -ForegroundColor Red
    exit 1
}
$wslIp = ($wslOut.Trim() -split "\s+")[0]
Write-Host "检测到 WSL IP: $wslIp"

# 删掉旧规则（忽略错误）
netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=8080 2>$null | Out-Null

netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8080 connectaddress=$wslIp connectport=8080
Write-Host "已添加 portproxy: 0.0.0.0:8080 -> ${wslIp}:8080"

# 入站防火墙（名称重复时忽略）
try {
    New-NetFirewallRule -DisplayName "SmartWardrobe WSL 8080" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080 -ErrorAction Stop
    Write-Host "已添加防火墙入站规则 TCP 8080"
} catch {
    if ($_.Exception.Message -match "already exists|已存在") {
        Write-Host "防火墙规则可能已存在，跳过"
    } else {
        Write-Host "防火墙规则添加失败（可手动放行 TCP 8080）: $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "请确保 WSL 内已 ./start.sh up 且 curl http://127.0.0.1:8080/ 返回 200。"
Write-Host "查看当前 portproxy: netsh interface portproxy show all"
Write-Host "删除本规则: netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=8080"
