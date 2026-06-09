// Predefined ski equipment packing lists by trip type
export interface PackingItem {
  id: string
  category: string
  name: string
  essential: boolean
  checked?: boolean
}

export const SKI_PACKING_LIST: PackingItem[] = [
  // 服裝
  { id: 'ski-jacket', category: '服裝', name: '滑雪外套', essential: true },
  { id: 'ski-pants', category: '服裝', name: '滑雪褲', essential: true },
  { id: 'base-layer-top', category: '服裝', name: '排汗內層上衣', essential: true },
  { id: 'base-layer-bottom', category: '服裝', name: '排汗內層下身', essential: true },
  { id: 'mid-layer', category: '服裝', name: '保暖中層（刷毛衣）', essential: true },
  { id: 'ski-socks', category: '服裝', name: '滑雪專用羊毛襪 x3雙', essential: true },
  { id: 'wool-hat', category: '服裝', name: '毛帽/安全帽內頭套', essential: false },
  { id: 'neck-gaiter', category: '服裝', name: '頸巾/雪套', essential: false },
  { id: 'gloves', category: '服裝', name: '防水手套', essential: true },
  { id: 'hand-warmers', category: '服裝', name: '暖暖包', essential: false },

  // 裝備
  { id: 'helmet', category: '裝備', name: '安全帽', essential: true },
  { id: 'goggles', category: '裝備', name: '護目鏡', essential: true },
  { id: 'ski-boots', category: '裝備', name: '雪鞋（已租/自備）', essential: true },
  { id: 'skis', category: '裝備', name: '雪板/滑雪板（已租/自備）', essential: true },
  { id: 'poles', category: '裝備', name: '雪杖（可選）', essential: false },
  { id: 'boot-bag', category: '裝備', name: '雪鞋袋', essential: false },

  // 保養與安全
  { id: 'sunscreen', category: '保養', name: '防曬乳 SPF50+', essential: true },
  { id: 'lip-balm', category: '保養', name: '防曬護唇膏', essential: true },
  { id: 'moisturizer', category: '保養', name: '保濕乳液', essential: false },
  { id: 'eye-drops', category: '保養', name: '眼藥水', essential: false },
  { id: 'first-aid', category: '安全', name: '基本急救包', essential: false },
  { id: 'hot-pack', category: '安全', name: '暖暖包（備用）', essential: false },

  // 必備文件
  { id: 'passport', category: '文件', name: '護照/身分證', essential: true },
  { id: 'insurance', category: '文件', name: '旅遊保險文件', essential: true },
  { id: 'lift-pass', category: '文件', name: '纜車票（已購/預訂確認）', essential: true },
  { id: 'hotel-voucher', category: '文件', name: '住宿預訂單', essential: true },
]

export function generatePackingList(
  difficultyLevels: string[],
  durationDays: number
): PackingItem[] {
  const list = SKI_PACKING_LIST.map(item => ({ ...item, checked: false }))

  // Add extra socks based on duration
  const sockItem = list.find(i => i.id === 'ski-socks')
  if (sockItem && durationDays > 3) {
    sockItem.name = `滑雪專用羊毛襪 x${durationDays + 1}雙`
  }

  // Add avalanche safety gear for advanced
  if (difficultyLevels.includes('advanced')) {
    list.push({ id: 'avalanche-beacon', category: '安全', name: '雪崩信標（進階必備）', essential: true, checked: false })
    list.push({ id: 'probe', category: '安全', name: '探雪棒', essential: true, checked: false })
    list.push({ id: 'shovel', category: '安全', name: '雪崩鏟', essential: true, checked: false })
  }

  return list
}
