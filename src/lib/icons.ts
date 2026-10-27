// Line icons used on the About page (from the original site)
export const serviceIcons: Record<string, string> = {
  "studio": "<svg viewBox=\"0 0 24 24\"> <path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\" /> <circle cx=\"12\" cy=\"13\" r=\"4\" /> </svg>",
  "outdoor": "<svg viewBox=\"0 0 24 24\"> <rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\" /> <path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\" /> </svg>",
  "events": "<svg viewBox=\"0 0 24 24\"> <rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\" /> <line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\" /> <line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\" /> <line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\" /> </svg>",
  "business": "<svg viewBox=\"0 0 24 24\"> <rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\" /> <path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\" /> </svg>"
}

export const equipmentIcons: Record<string, string> = {
  "camera": "<svg viewBox=\"0 0 24 24\"> <path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\" /> <circle cx=\"12\" cy=\"13\" r=\"4\" /> </svg>",
  "lens": "<svg viewBox=\"0 0 24 24\"> <circle cx=\"12\" cy=\"12\" r=\"10\" /> <circle cx=\"12\" cy=\"12\" r=\"6\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" /> </svg>",
  "lighting": "<svg viewBox=\"0 0 24 24\"> <path d=\"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83\" /> </svg>",
  "backdrop": "<svg viewBox=\"0 0 24 24\"> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" /> <line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\" /> <line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\" /> </svg>",
  "drone": "<svg viewBox=\"0 0 24 24\"> <path d=\"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\" /> </svg>",
  "microphone": "<svg viewBox=\"0 0 24 24\"> <path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\" /> <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\" /> <line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\" /> <line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\" /> </svg>",
  "other": "<svg viewBox=\"0 0 24 24\"> <rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\" /> <path d=\"M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" /> <path d=\"M6 12h2M16 12h2\" /> </svg>"
}

/** Picks a service icon from the group's name, for example "Indoor Studio" -> studio */
export const serviceIcon = (name: string, index: number) => {
  const n = name.toLowerCase()
  const key = ['studio', 'outdoor', 'event', 'business'].find((k) => n.includes(k))
  const keys = Object.keys(serviceIcons)
  return serviceIcons[key === 'event' ? 'events' : key ?? keys[index % keys.length]]
}
