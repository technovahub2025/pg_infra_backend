function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(value) {
  const date = value instanceof Date ? new Date(value) : parseDate(value);
  if (!date) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(value) {
  const date = value instanceof Date ? new Date(value) : parseDate(value);
  if (!date) return null;
  date.setHours(23, 59, 59, 999);
  return date;
}

function startOfWeek(value) {
  const date = startOfDay(value);
  if (!date) return null;
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return date;
}

function addDays(value, days) {
  const date = value instanceof Date ? new Date(value) : parseDate(value);
  if (!date) return null;
  date.setDate(date.getDate() + Number(days || 0));
  return date;
}

function formatDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function padNumber(value) {
  return String(Math.floor(Math.max(0, Number(value) || 0))).padStart(2, '0');
}

function formatMinutesClock(minutes = 0) {
  const total = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(total / 60);
  const mins = Math.round(total % 60);
  return `${padNumber(hours)}:${padNumber(mins)}`;
}

function isBillableProject(project = {}) {
  const status = String(project.invoiceStatus || '').trim().toLowerCase();
  return Boolean(status) && status !== 'not started';
}

function defaultBillableFromProject(project = {}) {
  return isBillableProject(project);
}

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeIdList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveTimesheetRange(query = {}, defaultDays = 30) {
  const startInput = parseDate(query.start || query.from);
  const endInput = parseDate(query.end || query.to);
  if (startInput || endInput) {
    return {
      start: startInput ? startOfDay(startInput) : null,
      end: endInput ? endOfDay(endInput) : null,
    };
  }

  const preset = String(query.preset || query.range || query.period || 'last-30-days').trim().toLowerCase();
  const now = new Date();
  switch (preset) {
    case '7d':
    case 'last-7-days':
    case 'week': {
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      return { start: startOfDay(start), end: endOfDay(now) };
    }
    case 'this-month':
    case 'month': {
      return { start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)), end: endOfDay(now) };
    }
    case '90d':
    case 'last-90-days': {
      const start = new Date(now);
      start.setDate(start.getDate() - 89);
      return { start: startOfDay(start), end: endOfDay(now) };
    }
    case 'all': {
      return { start: null, end: null };
    }
    case '30d':
    case 'last-30-days':
    default: {
      const start = new Date(now);
      start.setDate(start.getDate() - Math.max(1, Number(defaultDays) || 30) + 1);
      return { start: startOfDay(start), end: endOfDay(now) };
    }
  }
}

function toDateFilter(range = {}) {
  if (!range.start && !range.end) return {};
  return {
    date: {
      ...(range.start ? { $gte: range.start } : {}),
      ...(range.end ? { $lte: range.end } : {}),
    },
  };
}

function formatDurationSeconds(seconds = 0) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(secs)}`;
}

module.exports = {
  addDays,
  defaultBillableFromProject,
  endOfDay,
  escapeRegex,
  formatDateKey,
  formatDurationSeconds,
  formatMinutesClock,
  isBillableProject,
  normalizeIdList,
  parseDate,
  resolveTimesheetRange,
  startOfDay,
  startOfWeek,
  toDateFilter,
};
