# Windows 10 21H2 跑 TREK 的替代方案

檢查日期：2026-06-05

## 結論

這台電腦目前是：

- Windows 10 Pro
- DisplayVersion：21H2
- Build：19044
- Node.js：v24.15.0

Docker Desktop 官方目前要求 Windows 10 22H2 build 19045，所以 21H2 build 19044 安裝失敗是合理的。

但 TREK 不一定要用 Docker 才能跑。本機已確認可以用 Node.js 直接啟動官方 TREK server。

## 已驗證結果

已用 Node.js 啟動：

```powershell
cd C:\Users\VGH00\Documents\Codex\2026-06-03\trek\server
$env:NODE_ENV="production"
$env:PORT="3000"
$env:TZ="Asia/Taipei"
$env:LOG_LEVEL="info"
node --import tsx src/index.ts
```

健康檢查成功：

```powershell
Invoke-WebRequest -UseBasicParsing -Uri http://127.0.0.1:3000/api/health
```

回應：

```json
{"status":"ok"}
```

使用網址：

```text
http://127.0.0.1:3000
```

## 最簡單使用方式

在 `trek` 目錄執行：

```powershell
cd C:\Users\VGH00\Documents\Codex\2026-06-03\trek
.\start.ps1
```

或直接執行：

```powershell
cd C:\Users\VGH00\Documents\Codex\2026-06-03\trek\server
$env:NODE_ENV="production"; $env:PORT="3000"; $env:TZ="Asia/Taipei"; $env:LOG_LEVEL="info"
node --import tsx src/index.ts
```

## 可行方案比較

| 方案 | 是否可行 | 說明 |
|---|---:|---|
| 升級 Windows 10 到 22H2 build 19045，再用 Docker Desktop | 可行，最接近官方 README | 符合 Docker Desktop Windows 10 要求 |
| 使用目前 Windows 21H2，直接用 Node.js 跑 TREK | 已驗證可行 | 適合本機展示與開發，不需要 Docker |
| 用 WSL2 裝 Linux Docker Engine，不用 Docker Desktop | 理論可行，但目前未完成驗證 | 需要先裝 WSL distro，再在 Linux 裡裝 Docker Engine |
| 繼續使用 TREK Lite HTML 原型 | 可行 | 適合報告與自訂旅程展示，但不是官方完整 TREK |

## 建議

如果只是要展示、操作、研究 TREK 功能，先用 Node.js 方案即可。

如果之後要做正式部署、完整 Docker compose、反向代理、更新維護，建議先把 Windows 升到 22H2 build 19045 或改用 Windows 11，再使用 Docker Desktop。

