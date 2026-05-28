export interface FaqItem {
  question: string;
  answer: string;
}

export const homeFaqs: FaqItem[] = [
  {
    question: 'What is the difference between lux, lumens, and watts?',
    answer:
      'Lux measures how much light reaches a surface (illuminance). Lumens measure total light output from a source. Watts measure power consumption. For workspace planning, you typically start with a target lux level, convert to lumens using room area, then estimate LED wattage from lumens per watt.',
  },
  {
    question: 'How many lux do I need for office work?',
    answer:
      'Most general office tasks work well at 300–500 lux. Detailed work, design, or inspection tasks often benefit from 750–1000 lux. Meeting rooms and reception areas may use lower levels for comfort.',
  },
  {
    question: 'What color temperature is best for a workspace?',
    answer:
      'Neutral white around 4000K is a common choice for corporate offices. Home offices often feel more comfortable at 3000K–4000K. Design studios and video setups may prefer 4000K–5000K for color accuracy and alertness.',
  },
  {
    question: 'Are these calculators accurate enough for professional lighting design?',
    answer:
      'These tools provide simplified estimates for planning and budgeting. Final lighting design depends on fixture distribution, ceiling height, reflectance, glare control, and local standards. Consult a qualified lighting professional for critical projects.',
  },
  {
    question: 'How do I convert lux to lumens?',
    answer:
      'Multiply your target lux level by the area in square meters: lumens = lux × area (m²). For example, 500 lux over 20 m² requires about 10,000 lumens.',
  },
];

export const officeFaqs: FaqItem[] = [
  {
    question: 'How many lux do I need for an office?',
    answer:
      'General office work typically targets 300–500 lux. Detailed tasks may need 750 lux or more. Meeting rooms and reception areas often use 300–400 lux for a softer atmosphere.',
  },
  {
    question: 'Is 500 lux enough for office work?',
    answer:
      'Yes, 500 lux is a widely used standard for routine office tasks such as reading, writing, and computer work. It balances comfort, energy use, and productivity for most workspaces.',
  },
  {
    question: 'How many lumens do I need for a 20 m² office?',
    answer:
      'At 500 lux, a 20 m² office needs about 10,000 lumens (500 × 20). With 100 lm/W LED fixtures, that is roughly 100 watts of LED lighting before accounting for layout and losses.',
  },
  {
    question: 'How do I convert office lux to lumens?',
    answer:
      'Multiply lux by room area in square meters. Use our Lux to Lumens Calculator for quick conversions with different area units.',
  },
  {
    question: 'What color temperature is best for office lighting?',
    answer:
      '4000K neutral white is common in corporate offices. Open offices and coworking spaces often use 3500K–4000K. Design studios may prefer 4000K–5000K.',
  },
  {
    question: 'Is this calculator a replacement for professional lighting design?',
    answer:
      'No. This calculator gives a simplified estimate for planning. Professional design considers beam angles, mounting height, reflectance, uniformity, and local codes.',
  },
];

export const deskFaqs: FaqItem[] = [
  {
    question: 'How many lumens do I need for a desk lamp?',
    answer:
      'For a typical desk used for computer work, a dimmable lamp or monitor light bar in the 800–1200 lumen range is often practical. Higher tasks like drawing may need more.',
  },
  {
    question: 'What lux level is best for desk work?',
    answer:
      'Computer work usually targets 300–500 lux on the work surface. Reading and writing often aim for around 500 lux. Detailed design work may need 750 lux or more.',
  },
  {
    question: 'Should desk lighting match room lighting color temperature?',
    answer:
      'Ideally yes, or stay within one step (e.g., 3500K ambient with 4000K task light). Large mismatches can feel uncomfortable and affect how colors appear on screen and paper.',
  },
  {
    question: 'Is a monitor light bar enough for desk work?',
    answer:
      'For many computer-focused setups, a quality monitor light bar combined with moderate ambient room light works well. Add a desk lamp if you also read paper documents or sketch.',
  },
  {
    question: 'How do I reduce glare on my monitor?',
    answer:
      'Position task lights to the side rather than behind you, use diffused sources, and avoid shining light directly on the screen. Dimmable fixtures help balance screen brightness with desk illuminance.',
  },
];

export const luxToLumensFaqs: FaqItem[] = [
  {
    question: 'What is the formula to convert lux to lumens?',
    answer:
      'Lumens = lux × area (m²). If you know area in square feet, convert to m² first: area_m² = ft² × 0.092903.',
  },
  {
    question: 'How many lumens is 500 lux?',
    answer:
      'It depends on area. Over 10 m², 500 lux equals 5,000 lumens. Over 20 m², it equals 10,000 lumens. Area is required for the conversion.',
  },
  {
    question: 'Can I convert lumens to lux without area?',
    answer:
      'No. Lux is lumens per square meter. You need to know how spread out the light is over a surface, which requires area (or distance and geometry for point sources).',
  },
  {
    question: 'Why do lighting guides use lux instead of lumens?',
    answer:
      'Standards and comfort targets are usually defined as illuminance on a work surface (lux), not total fixture output. Lumens describe the source; lux describes what reaches the desk or floor.',
  },
  {
    question: 'Does room height affect lux to lumens conversion?',
    answer:
      'The basic formula assumes you need enough total output to achieve target lux on the work plane. Higher ceilings and poor distribution may require more lumens in practice than the simple calculation suggests.',
  },
];

export const lumensToWattsFaqs: FaqItem[] = [
  {
    question: 'How do I convert lumens to watts for LED?',
    answer:
      'Divide lumens by lumens per watt (lm/W): watts = lumens ÷ lm/W. Example: 10,000 lm at 100 lm/W ≈ 100 W.',
  },
  {
    question: 'What is a typical LED efficiency?',
    answer:
      'Consumer LED products often range from 80–150 lm/W. Quality office panels are commonly around 100–120 lm/W. Always check the product datasheet.',
  },
  {
    question: 'Can I use incandescent watt equivalents for LED planning?',
    answer:
      'Incandescent comparisons are misleading for office design. Plan using lumens and lux targets, then select LED fixtures by their actual lumen output and efficacy.',
  },
  {
    question: 'How many watts for 5000 lumens?',
    answer:
      'At 100 lm/W, about 50 W. At 120 lm/W, about 42 W. Efficiency varies by product.',
  },
  {
    question: 'Do drivers and dimming affect wattage?',
    answer:
      'Rated wattage usually refers to light engine consumption at full output. Drivers, controls, and dimmed levels change actual power draw. Use nameplate data for electrical loading.',
  },
];

export const colorTempFaqs: FaqItem[] = [
  {
    question: 'What is the best color temperature for office lighting?',
    answer:
      '4000K neutral white is the most common choice for corporate offices. It balances alertness and comfort for long work sessions.',
  },
  {
    question: 'Is 5000K too cool for an office?',
    answer:
      '5000K can work in design studios, labs, or areas needing high alertness and color accuracy. For general office work, it may feel clinical to some people. 4000K is a safer default.',
  },
  {
    question: '3000K vs 4000K for home office?',
    answer:
      '3000K feels warmer and relaxing—good for evening work or spaces shared with living areas. 4000K feels more focused and neutral—better for daytime productivity and video calls.',
  },
  {
    question: 'Should meeting rooms use warm or cool light?',
    answer:
      'Meeting rooms often use 3500K–4000K to feel welcoming yet clear. Very warm light (2700K–3000K) can feel cozy but may reduce perceived alertness in long meetings.',
  },
  {
    question: 'Does color temperature affect eye strain?',
    answer:
      'Glare, contrast, and illuminance levels usually matter more than color temperature alone. Very cool light (6500K) can feel harsh if brightness is too high. Consistent, moderate levels with good CRI help comfort.',
  },
];

export const lumensToLuxFaqs: FaqItem[] = [
  {
    question: 'What is the formula to convert lumens to lux?',
    answer:
      'Lux = lumens ÷ area (m²). If you know area in square feet, convert to m² first: area_m² = ft² × 0.092903.',
  },
  {
    question: 'How many lux is 10,000 lumens in a 20 m² office?',
    answer:
      '10,000 lumens over 20 m² equals 500 lux. This is a common target for general office work.',
  },
  {
    question: 'Why is actual lux lower than this calculator shows?',
    answer:
      'Real installations lose light to ceiling height, fixture beam angles, wall absorption, and dirt on lenses. This calculator assumes even distribution over the floor area — a simplified planning estimate.',
  },
  {
    question: 'Can I use this to check if my desk lamp is bright enough?',
    answer:
      'Yes, if you know the lamp lumen output and the desk area it covers. Enter lumens and desk surface area to see estimated lux. For task lighting, 300–500 lux on the work surface is typical.',
  },
  {
    question: 'What lux level is too low for office work?',
    answer:
      'Below 200 lux, most office tasks become uncomfortable without supplemental task lighting. General desk work usually targets 300–500 lux.',
  },
];

export const savingsFaqs: FaqItem[] = [
  {
    question: 'How much can I save by switching office lights to LED?',
    answer:
      'Savings depend on how many fixtures you replace, old vs new wattage, operating hours, and electricity rates. Offices running fluorescent troffers 10+ hours on weekdays often see 40–60% lighting energy reduction with comparable LED output.',
  },
  {
    question: 'What wattage did old fluorescent office lights use?',
    answer:
      'A typical 2×4 fluorescent troffer with T8 lamps might draw 64–80 watts total. Older T12 systems could use more. LED retrofit kits or panels for the same slot often use 30–45 watts while meeting or exceeding previous light levels.',
  },
  {
    question: 'Should I include maintenance savings in LED payback?',
    answer:
      'Yes for a full business case. LEDs last longer and reduce relamping labor, but this calculator focuses on energy and electricity cost only. Add maintenance separately when presenting to facilities managers.',
  },
  {
    question: 'How many hours per day should I use for office lighting?',
    answer:
      'Many offices use 10–12 hours on weekdays if cleaning and early staff are included. For conservative estimates, use actual metered or scheduled hours rather than assuming 24/7 operation.',
  },
  {
    question: 'Does this calculator include demand charges or rebates?',
    answer:
      'No. It estimates kWh and simple cost from wattage, hours, and $/kWh. Utility demand charges, tax, and rebate programs vary by region and are not modeled here.',
  },
];
