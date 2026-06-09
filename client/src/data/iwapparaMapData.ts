// Iwappara Map Topography Data

// The user uploaded an Iwappara map where the top left/center is the mountain peak, 
// and it slopes down to the bottom left/center base area.

export const TERRAIN_CONFIG = {
  width: 1000,
  height: 800,
  widthSegments: 50,
  heightSegments: 50,
}

/**
 * Procedurally generates an elevation (Z value) for a given X, Y coordinate.
 * Coordinates are local to the plane (e.g., -500 to 500 for X, -400 to 400 for Y).
 * We want the top (negative Y in ThreeJS local plane) to be high, and bottom (positive Y) to be low.
 */
export function estimateElevation(x: number, y: number): number {
  // Base slope: top of map (y = -400) is highest, bottom (y = 400) is lowest.
  const normalizedY = (y + 400) / 800 // 0 at top, 1 at bottom
  let elevation = (1 - normalizedY) * 200 // Max height 200, min 0

  // Add some ridge variation based on X (simulate mountain ridges)
  const ridge1 = Math.sin(x * 0.01) * 20
  const ridge2 = Math.cos((x + 200) * 0.005) * 30
  
  // Make the very top steeper
  if (normalizedY < 0.3) {
    elevation += (0.3 - normalizedY) * 100
  }

  return elevation + ridge1 + ridge2
}

export type TrailDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Trail {
  id: string
  name: string
  difficulty: TrailDifficulty
  color: string
  // Array of [x, y] coordinates in 2D map space. 
  // We will project these onto the 3D terrain later.
  // Origin (0,0) is center. Top-left is (-500, -400). Bottom-right is (500, 400).
  points2D: [number, number][]
}

export const SKI_TRAILS: Trail[] = [
  // --- Beginner (Green) ---
  {
    id: 'green-main',
    name: 'Main Burn (メインバーン)',
    difficulty: 'beginner',
    color: '#4ade80',
    points2D: [
      [-100, -100],
      [-120, 0],
      [-100, 100],
      [-50, 200]
    ]
  },
  {
    id: 'green-wide',
    name: 'Wide Burn (ワイドバーン)',
    difficulty: 'beginner',
    color: '#4ade80',
    points2D: [
      [20, -150],
      [80, 0],
      [100, 150],
      [50, 200]
    ]
  },
  {
    id: 'green-fine',
    name: 'Fine Snow Burn (ファインスノーバーン)',
    difficulty: 'beginner',
    color: '#4ade80',
    points2D: [
      [200, -250],
      [300, -150],
      [350, -100]
    ]
  },
  {
    id: 'green-bottom',
    name: 'Beginner & Panorama',
    difficulty: 'beginner',
    color: '#4ade80',
    points2D: [
      [50, 200],
      [-100, 250],
      [-300, 300]
    ]
  },

  // --- Intermediate (Red) ---
  {
    id: 'red-sky',
    name: 'Sky & Dynamic Course',
    difficulty: 'intermediate',
    color: '#f87171',
    points2D: [
      [-200, -350],
      [-250, -200],
      [-300, -100],
      [-250, 0]
    ]
  },
  {
    id: 'red-west',
    name: 'West Course (ウエストコース)',
    difficulty: 'intermediate',
    color: '#f87171',
    points2D: [
      [-300, -100],
      [-320, 50],
      [-350, 200]
    ]
  },
  {
    id: 'red-natural',
    name: 'Natural Course (ナチュラルコース)',
    difficulty: 'intermediate',
    color: '#f87171',
    points2D: [
      [0, -300],
      [100, -250],
      [200, -200]
    ]
  },
  {
    id: 'red-bottom',
    name: 'Front Course (フロントコース)',
    difficulty: 'intermediate',
    color: '#f87171',
    points2D: [
      [-100, 200],
      [-250, 280],
      [-400, 350]
    ]
  },

  // --- Advanced (Black) ---
  {
    id: 'black-giant',
    name: 'Giant Course (ジャイアントコース)',
    difficulty: 'advanced',
    color: '#1e293b',
    points2D: [
      [-100, -350],
      [-50, -250],
      [-20, -150]
    ]
  },
  {
    id: 'black-technical',
    name: 'Technical Course (テクニカルコース)',
    difficulty: 'advanced',
    color: '#1e293b',
    points2D: [
      [50, -300],
      [100, -150],
      [60, -50]
    ]
  }
]
