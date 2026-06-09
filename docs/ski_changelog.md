# Ski Hub Changelog

## V50 - 旗艦級 Ski Hub 總控台 (Ultimate Dashboard Edition)
- Assembled V1 through V49 into a breathtaking, cohesive dashboard experience.
- Promoted the feature to a flagship status with V50 Ultimate Edition branding.

## V49 - 電影級運鏡重播 (Cinematic Camera Tools)
- Added controls to switch the 3D replay camera between Drone (Follow), FPS (First Person), and Free Cam modes.

## V48 - AR 擴增實境預覽 (AR Preview Mode)
- Built a placeholder UI button to view the customized 3D mountain on a physical tabletop via AR.

## V47 - 離線 3D 地圖快取 (Offline 3D Map Support)
- Created a download manager UI to cache the DEM and map tiles for offline mountain use.

## V46 - Neon 夜滑主題 (Cyberpunk Night Skiing Theme)
- Implemented a full CSS-driven Neon Night mode.
- Overrides global tokens dynamically to provide a neon fuchsia/purple aesthetic for the Ski Hub.

## V45 - 租賃裝備預約 (Rental Equipment)
- Built a mock interface for reserving rental snowboards and boots directly at the resort.

## V44 - 智能行李打包清單 (Packing List Generator)
- Added an interactive checklist customized for ski trips (Jacket, Goggles, Helmet).

## V43 - 雪場接駁車時刻表 (Shuttle Scheduler)
- Designed a UI to view and book shuttle buses from major stations to the ski resort.

## V42 - 裝備損耗追蹤 (Gear Condition Tracker)
- Added visual trackers for snowboard wax condition and edge sharpness.

## V41 - 數位裝備櫃 (Digital Gear Locker)
- Implemented an inventory UI to manage personal snowboards, bindings, and boots.

## V40 - 賽季挑戰 (Seasonal Challenges)
- Created progressive progress bars for seasonal goals like 'Ski 100km'.

## V39 - 3D 特技模擬 (3D Trick Simulator)
- Added a trick button during the 3D replay which triggers a toast notification giving the snowboarder style points.

## V38 - 數位雪票 (Virtual Ski Pass)
- Designed an Apple Wallet-style 3D tilting card for the user's Epic Pass.

## V37 - 徽章成就系統 (Achievements/Badges)
- Created a badge gallery for unlocking milestones like 'Early Bird' and 'Black Diamond'.

## V36 - 滑雪技能樹 (Ski Skill Trees)
- Implemented a skill progression UI (Carving, Freestyle) to gamify learning.

## V35 - 地形圖 AI 辨識 (AI Terrain Analysis)
- Created a mock feature that simulates AI scanning terrain maps to identify trees, cliffs, and groomers.

## V34 - 語音路線導航 (Voice-Assisted Route Planning)
- Introduced a voice-to-text placeholder for hands-free routing.

## V33 - 專屬雪場推薦 (Personalized Ski Recommendations)
- Built an AI recommendation module that suggests global hidden gem resorts based on user patterns.

## V32 - 纜車排隊熱區預測 (Smart Lift Wait Time Predictions)
- Simulated a predictive model overlay for estimating lift wait times during peak hours.

## V31 - 路線自動補全 (AI Auto-Complete Route)
- Implemented an AI Assistant side panel next to the map editor.
- Included an Auto-Complete mock tool to finish drawn routes based on geography.

## V30 - 全球排行榜 (Global Leaderboards)
- Implemented a leaderboard UI showing top speeds and longest distances.

## V29 - 滑雪群組 (Ski Clans)
- Added the ability to form Ski Clans, making it easier to share routes and trip itineraries.

## V28 - 好友即時追蹤 (Real-time Buddy Tracking)
- Built a mock tracking system to display where friends are on the mountain with active states.

## V27 - 雪道評分系統 (Route Rating System)
- Added community features like 5-star rating, liking, and commenting on shared routes.

## V26 - 全球雪道圖書館 (Global Route Library)
- Created a library UI to explore public routes created by other users worldwide.

## V25 - 3D 即時雪場氣候 (3D Weather Integration)
- Integrated CSS-based 3D weather particles overlay onto the Mapbox view.
- Provides dynamic falling snow animations for realism.

## V24 - 難度自動分級 (Difficulty Color Coding)
- Auto-color the drawn route based on vertical drop vs length steepness.
- Categorizes routes into Green (Beginner), Red (Intermediate), and Black (Expert).

## V23 - 滑行時間預測 (Speed & Time Estimation)
- Calculated estimated descent time based on slope and length.
- Provides users with an estimated duration in minutes for the route.

## V22 - 海拔剖面圖 (Elevation Profile Chart)
- Rendered an elevation profile chart for the route using vertical drops.
- Visualizes the steepness dynamically.

## V21 - 3D 纜車基礎設施 (3D Lifts)
- Rendered mocked ski lifts directly into the 3D Mapbox instance.
- Adds geographic structure to the 3D environment.

## V20 - 3D 行程分享 (Share 3D Replay)
- Added a share UI to generate a link for friends to watch the 3D snowboarder replay.
- Integrated into the SkiHubPage.

## V19 - 資料庫儲存 (Database Storage)
- Created the framework to persist customized drawn routes using coordinates mapped to Place properties.

## V18 - 3D 模擬滑行 (Ride Replay)
- Built a requestAnimationFrame loop to move the 3D model down the route.
- Set up dynamic camera follow (flyTo) to track the snowboarder's descent.

## V17 - 3D Snowboarder 模型 (3D Model Integration)
- Integrated Mapbox v3 `addModel` to inject a 3D GLTF model directly into the 3D space.
- Configured model-scale and model-rotation based on the route coordinates.

## V16 - 路線 3D 投影 (3D Route Projection)
- Hooked the custom GeoJSON into Mapbox `addLayer`.
- Rendered the hand-drawn line over the 3D Mapbox DEM surface.

## V15 - 3D 雪山地貌 (Mapbox 3D Terrain)
- Developed `Mapbox3DTerrain` component.
- Implemented `mapbox-terrain-dem-v1` for authentic 3D elevation.
- Configured a Sky layer for atmospheric depth.

## V14 - 幾何座標轉換 (Geometry Extraction)
- Normalized Leaflet `CRS.Simple` pixels into simulated geographic coordinates for the 3D map.

## V13 - 路線塗鴉板 (Route Drawer)
- Developed drawing tools inside `SkiResortMapEditor`.
- Supported clicking to draw Polylines, Undo, Clear, and Save actions.

## V12 - 官方地形圖載入 (Image Overlay)
- Created `SkiResortMapEditor` component.
- Enabled users to upload images and displayed them using Leaflet `ImageOverlay`.

## V11 - 獨立頁籤 (Ski Hub)
- Promoted Ski features from TripPlanner to a dedicated `SkiHubPage`.
- Added the "Ski Hub" link to Desktop `Navbar` and Mobile `BottomNav`.

*(Versions V1-V10 were part of previous iterations focusing on itineraries and sub-panels)*
