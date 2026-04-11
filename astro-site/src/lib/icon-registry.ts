export const iconNames = [
  'bot',
  'calendar',
  'certificate',
  'chart',
  'chat',
  'check-circle',
  'cloud',
  'flash',
  'handshake',
  'lock',
  'mail',
  'shield',
  'sync',
] as const;

export type IconName = (typeof iconNames)[number];

type IconDefinition = {
  viewBox: string;
  body: string;
};

export const iconRegistry: Record<IconName, IconDefinition> = {
  bot: {
    viewBox: '0 0 24 24',
    body: `<rect x="5" y="7" width="14" height="10" rx="4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></rect>
<path d="M12 4v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
<path d="M8 17v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
<path d="M16 17v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
<path d="M5 11H3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
<path d="M21 11h-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
<circle cx="9.5" cy="12" r="1" fill="currentColor"></circle>
<circle cx="14.5" cy="12" r="1" fill="currentColor"></circle>`,
  },
  certificate: {
    viewBox: '0 0 24 24',
    body: `<circle cx="12" cy="10" r="5" stroke="currentColor" stroke-width="1.8"></circle>
<path d="m10.2 15.4-1.1 4 2.9-1.6 2.9 1.6-1.1-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="m10.2 10.1 1.2 1.2 2.4-2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  'check-circle': {
    viewBox: '0 0 24 24',
    body: `<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"></circle>
<path d="m8.7 12.2 2.2 2.2 4.4-4.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  cloud: {
    viewBox: '0 0 24 24',
    body: `<path d="M8 18h8.2a3.8 3.8 0 0 0 .5-7.56A5.6 5.6 0 0 0 6.2 9.3 3.6 3.6 0 0 0 8 18Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  flash: {
    viewBox: '0 0 24 24',
    body: `<path d="M13.2 3 7.8 12h3.9L10.8 21l5.4-9h-3.9L13.2 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  calendar: {
    viewBox: '0 0 24 24',
    body: `<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"></rect><path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
  },
  chart: {
    viewBox: '0 0 24 24',
    body: `<path d="M4 20V14M9 20V4M14 20V10M19 20V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M2 20h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
  },
  chat: {
    viewBox: '0 0 24 24',
    body: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  handshake: {
    viewBox: '0 0 24 24',
    body: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
  },
  lock: {
    viewBox: '0 0 24 24',
    body: `<rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><circle cx="12" cy="16" r="1.5" fill="currentColor"></circle>`,
  },
  mail: {
    viewBox: '0 0 24 24',
    body: `<rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"></rect><path d="m2 8 10 7 10-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  shield: {
    viewBox: '0 0 24 24',
    body: `<path d="M12 2.5 4 6v5.5c0 4.8 3.4 9.3 8 10.5 4.6-1.2 8-5.7 8-10.5V6L12 2.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  sync: {
    viewBox: '0 0 24 24',
    body: `<path d="M17.7 7.1A8 8 0 1 0 19.9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="m15.5 4 3 3.1 3.1-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
};
