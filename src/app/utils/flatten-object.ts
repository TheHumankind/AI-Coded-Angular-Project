export interface FlatRow {
  field: string;
  value: string;
}

/** Раскладывает вложенный объект в плоский список «путь.к.полю → значение» */
export function flattenObject(value: unknown, path = '', rows: FlatRow[] = []): FlatRow[] {
  if (Array.isArray(value) && value.every((item) => item === null || typeof item !== 'object')) {
    rows.push({ field: path, value: value.length ? value.join(', ') : '—' });
  } else if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    if (!entries.length) {
      rows.push({ field: path, value: '—' });
    }
    for (const [key, child] of entries) {
      flattenObject(child, path ? `${path}.${key}` : key, rows);
    }
  } else {
    rows.push({ field: path, value: value === null || value === '' ? '—' : String(value) });
  }
  return rows;
}
