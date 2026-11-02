import { create } from 'zustand';
import { db, initializeDatabase } from '../services/db';
import { fetchCurrentWeather } from '../services/weather';
import { evaluatePurchaseCandidate, getRecommendedGaps } from '../services/shoppingAdvisor';

export const useWardrobeStore = create((set, get) => ({
  items: [],
  outfits: [],
  calendarLogs: [],
  profile: null,
  wishlist: [],
  recommendedGaps: [],
  weather: null,
  isLoading: true,
  activeFilter: 'todos',
  searchQuery: '',

  // Carga inicial y sincronización con Dexie
  initStore: async () => {
    try {
      set({ isLoading: true });
      await initializeDatabase();

      const [items, outfits, calendarLogs, profileRecord, wishlist] = await Promise.all([
        db.items.toArray(),
        db.outfits.toArray(),
        db.calendarLogs.toArray(),
        db.userProfile.get('me'),
        db.shoppingWishlist.toArray()
      ]);

      const weather = await fetchCurrentWeather();
      const recommendedGaps = getRecommendedGaps(items);

      set({
        items,
        outfits,
        calendarLogs,
        profile: profileRecord || {},
        wishlist,
        recommendedGaps,
        weather,
        isLoading: false
      });
    } catch (err) {
      console.error('Error al inicializar store:', err);
      set({ isLoading: false });
    }
  },

  // Filtros
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // CRUD Prendas
  addItem: async (itemData) => {
    const newItem = {
      ...itemData,
      wearCount: itemData.wearCount || 0,
      price: Number(itemData.price) || 0,
      favorite: !!itemData.favorite,
      inLaundry: false,
      lastWornDate: null
    };
    const id = await db.items.add(newItem);
    const itemWithId = { ...newItem, id };
    set((state) => {
      const updated = [itemWithId, ...state.items];
      return {
        items: updated,
        recommendedGaps: getRecommendedGaps(updated)
      };
    });
    return id;
  },

  updateItem: async (id, updates) => {
    await db.items.update(id, updates);
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    }));
  },

  deleteItem: async (id) => {
    await db.items.delete(id);
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    }));
  },

  toggleFavorite: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const favorite = !item.favorite;
    await db.items.update(id, { favorite });
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, favorite } : i))
    }));
  },

  toggleLaundry: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const inLaundry = !item.inLaundry;
    await db.items.update(id, { inLaundry });
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, inLaundry } : i))
    }));
  },

  incrementWear: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const wearCount = (item.wearCount || 0) + 1;
    const lastWornDate = new Date().toISOString().split('T')[0];
    await db.items.update(id, { wearCount, lastWornDate });
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, wearCount, lastWornDate } : i))
    }));
  },

  // Outfits
  saveOutfit: async (outfitData) => {
    const newOutfit = {
      ...outfitData,
      createdAt: new Date().toISOString()
    };
    const id = await db.outfits.add(newOutfit);
    const outfitWithId = { ...newOutfit, id };
    set((state) => ({
      outfits: [outfitWithId, ...state.outfits]
    }));
    return id;
  },

  deleteOutfit: async (id) => {
    await db.outfits.delete(id);
    set((state) => ({
      outfits: state.outfits.filter((o) => o.id !== id)
    }));
  },

  // Calendario & Wear Tracking
  logOutfitToCalendar: async (outfitId, date = new Date().toISOString().split('T')[0], occasion = 'General', notes = '') => {
    const outfit = get().outfits.find((o) => o.id === outfitId);
    const weather = get().weather;

    const logEntry = {
      date,
      outfitId,
      occasion,
      weatherTemp: weather?.temp || 20,
      weatherCondition: weather?.condition || 'Despejado',
      notes
    };

    const id = await db.calendarLogs.add(logEntry);
    set((state) => ({
      calendarLogs: [{ ...logEntry, id }, ...state.calendarLogs]
    }));

    // Aumentar el contador de puestas de cada prenda del outfit
    if (outfit?.items && Array.isArray(outfit.items)) {
      for (const itemId of outfit.items) {
        await get().incrementWear(itemId);
      }
    }
  },

  // Perfil
  updateProfile: async (updates) => {
    const current = get().profile || {};
    const updated = { ...current, ...updates, id: 'me' };
    await db.userProfile.put(updated);
    set({ profile: updated });
  },

  // Shopping Wishlist (Fase 2)
  evaluateAndAddWishlist: async (candidate) => {
    const currentWardrobe = get().items;
    const profile = get().profile;
    const evaluation = evaluatePurchaseCandidate(candidate, currentWardrobe, profile);

    const wishlistItem = {
      ...candidate,
      aiScore: evaluation.score,
      aiVerdict: evaluation.verdict,
      badgeColor: evaluation.badgeColor,
      unlockedOutfits: evaluation.unlockedOutfits,
      projectedCPW: evaluation.projectedCPW,
      pros: evaluation.pros,
      cons: evaluation.cons,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const id = await db.shoppingWishlist.add(wishlistItem);
    set((state) => ({
      wishlist: [{ ...wishlistItem, id }, ...state.wishlist]
    }));
    return { ...wishlistItem, id };
  },

  deleteWishlistItem: async (id) => {
    await db.shoppingWishlist.delete(id);
    set((state) => ({
      wishlist: state.wishlist.filter((w) => w.id !== id)
    }));
  }
}));
