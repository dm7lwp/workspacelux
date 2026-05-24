export interface WorkspaceType {
  id: string;
  label: string;
  defaultLux: number;
  colorTemp: string;
  cri: string;
}

export const workspaceTypes: WorkspaceType[] = [
  {
    id: 'general-office',
    label: 'General Office',
    defaultLux: 500,
    colorTemp: '4000K',
    cri: '80+',
  },
  {
    id: 'open-office',
    label: 'Open Office',
    defaultLux: 500,
    colorTemp: '4000K',
    cri: '80+',
  },
  {
    id: 'meeting-room',
    label: 'Meeting Room',
    defaultLux: 300,
    colorTemp: '3500K–4000K',
    cri: '80+',
  },
  {
    id: 'home-office',
    label: 'Home Office',
    defaultLux: 500,
    colorTemp: '3000K–4000K',
    cri: '80+',
  },
  {
    id: 'reception',
    label: 'Reception Area',
    defaultLux: 300,
    colorTemp: '3000K–3500K',
    cri: '80+',
  },
  {
    id: 'conference-room',
    label: 'Conference Room',
    defaultLux: 500,
    colorTemp: '4000K',
    cri: '80+',
  },
  {
    id: 'design-studio',
    label: 'Design Studio',
    defaultLux: 750,
    colorTemp: '4000K–5000K',
    cri: '90+',
  },
  {
    id: 'coworking',
    label: 'Coworking Space',
    defaultLux: 500,
    colorTemp: '3500K–4000K',
    cri: '80+',
  },
];

export const luxPresets = [
  { value: 300, label: '300 lux — Basic office lighting' },
  { value: 500, label: '500 lux — Standard office work' },
  { value: 750, label: '750 lux — Detailed office tasks' },
  { value: 1000, label: '1000 lux — Design, inspection, or precision work' },
];

export const ledEfficiencyPresets = [
  { value: 80, label: '80 lm/W — Basic LED' },
  { value: 100, label: '100 lm/W — Standard LED' },
  { value: 120, label: '120 lm/W — Efficient LED' },
  { value: 150, label: '150 lm/W — High efficiency LED' },
];

export interface TaskType {
  id: string;
  label: string;
  luxMin: number;
  luxMax: number;
  colorTemp: string;
  lampType: string;
}

export const taskTypes: TaskType[] = [
  {
    id: 'computer',
    label: 'Computer Work',
    luxMin: 300,
    luxMax: 500,
    colorTemp: '4000K',
    lampType: 'Monitor light bar or adjustable desk lamp',
  },
  {
    id: 'reading',
    label: 'Reading',
    luxMin: 500,
    luxMax: 500,
    colorTemp: '3500K–4000K',
    lampType: 'Dimmable LED desk lamp',
  },
  {
    id: 'writing',
    label: 'Writing',
    luxMin: 500,
    luxMax: 500,
    colorTemp: '4000K',
    lampType: 'Adjustable task lamp with diffuser',
  },
  {
    id: 'drawing',
    label: 'Drawing / Design',
    luxMin: 750,
    luxMax: 750,
    colorTemp: '4000K–5000K',
    lampType: 'High-CRI adjustable lamp',
  },
  {
    id: 'crafting',
    label: 'Crafting',
    luxMin: 750,
    luxMax: 1000,
    colorTemp: '4000K–5000K',
    lampType: 'Bright task lamp with wide beam',
  },
  {
    id: 'video',
    label: 'Video Calls',
    luxMin: 300,
    luxMax: 500,
    colorTemp: '4000K–5000K',
    lampType: 'Soft key light or monitor bar',
  },
  {
    id: 'gaming',
    label: 'Gaming Setup',
    luxMin: 200,
    luxMax: 400,
    colorTemp: '4000K',
    lampType: 'Bias lighting or dim desk lamp',
  },
];

export interface ColorTempSpace {
  id: string;
  label: string;
  range: string;
  why: string;
  avoid: string;
  useCase: string;
}

export const colorTempSpaces: ColorTempSpace[] = [
  {
    id: 'home-office',
    label: 'Home Office',
    range: '3000K–4000K',
    why: 'Warm-to-neutral white feels comfortable for long hours and blends well with residential spaces.',
    avoid: 'Very cool 6500K can feel harsh in living areas; extremely warm 2700K may reduce focus during daytime work.',
    useCase: 'Remote work, study, creative writing',
  },
  {
    id: 'corporate-office',
    label: 'Corporate Office',
    range: '4000K',
    why: 'Neutral white supports alertness and color rendering without the clinical feel of very cool light.',
    avoid: 'Overly warm light that makes offices feel dim or sleepy; inconsistent temperatures across zones.',
    useCase: 'Open plan desks, daily office tasks',
  },
  {
    id: 'meeting-room',
    label: 'Meeting Room',
    range: '3500K–4000K',
    why: 'Slightly warm-neutral light helps people look natural on camera and in person while staying alert.',
    avoid: 'Strong cool casts that wash out skin tones; glare on glossy tables.',
    useCase: 'Presentations, hybrid meetings',
  },
  {
    id: 'reception',
    label: 'Reception Area',
    range: '3000K–3500K',
    why: 'Welcoming warm-neutral light creates a friendly first impression for visitors.',
    avoid: 'Dim, yellow-heavy light that feels outdated; high glare on signage.',
    useCase: 'Lobbies, front desks, waiting areas',
  },
  {
    id: 'design-studio',
    label: 'Design Studio',
    range: '4000K–5000K',
    why: 'Cooler neutral light improves color discrimination for design, print, and material review.',
    avoid: 'Low CRI sources that distort colors; mixed temperatures causing metamerism issues.',
    useCase: 'Graphic design, product review, color-critical work',
  },
  {
    id: 'video-call',
    label: 'Video Call Setup',
    range: '4000K–5000K',
    why: 'Neutral-to-cool light balances skin tones on camera and reduces yellow cast in video feeds.',
    avoid: 'Single harsh overhead downlight creating shadows under eyes; backlit windows without fill light.',
    useCase: 'Remote meetings, streaming, webinars',
  },
  {
    id: 'coworking',
    label: 'Coworking Space',
    range: '3500K–4000K',
    why: 'Flexible neutral light suits diverse members and activities from focus work to casual collaboration.',
    avoid: 'Flickering or cheap LEDs; strong zone mismatches between hot desks and lounge areas.',
    useCase: 'Shared desks, hot desks, flexible workspaces',
  },
];

export const recommendedLuxLevels = [
  { space: 'General office / open plan', lux: '300–500', notes: 'Routine computer and paperwork' },
  { space: 'Meeting room', lux: '300–500', notes: 'Presentations and discussion' },
  { space: 'Reception / lobby', lux: '200–300', notes: 'Welcoming, lower task demand' },
  { space: 'Design / inspection', lux: '750–1000', notes: 'Detail, color, precision work' },
  { space: 'Home office desk', lux: '300–500', notes: 'Focus and video calls' },
  { space: 'Warehouse / storage', lux: '100–200', notes: 'Not primary focus of this site' },
];

export const colorTempScale = [
  { kelvin: '2700K', label: 'Warm, relaxing', feel: 'Residential, hospitality' },
  { kelvin: '3000K', label: 'Warm white', feel: 'Home office evenings, reception' },
  { kelvin: '4000K', label: 'Neutral white', feel: 'Corporate office standard' },
  { kelvin: '5000K', label: 'Cool white / daylight-like', feel: 'Design, labs, video' },
  { kelvin: '6500K', label: 'Very cool', feel: 'High alertness; can feel harsh' },
];
