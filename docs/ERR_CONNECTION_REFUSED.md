# `ERR_CONNECTION_REFUSED`（192.168.x.x:8080 拒绝连接）

含义：**浏览器连到的那台机器上，8080 端口没有服务在听**，或 **防火墙直接回了 RST**（也会显示「拒绝连接」）。

下面按顺序做，做到哪一步通了即可停。

---

## 1. 在「跑 Docker 的那台电脑」上确认服务真的在跑

在 **Docker 所在系统** 打开终端（不是手机），进入仓库根目录：

```bash
cd /path/to/smartwardrobe_private
./start.sh ps
docker ps --filter name=smart-wardrobe-private
```

若没有容器或状态不是 `Up`，先：

```bash
./start.sh up
# Linux 仍异常再试：
# ./start.sh up-host
```

---

## 2. 在同一台机器上测 8080（必须通过）

仍在 **Docker 那台机器**：

```bash
curl -sS -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:8080/
ss -tlnp | grep 8080
```

- **`curl` 不是 200**：问题在 Docker/应用，先看 `./start.sh logs` 或 `./scripts/docker-diagnose.sh`。
- **`ss` 里没有 `8080`**：没有任何进程在听 8080，还是启动/映射问题。
- 期望看到类似 **`0.0.0.0:8080`** 或 **`*:8080`**（不要只有 `127.0.0.1:8080` 却仍从别的设备访问）。

---

## 3. Docker 装在 WSL2 里、浏览器在 Windows 上（极常见）

这时你电脑的 **局域网 IP（如 192.168.31.10）挂在 Windows 网卡上**，而 **8080 往往只在 WSL 里监听**，Windows 上 **没有** 进程在 `192.168.31.10:8080` 上听 → **就是「拒绝连接」**。

**处理二选一：**

### A. 用 Windows 端口转发（管理员 PowerShell）

仓库里脚本（在 Windows 上执行，不是 WSL）：

```powershell
# 在仓库的 docs 同目录有脚本时可：
# 右键「以管理员身份运行」PowerShell，cd 到仓库后：
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\docs\windows-wsl-portproxy-8080.ps1
```

或手动（管理员 PowerShell，把 `<WSL_IP>` 换成 WSL 里 `wsl hostname -I` 的第一个 IP）：

```powershell
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=<WSL_IP>
```

并放行防火墙入站 **TCP 8080**（「高级安全 Windows 防火墙」→ 入站规则）。

### B. 改用 Docker Desktop 并确认「在 Windows 上发布端口」

由 Docker Desktop 起的容器，端口有时只映射到 Windows 的 localhost；若要从 **局域网 IP** 访问，需在 Docker Desktop 设置里确认与 **WSL 集成 / 端口发布** 相关选项，或仍用上面的 **portproxy**。

---

## 4. 纯 Linux 宿主机：防火墙

若 `127.0.0.1:8080` 正常，但 **手机访问 192.168.31.10:8080** 拒绝：

```bash
sudo ufw allow 8080/tcp
sudo ufw reload
# 或 firewalld:
# sudo firewall-cmd --permanent --add-port=8080/tcp && sudo firewall-cmd --reload
```

可再试：`./start.sh up-host`（仅 Linux，见 `infra/docker/docker-compose.host-network.yml`）。

---

## 5. 仍不行

把下面三条命令的**完整输出**贴出来（在 Docker 所在系统执行）：

```bash
./scripts/docker-diagnose.sh
curl -v --connect-timeout 3 http://127.0.0.1:8080/ 2>&1 | head -30
ss -tlnp | grep 8080 || true
```

（若在 WSL，说明是 WSL；若在物理机 Linux，说明发行版。）
