#!/usr/bin/env bash
# 私有副本 Docker 启动失败时，在仓库根目录运行本脚本收集信息。
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}/infra/docker"

_cf="docker-compose.yml"
if [[ -f "${ROOT}/infra/docker/.compose-mode" ]] && [[ "$(tr -d ' \n\r\t' < "${ROOT}/infra/docker/.compose-mode")" == "host" ]]; then
  _cf="docker-compose.host-network.yml"
fi

echo "=== Compose 模式（bridge / host）==="
if [[ -f "${ROOT}/infra/docker/.compose-mode" ]]; then
  cat "${ROOT}/infra/docker/.compose-mode" | sed 's/^/    /'
else
  echo "    （无 .compose-mode，默认 bridge）"
fi
echo "    当前诊断使用的文件: ${_cf}"
echo ""

echo "=== Docker / Compose ==="
command -v docker >/dev/null 2>&1 && docker version 2>&1 | head -20 || echo "未找到 docker"
echo ""
docker compose -f "${_cf}" ps -a 2>&1 || true
echo ""
echo "=== 最近日志（smartwardrobe 服务）==="
docker compose -f "${_cf}" logs --tail=120 smartwardrobe 2>&1 || true
echo ""
echo "=== 容器 smart-wardrobe-private 状态 ==="
docker inspect smart-wardrobe-private 2>/dev/null | grep -E '"Status"|"Error"|ExitCode' || echo "无此容器（可能尚未创建或名称已变）"
echo ""
echo "=== 宿主机 8080 占用（若有 ss）==="
ss -tlnp 2>/dev/null | grep ':8080' || echo "无 ss 或未监听 8080"
echo ""
echo "若日志含 JWT_SECRET：请在 infra/docker/.env 设置非空的 JWT_SECRET（勿提交到 Git）。"
echo "若提示 port is already allocated：先停止占用 8080 的服务，或改 compose 端口映射。"
