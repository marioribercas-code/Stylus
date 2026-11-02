import Dexie from 'dexie';

export const db = new Dexie('StylusDB');

db.version(1).stores({
  items: '++id, category, subcategory, color, season, formality, brand, wearCount, favorite, inLaundry',
  outfits: '++id, name, occasion, season, formality, rating, favorite, createdAt',
  calendarLogs: '++id, date, outfitId, occasion',
  userProfile: 'id',
  shoppingWishlist: '++id, category, priority, status'
});

// Seed data para que el usuario tenga un armario masculino de lujo y funcional desde el primer segundo
export const initialMenWardrobe = [
  // SUPERIORES
  {
    name: 'Camisa Oxford Blanca Premium',
    category: 'superiores',
    subcategory: 'camisas',
    color: 'Blanco',
    colorHex: '#FFFFFF',
    secondaryColor: '#E2E8F0',
    pattern: 'Liso',
    fabric: 'Algodón Oxford 100%',
    season: 'Todas',
    formality: 'Smart Casual',
    fit: 'Regular Tailored',
    brand: 'Ralph Lauren',
    price: 110,
    wearCount: 14,
    lastWornDate: '2026-10-28',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    notes: 'Básico infalible para oficina, citas y eventos casuales.'
  },
  {
    name: 'Camisa Lino Azul Cielo',
    category: 'superiores',
    subcategory: 'camisas',
    color: 'Azul Claro',
    colorHex: '#93C5FD',
    secondaryColor: '#DBEAFE',
    pattern: 'Liso',
    fabric: 'Lino 100%',
    season: 'Primavera-Verano',
    formality: 'Casual',
    fit: 'Relaxed',
    brand: 'Massimo Dutti',
    price: 69,
    wearCount: 9,
    lastWornDate: '2026-10-15',
    favorite: false,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    notes: 'Excelente transpirabilidad para días cálidos.'
  },
  {
    name: 'Jersey Cuello Cisne Negro',
    category: 'superiores',
    subcategory: 'jerseys',
    color: 'Negro',
    colorHex: '#18181B',
    secondaryColor: '#27272A',
    pattern: 'Liso',
    fabric: 'Lana Merino Extra Fina',
    season: 'Otoño-Invierno',
    formality: 'Smart Casual',
    fit: 'Slim',
    brand: 'COS',
    price: 89,
    wearCount: 18,
    lastWornDate: '2026-10-31',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
    notes: 'Silueta pulida, queda brutal bajo blazer o abrigo camel.'
  },
  {
    name: 'Camiseta Algodón Pesado Blanco',
    category: 'superiores',
    subcategory: 'camisetas',
    color: 'Blanco',
    colorHex: '#F8FAFC',
    secondaryColor: '#E2E8F0',
    pattern: 'Liso',
    fabric: 'Heavyweight Cotton 240 GSM',
    season: 'Todas',
    formality: 'Casual',
    fit: 'Boxy / Oversized',
    brand: 'Arket',
    price: 35,
    wearCount: 22,
    lastWornDate: '2026-11-01',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    notes: 'Cuello grueso que no se deforma. La base de cualquier look minimalista.'
  },
  {
    name: 'Polo Punto Milano Verde Oliva',
    category: 'superiores',
    subcategory: 'polos',
    color: 'Verde Oliva',
    colorHex: '#4D5D43',
    secondaryColor: '#36422F',
    pattern: 'Liso',
    fabric: 'Punto de Seda y Algodón',
    season: 'Primavera-Otoño',
    formality: 'Smart Casual',
    fit: 'Slim',
    brand: 'Scalpers',
    price: 79,
    wearCount: 6,
    lastWornDate: '2026-10-20',
    favorite: false,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
    notes: 'Textura premium con cuello abierto tipo Johnny.'
  },

  // INFERIORES
  {
    name: 'Pantalón Chino Beige Arena',
    category: 'inferiores',
    subcategory: 'chinos',
    color: 'Beige',
    colorHex: '#D7C4A5',
    secondaryColor: '#E6D7BE',
    pattern: 'Liso',
    fabric: 'Sarga de Algodón con Elastano',
    season: 'Todas',
    formality: 'Smart Casual',
    fit: 'Tapered Fit',
    brand: 'Loro Piana inspired',
    price: 95,
    wearCount: 16,
    lastWornDate: '2026-10-27',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
    notes: 'Corte cónico que estiliza y resalta el calzado.'
  },
  {
    name: 'Vaquero Selvedge Índigo Oscuro',
    category: 'inferiores',
    subcategory: 'vaqueros',
    color: 'Azul Marino',
    colorHex: '#1E293B',
    secondaryColor: '#0F172A',
    pattern: 'Liso',
    fabric: 'Denim Japonés 14oz',
    season: 'Todas',
    formality: 'Casual',
    fit: 'Straight Regular',
    brand: 'Nudie Jeans',
    price: 160,
    wearCount: 28,
    lastWornDate: '2026-10-30',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
    notes: 'Denim rígido sin lavados artificiales. La cúspide de la elegancia casual.'
  },
  {
    name: 'Pantalón de Vestir Gris Marengo con Pinzas',
    category: 'inferiores',
    subcategory: 'pantalones_vestir',
    color: 'Gris Carbón',
    colorHex: '#334155',
    secondaryColor: '#1E293B',
    pattern: 'Liso',
    fabric: 'Lana Fría Super 120s',
    season: 'Todas',
    formality: 'Formal',
    fit: 'Tapered con Cintura Alta',
    brand: 'SuitSupply',
    price: 149,
    wearCount: 8,
    lastWornDate: '2026-10-18',
    favorite: false,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    notes: 'Cintura con ajustadores laterales metálicos, tiro alto que alarga piernas.'
  },

  // CAPAS Y ABRIGOS (EXTERIORES)
  {
    name: 'Blazer Desestructurado Azul Marino',
    category: 'abrigos',
    subcategory: 'blazers',
    color: 'Azul Marino',
    colorHex: '#1B243B',
    secondaryColor: '#0F172A',
    pattern: 'Liso',
    fabric: 'Lana Hopsack Transpirable',
    season: 'Todas',
    formality: 'Smart Casual / Business',
    fit: 'Tailored Soft Shoulder',
    brand: 'Boglioli style',
    price: 240,
    wearCount: 19,
    lastWornDate: '2026-10-29',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    notes: 'Hombro italiano sin hombrera para una caída natural y moderna.'
  },
  {
    name: 'Abrigo Clásico de Lana Camel',
    category: 'abrigos',
    subcategory: 'abrigos',
    color: 'Camel / Tostado',
    colorHex: '#C19A6B',
    secondaryColor: '#9C7A4E',
    pattern: 'Liso',
    fabric: 'Mezcla Lana y Cachemira',
    season: 'Otoño-Invierno',
    formality: 'Formal / Smart',
    fit: 'Overcoat Regular',
    brand: 'Sandro Paris',
    price: 380,
    wearCount: 11,
    lastWornDate: '2026-10-25',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    notes: 'Pieza reina de invierno. Eleva instantáneamente cualquier look básico.'
  },
  {
    name: 'Cazadora de Cuero Estilo Biker Negra',
    category: 'abrigos',
    subcategory: 'cazadoras',
    color: 'Negro',
    colorHex: '#111827',
    secondaryColor: '#1F2937',
    pattern: 'Liso',
    fabric: 'Cuero Ovino Genuino',
    season: 'Primavera-Otoño',
    formality: 'Casual',
    fit: 'Slim Fitted',
    brand: 'AllSaints',
    price: 320,
    wearCount: 24,
    lastWornDate: '2026-10-22',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&auto=format&fit=crop&q=80',
    notes: 'Cuero suave de altísima calidad con herrajes plateados cepillados.'
  },
  {
    name: 'Sobrecamisa de Pana Color Tabaco',
    category: 'abrigos',
    subcategory: 'sobrecamisas',
    color: 'Marrón Tabaco',
    colorHex: '#78350F',
    secondaryColor: '#92400E',
    pattern: 'Pana Fina',
    fabric: 'Algodón Pana 100%',
    season: 'Otoño-Invierno',
    formality: 'Casual',
    fit: 'Relaxed Overshirt',
    brand: 'Mango Man',
    price: 60,
    wearCount: 12,
    lastWornDate: '2026-10-26',
    favorite: false,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80',
    notes: 'Ideal para capas intermedias en entretiempo.'
  },

  // CALZADO
  {
    name: 'Sneakers Minimalistas Blancas de Piel',
    category: 'calzado',
    subcategory: 'sneakers',
    color: 'Blanco Puro',
    colorHex: '#FFFFFF',
    secondaryColor: '#E5E7EB',
    pattern: 'Liso',
    fabric: 'Piel Vacuna Italiana',
    season: 'Todas',
    formality: 'Smart Casual',
    fit: 'True to size',
    brand: 'Common Projects style',
    price: 180,
    wearCount: 45,
    lastWornDate: '2026-11-01',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    notes: 'El calzado más versátil que existe: va con traje o con vaqueros.'
  },
  {
    name: 'Mocasines Penny Loafers Ante Marrón',
    category: 'calzado',
    subcategory: 'mocasines',
    color: 'Marrón Chocolate',
    colorHex: '#451A03',
    secondaryColor: '#78350F',
    pattern: 'Ante / Suede',
    fabric: 'Ante Vacuno Genuino',
    season: 'Primavera-Otoño',
    formality: 'Smart Casual / Business',
    fit: 'Normal',
    brand: 'Berwick 1707',
    price: 195,
    wearCount: 15,
    lastWornDate: '2026-10-28',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    notes: 'Construcción Goodyear Welt, elegancia europea relajada.'
  },
  {
    name: 'Botas Chelsea de Cuero Negro',
    category: 'calzado',
    subcategory: 'botas',
    color: 'Negro',
    colorHex: '#0F172A',
    secondaryColor: '#1E293B',
    pattern: 'Liso',
    fabric: 'Cuero Flor con Suela Dainite',
    season: 'Otoño-Invierno',
    formality: 'Smart Casual',
    fit: 'Fitted Ankle',
    brand: 'Meermin Mallorca',
    price: 210,
    wearCount: 20,
    lastWornDate: '2026-10-24',
    favorite: false,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80',
    notes: 'Línea estilizada y gran protección contra el frío y la lluvia.'
  },

  // ACCESORIOS
  {
    name: 'Reloj Cronógrafo Acero y Esfera Negra',
    category: 'accesorios',
    subcategory: 'relojes',
    color: 'Plata / Negro',
    colorHex: '#94A3B8',
    secondaryColor: '#0F172A',
    pattern: 'Metálico',
    fabric: 'Acero Inoxidable 316L',
    season: 'Todas',
    formality: 'Todas',
    fit: '40mm',
    brand: 'Seiko Prospex',
    price: 350,
    wearCount: 65,
    lastWornDate: '2026-11-01',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    notes: 'El reloj insignia que ancla cualquier conjunto masculino.'
  },
  {
    name: 'Gafas de Sol Carey Estilo Wayfarer',
    category: 'accesorios',
    subcategory: 'gafas',
    color: 'Habana Carey',
    colorHex: '#713F12',
    secondaryColor: '#A16207',
    pattern: 'Carey',
    fabric: 'Acetato de Celulosa',
    season: 'Todas',
    formality: 'Casual / Smart',
    fit: 'Medium',
    brand: 'Oliver Peoples style',
    price: 130,
    wearCount: 38,
    lastWornDate: '2026-10-29',
    favorite: true,
    inLaundry: false,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    notes: 'Favorece rostros ovalados y cuadrados. Lente verde mineral.'
  }
];

export const initialUserProfile = {
  id: 'me',
  name: 'Mario',
  gender: 'Hombre',
  bodyType: 'Trapecio', // Trapecio (atlético equilibrado), Triángulo invertido, Rectángulo, Triángulo, Óvalo
  height: 180,
  weight: 78,
  seasonColor: 'Otoño Oscuro (Deep Autumn)', // 12-season color system
  undertone: 'Cálido Neutro',
  skinTone: 'Medio Dorado',
  hairColor: 'Castaño Oscuro',
  eyeColor: 'Marrón Avellana',
  styleEssence: 'Classic & Casual Elegance', // Kitchener essence
  contrastLevel: 'Medio-Alto',
  powerColors: ['Verde Oliva', 'Azul Marino', 'Terracota', 'Camel', 'Gris Carbón', 'Burdeos'],
  avoidColors: ['Rosa Neón', 'Amarillo Limón Chillón', 'Gris Frío Lavado'],
  fitPreferences: {
    upperBody: 'Regular Tailored',
    lowerBody: 'Tapered / Straight',
    favoredProportions: 'Regla de los 2/3 (piernas largas con tiro medio-alto)'
  }
};

export const initialShoppingWishlist = [
  {
    name: 'Sobrecamisa de Lino Crudo / Beige',
    category: 'abrigos',
    estimatedPrice: 79,
    brand: 'Mango Man / Arket',
    priority: 'Alta',
    reason: 'Multiplicador de combinaciones: conecta el pantalón chino con camisetas blancas y polo oliva.',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
    colorHex: '#E5D9C5',
    colorName: 'Crudo Natural',
    aiScore: 94,
    aiVerdict: 'Compra Maestra',
    status: 'pending',
    unlockedOutfits: 12
  },
  {
    name: 'Zapatos Oxford en Cuero Marrón Cuero',
    category: 'calzado',
    estimatedPrice: 175,
    brand: 'Meermin / Crownhill Shoes',
    priority: 'Media',
    reason: 'Falta un zapato formal de traje para eventos de gala o bodas.',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
    colorHex: '#582F0E',
    colorName: 'Marrón Coñac',
    aiScore: 88,
    aiVerdict: 'Inversión Estratégica',
    status: 'pending',
    unlockedOutfits: 8
  }
];

// Inicializar la base de datos si está vacía
export async function initializeDatabase() {
  const itemCount = await db.items.count();
  if (itemCount === 0) {
    console.log('Sembrando armario masculino inicial en Dexie DB...');
    await db.items.bulkAdd(initialMenWardrobe);
    await db.userProfile.put(initialUserProfile);
    await db.shoppingWishlist.bulkAdd(initialShoppingWishlist);

    // Sembrar un par de outfits preconfigurados
    const allItems = await db.items.toArray();
    const findItem = (nameSubstr) => allItems.find(i => i.name.toLowerCase().includes(nameSubstr.toLowerCase()));

    const oxford = findItem('Oxford');
    const blazer = findItem('Blazer');
    const chino = findItem('Chino');
    const sneakers = findItem('Sneakers');
    const reloj = findItem('Reloj');
    const jerseyNegro = findItem('Jersey');
    const abrigoCamel = findItem('Camel');
    const vaquero = findItem('Vaquero');
    const botas = findItem('Chelsea');

    const outfits = [
      {
        name: 'Smart Casual Impecable',
        occasion: 'Oficina / Reunión / Cita',
        season: 'Entretiempo',
        formality: 'Smart Casual',
        rating: 5,
        favorite: true,
        createdAt: new Date().toISOString(),
        items: [blazer?.id, oxford?.id, chino?.id, sneakers?.id, reloj?.id].filter(Boolean),
        colorHarmonyScore: 96,
        harmonyType: 'Neutros de Contraste Elegante'
      },
      {
        name: 'Monocromo Urbano con Capa Camel',
        occasion: 'Cena de Noche / Fin de Semana',
        season: 'Otoño-Invierno',
        formality: 'Smart Casual',
        rating: 5,
        favorite: true,
        createdAt: new Date().toISOString(),
        items: [abrigoCamel?.id, jerseyNegro?.id, vaquero?.id, botas?.id, reloj?.id].filter(Boolean),
        colorHarmonyScore: 98,
        harmonyType: 'Contraste Cálido/Frío Clásico'
      }
    ];

    await db.outfits.bulkAdd(outfits);

    // Registro de ayer y hoy en el calendario
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await db.calendarLogs.bulkAdd([
      {
        date: yesterdayStr,
        outfitId: 1,
        occasion: 'Oficina y Comida de Negocios',
        weatherTemp: 19,
        weatherCondition: 'Despejado',
        notes: 'Outfit comodísimo y muy elogiado.'
      },
      {
        date: todayStr,
        outfitId: 2,
        occasion: 'Cena y Encuentro Casual',
        weatherTemp: 15,
        weatherCondition: 'Algo nublado',
        notes: 'El abrigo camel con base negra nunca falla.'
      }
    ]);
  }
}
