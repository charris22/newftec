export const iconNames = [
  'activity',
  'book',
  'bot',
  'box',
  'calendar',
  'certificate',
  'chart',
  'chat',
  'check-circle',
  'city',
  'cloud',
  'edit',
  'flash',
  'handshake',
  'lock',
  'mail',
  'money',
  'puzzle',
  'rocket',
  'settings',
  'shield',
  'store',
  'sync',
  'target',
  'tools',
  'trending',
  'tree',
  'unlock',
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
  target: {
    viewBox: '0 0 24 24',
    body: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"></circle><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.8"></circle><circle cx="12" cy="12" r="2" fill="currentColor"></circle>`,
  },
  store: {
    viewBox: '0 0 24 24',
    body: `<path d="M3 9h18M5 9l1-4h12l1 4m-14 0v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M9 13v4m6-4v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  money: {
    viewBox: '0 0 24 24',
    body: `<circle cx="12" cy="12" r="1" fill="currentColor"></circle><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  book: {
    viewBox: '0 0 24 24',
    body: `<path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm0 0h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  rocket: {
    viewBox: '0 0 24 24',
    body: `<path d="M12 2v12m0 0 4-4m-4 4-4-4M6 16a.5.5 0 0 1 1 0v1.5a1.5 1.5 0 0 1-1.5 1.5h-.5a.5.5 0 0 0 0 1h.5a2.5 2.5 0 0 0 2.5-2.5V16zm12 0a.5.5 0 0 0-1 0v1.5a1.5 1.5 0 0 0 1.5 1.5h.5a.5.5 0 0 1 0 1h-.5a2.5 2.5 0 0 1-2.5-2.5V16z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  edit: {
    viewBox: '0 0 24 24',
    body: `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M3 15.5h12M17.5 3a2 2 0 1 1 2.828 2.828L17.5 8.656" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  trending: {
    viewBox: '0 0 24 24',
    body: `<path d="M3 21h18M3 3v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  tools: {
    viewBox: '0 0 24 24',
    body: `<path d="M12 6V2m1.5 14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM7.5 2A2.5 2.5 0 0 0 5 4.5a2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 2zm9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  unlock: {
    viewBox: '0 0 24 24',
    body: `<rect x="5" y="12" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"></rect><path d="M8 12V8a4 4 0 0 1 8 0M12 16v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
  },
  box: {
    viewBox: '0 0 24 24',
    body: `<path d="M2 7l10-5 10 5v10l-10 5-10-5V7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 12v5M2 7l10 5 10-5M12 12l10-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  puzzle: {
    viewBox: '0 0 24 24',
    body: `<path d="M2 7a2 2 0 0 1 2-2h4a2 2 0 0 0 2-2v0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v0a2 2 0 0 0 2 2h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2v0a2 2 0 0 1-2 2 2 2 0 0 1-2-2v0a2 2 0 0 0-2-2h-4a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 0 2-2v0a2 2 0 0 0-2-2H4a2 2 0 0 1-2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  city: {
    viewBox: '0 0 24 24',
    body: `<path d="M3 21V9a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v12M3 21h18M9 9h1v4H9V9zm4 0h1v6h-1V9zm4 0h1v4h-1V9z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  tree: {
    viewBox: '0 0 24 24',
    body: `<path d="M12 2l3 6h-2v3h-2V8h-2l3-6zm0 4v10M6 18h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  activity: {
    viewBox: '0 0 24 24',
    body: `<path d="M3 12h3l2-4 2 6 2-3 3 0h3m-15 8c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
  },
  settings: {
    viewBox: '0 0 24 24',
    body: `<circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="1.8"></circle><path d="M12 2v4m0 8v4m8.66-6.66h-2.83m-5.66 0H5.34M19.07 4.93l-2 2M7.93 16.07l-2 2M19.07 19.07l-2-2M7.93 7.93l-2-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
  },
};
