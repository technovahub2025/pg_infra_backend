const DEFAULT_CLIENT_URL = 'http://localhost:5173';
const DEFAULT_DEVELOPMENT_CLIENT_URLS = [
  DEFAULT_CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
const DEFAULT_PRODUCTION_CLIENT_URLS = [
  'https://technovahub.in',
  'https://www.technovahub.in',
];
const TECHNOVAHUB_ORIGIN_PATTERN = /^https:\/\/([a-z0-9-]+\.)?technovahub\.in$/i;

function isProductionLike() {
  return (
    process.env.NODE_ENV === 'production' ||
    String(process.env.RENDER || '').toLowerCase() === 'true' ||
    Boolean(process.env.RENDER_SERVICE_ID || process.env.RENDER_EXTERNAL_URL || process.env.RENDER_SERVICE_NAME)
  );
}

function normalizeOrigin(value) {
  const normalized = String(value || '').trim().replace(/[.,/]+$/, '');
  return normalized || '';
}

function getClientUrls() {
  const rawValues = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS,
    process.env.FRONTEND_URL,
    process.env.FRONTEND_ORIGIN,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','));

  const urls = rawValues.map(normalizeOrigin).filter(Boolean);
  const merged = [
    ...urls,
    ...DEFAULT_PRODUCTION_CLIENT_URLS,
    ...DEFAULT_DEVELOPMENT_CLIENT_URLS,
  ];
  return [...new Set(merged.map(normalizeOrigin).filter(Boolean))];
}

function getClientUrl() {
  return getClientUrls()[0] || DEFAULT_CLIENT_URL;
}

function isAllowedClientOrigin(origin) {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  if (getClientUrls().includes(normalized)) return true;
  if (TECHNOVAHUB_ORIGIN_PATTERN.test(normalized)) return true;
  return false;
}

module.exports = {
  getClientUrl,
  getClientUrls,
  isAllowedClientOrigin,
  isProductionLike,
  normalizeOrigin,
};
