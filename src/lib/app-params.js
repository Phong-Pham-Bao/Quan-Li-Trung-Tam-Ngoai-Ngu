const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

// Demo configuration - no more base44 dependency
export const appParams = {
  appId: 'demo-app',
  token: null,
  fromUrl: typeof window !== 'undefined' ? window.location.href : null,
  functionsVersion: 'v1',
  appBaseUrl: 'http://localhost:3000',
};
