#!/usr/bin/env bash
# 排查「内网 IP:8080 打不开」：在**运行 Docker 的那台机器**上执行（仓库根目录）。
#   chmod +x scripts/check-lan-8080.sh && ./scripts/check-lan-8080.sh
set -u

echo "========== SmartWardrobe 局域网 8080 自检 =========="
echo ""

echo ">>> 1) 容器 smart-wardrobe-private 状态"
if docker inspect smart-wardrobe-private >/dev/null 2>&1; then
  docker inspect -f '    状态: {{.State.Status}}  退出码: {{.State.ExitCode}}' smart-wardrobe-private
else
  echo "    未找到容器。请先: ./start.sh up"
fi
echo ""

echo ">>> 2) 宿主机谁在监听 8080（应有 0.0.0.0:8080 或 *:8080）"
if command -v ss >/dev/null 2>&1; then
  ss -tlnp 2>/dev/null | grep -E ':8080\s' || echo "    （无监听或未安装 ss）"
else
  netstat -tlnp 2>/dev/null | grep 8080 || echo "    （无 netstat/ss）"
fi
echo ""

echo ">>> 3) 访问 http://127.0.0.1:8080/（本机环回，必须通过）"
_code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 5 http://127.0.0.1:8080/ 2>/dev/null || echo "000")
if [[ "${_code}" == "200" ]]; then
  echo "    HTTP 200 — 服务正常。"
else
  echo "    HTTP ${_code} — 非 200 或超时；先查 Docker: ./scripts/docker-diagnose.sh"
fi
echo ""

echo ">>> 4) 本机当前 IPv4（请用手机访问**这里列出的**地址，不要照抄文档里的 192.168.31.10）"
ip -4 addr show scope global 2>/dev/null | sed 's/^/    /' || hostname -I | sed 's/^/    hostname -I: /'
echo ""

echo ">>> 5) 用本机 curl 各局域网 IP（部分路由器/网卡「本机访问本机局域网 IP」会失败，属 hairpin，正常）"
_ips=$(hostname -I 2>/dev/null || true)
for ip in $_ips; do
  [[ "$ip" == 127.* ]] && continue
  code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 3 "http://${ip}:8080/" 2>/dev/null || echo "ERR")
  echo "    http://${ip}:8080/ -> ${code}"
done
echo ""

echo ">>> 说明"
echo "    · 同一台电脑浏览器请优先用: http://127.0.0.1:8080/"
echo "    · 手机访问必须用上面「全局 IPv4」里**同一网段**的 IP，且与电脑同一 Wi‑Fi（非访客网络）。"
echo "    · Docker 若在 WSL2 里：Windows 的 192.168.x.x 往往不是 WSL 的地址，请在 WSL 终端里执行本脚本看 IP。"
echo "    · 若 127.0.0.1 正常但手机不行: 放行防火墙 8080（如 sudo ufw allow 8080/tcp），并关 VPN 试。"
echo "===================================================="
