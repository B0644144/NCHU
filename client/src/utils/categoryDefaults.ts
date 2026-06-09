export const CATEGORY_DURATION_MAP: Record<string, number> = {
  // Accommodations
  BedDouble: 0, Home: 0, Tent: 0,
  
  // Food & Drink
  UtensilsCrossed: 90, Utensils: 90, Coffee: 45, Beer: 90, Wine: 90,
  
  // Attractions & Activities
  Landmark: 120, Library: 150, Church: 45, Activity: 120, Mountain: 180,
  TreePine: 90, Waves: 120, Flower2: 90, Camera: 60, Theater: 150, Ticket: 180,
  
  // Shopping
  ShoppingBag: 90, Store: 60,
  
  // Transport hubs (Wait time)
  Plane: 150, Train: 30, Bus: 15, Ship: 60,
  
  // Default fallback
  _default: 60,
}

export function getDefaultDurationForCategoryIcon(iconName: string | null | undefined): number {
  if (!iconName) return CATEGORY_DURATION_MAP._default;
  return CATEGORY_DURATION_MAP[iconName] ?? CATEGORY_DURATION_MAP._default;
}
