// Stałe
export const SPACING = 1.5
export const BUILDING_HEIGHT_SCALE = 30
export const BUILDING_WIDTH_SCALE = 10
export const PLATFORM_HEIGHT = 1
export const AREA_BUFFER = 1.4
export const CAMERA_DAMPING = 0.05
export const CENTER_TRANSITION_SPEED = 0.05
export const AUTO_ROTATE_DELAY = 3000
export const AUTO_ROTATE_SPEED = 0.0015
export const BUILDING_ZOOM = 90
export const PLATFORM_ZOOM_MULT = 6

export const COLORS = {
  building: 0xf0f0f0,
  platform: 0xf0f0f0,
  emissiveColor: 0x666666, // Kolor emissive wspólny dla budynków i platform
  hover: 0x0643ff,
  selected: 0xd68100,
  edge: 0x000000,
} as const