export const SITE = {
  name: 'Workspace Lux',
  url: 'https://workspacelux.com',
  description:
    'Practical lighting calculators and guides for offices, desks, studios, and modern workspaces.',
  email: 'hello@workspacelux.com',
} as const;

export interface Tool {
  title: string;
  href: string;
  description: string;
  category: 'tool' | 'guide' | 'blog';
}

export const tools: Tool[] = [
  {
    title: 'Office Lighting Calculator',
    href: '/office-lighting-calculator',
    description:
      'Estimate the required lumens and LED wattage for offices, meeting rooms, and open workspaces.',
    category: 'tool',
  },
  {
    title: 'Desk Lighting Calculator',
    href: '/desk-lighting-calculator',
    description:
      'Find the right brightness and color temperature for your desk, home office, or workstation.',
    category: 'tool',
  },
  {
    title: 'Lux to Lumens Calculator',
    href: '/lux-to-lumens-calculator',
    description: 'Convert lux levels into total lumens based on room size.',
    category: 'tool',
  },
  {
    title: 'Lumens to Watts Calculator',
    href: '/lumens-to-watts-calculator',
    description: 'Estimate LED wattage from lumens and lighting efficiency.',
    category: 'tool',
  },
  {
    title: 'Color Temperature Guide',
    href: '/color-temperature-guide',
    description:
      'Choose between warm, neutral, and cool white light for different workspace tasks.',
    category: 'guide',
  },
  {
    title: 'LED Lighting Savings Calculator',
    href: '/lighting-savings-calculator',
    description:
      'Estimate annual energy and cost savings when upgrading office fluorescent or halogen lighting to LED.',
    category: 'tool',
  },
  {
    title: 'Office Lighting Standards',
    href: '/office-lighting-standards',
    description:
      'Recommended lux levels, CRI, and color temperature for offices, meeting rooms, and workspaces.',
    category: 'guide',
  },
  {
    title: 'How Many Lumens for an Office?',
    href: '/blog/how-many-lumens-for-office',
    description:
      'A practical guide to estimating total lumens for office spaces of different sizes.',
    category: 'blog',
  },
  {
    title: '300 Lux vs 500 Lux for Office Work',
    href: '/blog/300-lux-vs-500-lux-office',
    description:
      'Compare 300 lux and 500 lux office lighting — comfort, productivity, and when each level fits.',
    category: 'blog',
  },
];

export const guides = tools.filter((t) => t.category === 'guide' || t.category === 'blog');
export const calculators = tools.filter((t) => t.category === 'tool');

export function getRelatedTools(currentHref: string, limit = 4): Tool[] {
  return tools.filter((t) => t.href !== currentHref).slice(0, limit);
}
