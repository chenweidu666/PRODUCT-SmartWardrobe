#!/usr/bin/env bash
# 将仓库恢复到 v2 线上「今天第一笔」9beca68 的**上一笔**：8f27764
# 会先备份当前 main，再 reset，并检出分支 v2。
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TARGET="8f27764d7c5f7632fcd3b884fffd180a8357b783"
BACKUP="backup/main-before-restore-$(date +%Y%m%d-%H%M%S)"

echo "当前 HEAD: $(git rev-parse HEAD)"
echo "备份当前 main -> ${BACKUP}"
git branch "${BACKUP}" main

echo "重置到 ${TARGET}（v2 上 9beca68 的父提交）…"
git reset --hard "${TARGET}"

echo "检出/创建分支 v2"
git checkout -B v2

echo "完成。"
git log -1 --oneline
echo "备份分支: ${BACKUP}（如需回到恢复前: git checkout main && git reset --hard ${BACKUP}）"
