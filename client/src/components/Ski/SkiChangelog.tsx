import React, { useState } from 'react'
import { CheckCircle2, History } from 'lucide-react'

const CHANGELOG = [
  { version: 'V50', title: '旗艦級 Ski Hub 總控台', desc: 'Assembled V1 through V49 into a breathtaking, cohesive dashboard experience.' },
  { version: 'V49', title: '電影級運鏡重播', desc: 'Added controls to switch the 3D replay camera between Drone (Follow), FPS (First Person), and Free Cam modes.' },
  { version: 'V48', title: 'AR 擴增實境預覽', desc: 'Built a placeholder UI button to view the customized 3D mountain on a physical tabletop via AR.' },
  { version: 'V47', title: '離線 3D 地圖快取', desc: 'Created a download manager UI to cache the DEM and map tiles for offline mountain use.' },
  { version: 'V46', title: 'Neon 夜滑主題', desc: 'Implemented a full CSS-driven Neon Night mode with dynamic global token overrides.' },
  { version: 'V45', title: '租賃裝備預約', desc: 'Built a mock interface for reserving rental snowboards and boots directly at the resort.' },
  { version: 'V44', title: '智能行李打包清單', desc: 'Added an interactive checklist customized for ski trips.' },
  { version: 'V43', title: '雪場接駁車時刻表', desc: 'Designed a UI to view and book shuttle buses from major stations to the ski resort.' },
  { version: 'V42', title: '裝備損耗追蹤', desc: 'Added visual trackers for snowboard wax condition and edge sharpness.' },
  { version: 'V41', title: '數位裝備櫃', desc: 'Implemented an inventory UI to manage personal snowboards, bindings, and boots.' },
  { version: 'V40', title: '賽季挑戰', desc: 'Created progressive progress bars for seasonal goals like Ski 100km.' },
  { version: 'V39', title: '3D 特技模擬', desc: 'Added a trick button during the 3D replay which triggers a toast notification giving the snowboarder style points.' },
  { version: 'V38', title: '數位雪票', desc: 'Designed an Apple Wallet-style 3D tilting card for the user Epic Pass.' },
  { version: 'V37', title: '徽章成就系統', desc: 'Created a badge gallery for unlocking milestones like Early Bird and Black Diamond.' },
  { version: 'V36', title: '滑雪技能樹', desc: 'Implemented a skill progression UI (Carving, Freestyle) to gamify learning.' },
  { version: 'V35', title: '地形圖 AI 辨識', desc: 'Created a mock feature that simulates AI scanning terrain maps to identify trees, cliffs, and groomers.' },
  { version: 'V34', title: '語音路線導航', desc: 'Introduced a voice-to-text placeholder for hands-free routing.' },
  { version: 'V33', title: '專屬雪場推薦', desc: 'Built an AI recommendation module that suggests global hidden gem resorts based on user patterns.' },
  { version: 'V32', title: '纜車排隊熱區預測', desc: 'Simulated a predictive model overlay for estimating lift wait times during peak hours.' },
  { version: 'V31', title: '路線自動補全', desc: 'Implemented an AI Assistant side panel with an Auto-Complete mock tool to finish drawn routes.' },
  { version: 'V30', title: '全球排行榜', desc: 'Implemented a leaderboard UI showing top speeds and longest distances.' },
  { version: 'V29', title: '滑雪群組', desc: 'Added the ability to form Ski Clans, making it easier to share routes and trip itineraries.' },
  { version: 'V28', title: '好友即時追蹤', desc: 'Built a mock tracking system to display where friends are on the mountain with active states.' },
  { version: 'V27', title: '雪道評分系統', desc: 'Added community features like 5-star rating, liking, and commenting on shared routes.' },
  { version: 'V26', title: '全球雪道圖書館', desc: 'Created a library UI to explore public routes created by other users worldwide.' },
  { version: 'V25', title: '3D 即時雪場氣候', desc: 'Integrated 3D weather particles overlay onto the Mapbox view.' },
  { version: 'V24', title: '難度自動分級', desc: 'Auto-color the drawn route based on vertical drop vs length steepness.' },
  { version: 'V23', title: '滑行時間預測', desc: 'Calculated estimated descent time based on slope and length.' },
  { version: 'V22', title: '海拔剖面圖', desc: 'Rendered an elevation profile chart for the route using vertical drops.' },
  { version: 'V21', title: '3D 纜車基礎設施', desc: 'Rendered mocked ski lifts directly into the 3D Mapbox instance.' },
  { version: 'V20', title: '3D 行程分享', desc: 'Added a share UI to generate a link for friends to watch the 3D snowboarder replay.' },
  { version: 'V19', title: '資料庫儲存', desc: 'Created the framework to persist customized drawn routes using coordinates mapped to Place properties.' },
  { version: 'V18', title: '3D 模擬滑行', desc: 'Built a requestAnimationFrame loop to move the 3D model down the route with dynamic camera follow.' },
  { version: 'V17', title: '3D Snowboarder 模型', desc: 'Integrated Mapbox v3 addModel to inject a 3D GLTF model directly into the 3D space.' },
  { version: 'V16', title: '路線 3D 投影', desc: 'Hooked the custom GeoJSON into Mapbox addLayer to render the hand-drawn line over the 3D DEM surface.' },
  { version: 'V15', title: '3D 雪山地貌', desc: 'Implemented mapbox-terrain-dem-v1 for authentic 3D elevation and Sky layer.' },
  { version: 'V14', title: '幾何座標轉換', desc: 'Normalized Leaflet CRS.Simple pixels into simulated geographic coordinates.' },
  { version: 'V13', title: '路線塗鴉板', desc: 'Developed drawing tools inside SkiResortMapEditor for drawing Polylines.' },
  { version: 'V12', title: '官方地形圖載入', desc: 'Enabled users to upload images and displayed them using Leaflet ImageOverlay.' },
  { version: 'V11', title: '獨立頁籤', desc: 'Promoted Ski features from TripPlanner to a dedicated SkiHubPage.' }
]

export default function SkiChangelog() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl z-50 transition-transform hover:scale-110 flex items-center gap-2"
      >
        <History size={20} />
        <span className="font-semibold text-sm">更新日誌 (V50)</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xl rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-secondary)]">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <History size={20} className="text-blue-500" />
            Ski Hub 開發日誌
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-[var(--text-faint)] hover:text-[var(--text-primary)]">
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-4">
          {CHANGELOG.map((item, idx) => (
            <div key={item.version} className="relative pl-6 pb-4 border-l-2 border-blue-500/20 last:border-0 last:pb-0">
              <span className="absolute -left-[9px] top-0 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                <CheckCircle2 size={10} />
              </span>
              <div className="font-bold text-[var(--text-primary)] mb-1 flex items-baseline gap-2">
                <span className="text-blue-500 text-sm">{item.version}</span>
                {item.title}
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
          <div className="relative pl-6 border-l-2 border-transparent">
            <span className="absolute -left-[9px] top-0 bg-gray-300 w-4 h-4 rounded-full border-2 border-white"></span>
            <div className="text-xs text-[var(--text-faint)] mt-1">
              V1 - V10 位於舊版行程規劃面板中
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
