# TREK — 本機安裝說明

## 專案資訊
- **版本**: v3.0.22  
- **執行方式**: Node.js（從原始碼直接執行）
- **網址**: http://localhost:3000

## 系統需求
- Node.js v18+（目前使用 v24.15.0）
- npm v8+

## 目錄結構
```
trek/
├── client/          # React 前端 (Vite 建置)
│   └── dist/        # 建置輸出（已複製到 server/public）
├── server/          # Express + TypeScript 後端
│   ├── public/      # 靜態前端檔案
│   ├── src/         # 伺服器原始碼
│   └── data/        # 資料庫、日誌、上傳檔案（自動產生）
├── start.bat        # Windows 啟動腳本（雙擊執行）
├── start.ps1        # PowerShell 啟動腳本
└── .env             # 環境變數設定
```

## 啟動方式

### 方法一：雙擊 start.bat（最簡單）
```
直接雙擊 start.bat 即可
```

### 方法二：PowerShell
```powershell
.\start.ps1
```

### 方法三：手動執行
```powershell
cd server
$env:NODE_ENV="production"; $env:PORT="3000"; $env:TZ="Asia/Taipei"
node --import tsx src/index.ts
```

## 初始帳號
系統已改為「無密碼」的 Netflix 風格登入。
開啟網頁後，直接點選您的名字（例如 admin）或點選「Add Profile」新增使用者即可，不需要輸入密碼。

## 重新建置（如果更新原始碼後）
```powershell
# 1. 重新建置前端
cd client
npm ci
npm run build

# 2. 複製到 server
Copy-Item "dist\*" -Destination "..\server\public\" -Recurse -Force

# 3. 更新後端依賴（如有變更）
cd ..\server
npm ci
```

## 環境變數（.env）
| 變數 | 說明 | 預設值 |
|------|------|--------|
| `PORT` | 伺服器埠號 | 3000 |
| `TZ` | 時區 | Asia/Taipei |
| `LOG_LEVEL` | 日誌等級 (info/debug) | info |
| `ENCRYPTION_KEY` | 加密金鑰（建議設定） | 自動產生 |

## 注意事項
- Docker 方式需要 Windows 10 22H2 (Build 19045) 以上，目前系統為 21H2 (Build 19044)
- 資料存放於 `server/data/`，備份此目錄即可保留所有資料
- WebSocket 即時協作已啟用（/ws）
