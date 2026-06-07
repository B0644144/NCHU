# 岩原、神立、神樂滑雪 - 進階

這個專案是以 TREK 旅行規劃系統整理出的 2026 日本滑雪行程，內容已依 Notion 資料補齊並匯入本機 server 資料庫。

## 行程概要

- 目的地：日本東京、越後湯澤、岩原、神立、神樂
- 行程日期：2026-02-26 至 2026-03-04
- 行程主題：滑雪進階行程、東京景點、住宿、交通、費用與旅行物品檢查
- 主要資料來源：Notion 行程表、旅行物品檢查清單、費用記錄清單

## 已整理內容

- 行程表：依日期建立每日行程、時間、備註與交通段落
- 地圖點：景點、雪場、住宿、餐廳已建立 Google Map / 地圖座標資料
- 交通資訊：機場、電車、巴士與移動段落已整理為行程與預訂資訊
- 住宿資訊：越後湯澤住宿與東京住宿已放入行程資料
- 滑雪資訊：岩原、神立、神樂相關雪場與活動已標記
- 旅行物品檢查：依 Notion 清單建立分類與完成狀態
- 費用記錄：依 Notion 費用清單建立預算項目與分類

## 地圖點處理原則

行程中像「桃園 >> 成田」這類內容屬於交通移動，不會建立成景點 marker。

已建立地圖點的項目包含：

- 景點
- 雪場
- 住宿
- 餐廳
- 主要購物或活動地點

## 專案結構

```text
client/        前端 React / Vite 專案
server/        後端 API、SQLite 資料庫與服務邏輯
docs/          TREK 原始文件與圖片資源
scripts/       維護與資料處理腳本
```

## 本機資料注意事項

這個 GitHub repository 保存的是專案程式碼。

實際行程資料目前位於本機 SQLite 資料庫：

```text
server/data/travel.db
```

基於隱私與安全考量，以下內容不會直接提交到 GitHub：

- `server/data/*`
- `*.db`
- `.env`
- 上傳檔案
- 備份資料
- `node_modules`
- build outputs

如果需要把行程資料一起保存到 GitHub，建議另外建立乾淨的 seed 或 export 檔案，而不是直接提交 raw database。

## 開發與啟動

安裝依賴：

```bash
npm install
```

啟動開發環境：

```bash
npm run dev
```

啟動後即可在 TREK 介面中查看這次的滑雪行程、地圖點、費用與旅行物品清單。

## 來源

本專案基於開源旅行規劃工具 TREK 調整與匯入資料：

- 原始專案：[mauriceboe/TREK](https://github.com/mauriceboe/TREK)
- 目前 repository：[B0644144/NCHU](https://github.com/B0644144/NCHU)
