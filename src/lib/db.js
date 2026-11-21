import Dexie from 'dexie';

export const db = new Dexie('stylus2');
db.version(1).stores({
  items: '++id, category, createdAt',
  outfits: '++id, createdAt',
  wears: '++id, date',
  wishlist: '++id, createdAt',
  feedback: '++id, key',
  kv: 'k',
});

export async function getKV(k, def = null) {
  const r = await db.kv.get(k);
  return r ? r.v : def;
}
export const setKV = (k, v) => db.kv.put({ k, v });

export async function logWear(itemIds, outfitId = null, date = new Date().toISOString().slice(0, 10)) {
  await db.wears.add({ date, itemIds, outfitId });
  const now = Date.now();
  await db.items.where('id').anyOf(itemIds).modify((it) => {
    it.wears = (it.wears || 0) + 1;
    it.lastWorn = now;
  });
}

export async function exportAll() {
  const out = {};
  for (const t of db.tables) out[t.name] = await t.toArray();
  return out;
}

export async function importAll(data) {
  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) {
      if (!Array.isArray(data[t.name])) continue;
      await t.clear();
      await t.bulkAdd(data[t.name]);
    }
  });
}
