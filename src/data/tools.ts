export const SITE = {
  name: 'WorkspaceLux',
  url: 'https://workspacelux.com',
  description:
    'Office lighting calculators and workspace lighting guides — plan lux, lumens, wattage, color temperature, and LED energy savings.',
  email: 'hello@workspacelux.com',
} as const;

export interface Tool {
  title: string;
  href: string;
  description: string;
  category: 'calculator' | 'guide';
  featured?: boolean;
  guideCategory?: string;
}

export const tools: Tool[] = [
  {
    title: 'Office Lighting Calculator',
    href: '/office-lighting-calculator',
    description:
      'Estimate lumens, LED wattage, and fixture count for offices, meeting rooms, and open workspaces.',
    category: 'calculator',
    featured: true,
  },
  {
    title: 'Desk Lighting Calculator',
    href: '/desk-lighting-calculator',
    description:
      'Find the right brightness and color temperature for your desk, home office, or workstation.',
    category: 'calculator',
    featured: true,
  },
  {
    title: 'Lux to Lumens Calculator',
    href: '/lux-to-lumens-calculator',
    description: 'Convert target lux and floor area into total lumens for any workspace.',
    category: 'calculator',
    featured: true,
  },
  {
    title: 'Lumens to Lux Calculator',
    href: '/lumens-to-lux-calculator',
    description: 'Convert total lumens and area into expected lux — check if existing lighting is bright enough.',
    category: 'calculator',
    featured: true,
  },
  {
    title: 'Lumens to Watts Calculator',
    href: '/lumens-to-watts-calculator',
    description: 'Estimate LED wattage from lumens and lighting efficiency.',
    category: 'calculator',
  },
  {
    title: 'LED Savings Calculator',
    href: '/led-savings-calculator',
    description:
      'Estimate annual energy and cost savings when upgrading office lighting to LED.',
    category: 'calculator',
    featured: true,
  },
  {
    title: 'Color Temperature Guide',
    href: '/office-lighting-color-temperature',
    description:
      'Choose between warm, neutral, and cool white light for different workspace tasks.',
    category: 'guide',
    featured: true,
    guideCategory: 'Color Temperature',
  },
  {
    title: 'Office Lighting Standards',
    href: '/office-lighting-standards',
    description:
      'Recommended lux levels, CRI, and color temperature for offices, meeting rooms, and workspaces.',
    category: 'guide',
    guideCategory: 'Office Lighting Basics',
  },
  {
    title: 'How Many Lumens Do You Need for an Office?',
    href: '/guides/how-many-lumens-for-office',
    description:
      'A practical guide to estimating total lumens for office spaces of different sizes.',
    category: 'guide',
    guideCategory: 'Office Lighting Basics',
  },
  {
    title: '300 Lux vs 500 Lux for Office Work',
    href: '/guides/300-lux-vs-500-lux-office',
    description:
      'Compare 300 lux and 500 lux office lighting — comfort, productivity, and when each level fits.',
    category: 'guide',
    guideCategory: 'Lighting Design',
  },
];

export interface ScenarioGuide {
  title: string;
  href: string;
  description: string;
}

export const scenarioGuides: ScenarioGuide[] = [
  {
    title: 'Home Office Lighting',
    href: '/desk-lighting-calculator',
    description: 'Plan desk brightness and color temperature for remote work.',
  },
  {
    title: 'Open Office Lighting',
    href: '/office-lighting-calculator',
    description: 'Estimate lumens and fixtures for open-plan workspaces.',
  },
  {
    title: 'Meeting Room Lighting',
    href: '/office-lighting-calculator',
    description: 'Target lux and color temperature for presentations and discussion.',
  },
  {
    title: 'Desk Lighting',
    href: '/desk-lighting-calculator',
    description: 'Task lighting for reading, writing, and computer work.',
  },
  {
    title: 'Small Office Lighting',
    href: '/guides/how-many-lumens-for-office',
    description: 'Lumen estimates for private offices and small teams.',
  },
  {
    title: 'Coworking Space Lighting',
    href: '/office-lighting-standards',
    description: 'Lux levels and standards for shared workspace zones.',
  },
];

export const calculators = tools.filter((t) => t.category === 'calculator');
export const guides = tools.filter((t) => t.category === 'guide');
export const featuredCalculators = calculators.filter((t) => t.featured);
export const featuredGuides = guides.slice(0, 6);

export const guideCategories = [
  'Office Lighting Basics',
  'Home Office Lighting',
  'Desk Lighting',
  'Lighting Design',
  'LED Energy Savings',
  'Color Temperature',
] as const;

export function getRelatedTools(currentHref: string, limit = 4): Tool[] {
  const current = tools.find((t) => t.href === currentHref);
  const sameCategory = tools.filter(
    (t) => t.href !== currentHref && t.category === (current?.category ?? 'calculator'),
  );
  const otherCategory = tools.filter(
    (t) => t.href !== currentHref && t.category !== (current?.category ?? 'calculator'),
  );
  return [...sameCategory, ...otherCategory].slice(0, limit);
}
