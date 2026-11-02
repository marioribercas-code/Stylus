/**
 * STYLUS Fashion & Satorial Intelligence Engine (Compendio Total de Moda Masculina)
 * Codificación matemática de:
 * 1. 12 Estaciones de Colorimetría Personal (Deep/Warm/Soft Autumn, Deep/Cool/Clear Winter, Light/Warm/Clear Spring, Light/Cool/Soft Summer)
 * 2. Morfologías Corporales Masculinas + Sistema de Acomodación Kibbe para Hombres (Dramatic, Classic, Natural, Gamine, Romantic)
 * 3. Geometría Facial (Óvalo, Cuadrado, Redondo, Corazón, Diamante, Oblongo) y selección de cuellos de camisa, solapas y gafas
 * 4. Regla de los Tercios y Proporciones Satoriales (tiro, balance de torso vs piernas, dobladillos)
 * 5. Mezcla de Estampados (Escala mayor + micro-patrón, colores compartidos)
 * 6. Física de Tejidos y Estacionalidad (GSM, peso, transpirabilidad, caída y mezcla de texturas)
 * 7. Jerarquía de Formalidad (Escala 1 a 10: desde Streetwear hasta Black Tie / Gala)
 */

// 1. Colorimetría de 12 Estaciones Masculinas
export const COLOR_SEASONS = {
  'deep_autumn': {
    id: 'deep_autumn',
    name: 'Otoño Oscuro (Deep Autumn)',
    temperatura: 'Cálida Neutra',
    valor: 'Muy Oscuro',
    croma: 'Rico / Terroso',
    descripcion: 'Piel con trasfondo dorado/oliva, ojos castaños intensos o avellana profunda, cabello castaño oscuro o negro con reflejos cálidos. Alto contraste cálido.',
    powerColors: [
      { name: 'Verde Bosque / Oliva', hex: '#2D3A29' },
      { name: 'Terracota Quemado', hex: '#9C4124' },
      { name: 'Azul Petróleo Profundo', hex: '#1B3B48' },
      { name: 'Marrón Chocolate Amargo', hex: '#3B2219' },
      { name: 'Camel Tostado / Mostaza', hex: '#B8860B' },
      { name: 'Rojo Granate / Burdeos', hex: '#6B1D28' }
    ],
    neutrosBase: ['Marrón Café Oscuro', 'Azul Marino Tinta', 'Verde Militar Oscuro', 'Blanco Marfil / Hueso'],
    avoidColors: [
      { name: 'Rosa Pastel Frío', hex: '#F9A8D4' },
      { name: 'Azul Eléctrico Glaciar', hex: '#38BDF8' },
      { name: 'Amarillo Limón Neón', hex: '#FEF08A' },
      { name: 'Gris Plata Frío Lavado', hex: '#CBD5E1' }
    ],
    reglaEstilo: 'Prioriza trajes en azul tinta o marrón chocolate antes que negro puro. El camel tostado y el verde oliva en jerséis iluminan tus facciones.'
  },
  'warm_autumn': {
    id: 'warm_autumn',
    name: 'Otoño Verdadero / Cálido (Warm Autumn)',
    temperatura: 'Completamente Cálida',
    valor: 'Medio',
    croma: 'Terroso y Cálido',
    descripcion: 'Subtono dorado visible en la dermis, cabello con destellos cobrizos o castaño cálido, ojos miel o ámbar.',
    powerColors: [
      { name: 'Mostaza Cálido', hex: '#D97706' },
      { name: 'Óxido / Teja', hex: '#B45309' },
      { name: 'Verde Caqui Intenso', hex: '#4D5B38' },
      { name: 'Azul Teal Cálido', hex: '#0F766E' }
    ],
    neutrosBase: ['Beige Cálido', 'Marrón Cuero Coñac', 'Verde Oliva'],
    avoidColors: [
      { name: 'Negro Azabache', hex: '#000000' },
      { name: 'Fucsia Neón', hex: '#EC4899' },
      { name: 'Blanco Óptico', hex: '#FFFFFF' }
    ],
    reglaEstilo: 'Sustituye el blanco puro por crudo o lino natural. Complementa siempre con accesorios de piel en marrón coñac.'
  },
  'soft_autumn': {
    id: 'soft_autumn',
    name: 'Otoño Suave (Soft Autumn)',
    temperatura: 'Cálida Neutra',
    valor: 'Medio-Claro',
    croma: 'Ahumado / Muted',
    descripcion: 'Bajo contraste entre ojos, piel y cabello. Matices amaderados y suaves.',
    powerColors: [
      { name: 'Verde Salvia Suave', hex: '#84A98C' },
      { name: 'Arena Tostada', hex: '#C2B280' },
      { name: 'Azul Pizarra Suave', hex: '#64748B' },
      { name: 'Rosa Viejo / Polvo', hex: '#B76E79' }
    ],
    neutrosBase: ['Gris Pardo (Taupe)', 'Beige Arena', 'Azul Niebla'],
    avoidColors: [
      { name: 'Negro Rígido', hex: '#111827' },
      { name: 'Rojo Carmesí Puro', hex: '#DC2626' }
    ],
    reglaEstilo: 'Looks tono sobre tono y monocromías suaves. Saca el máximo partido a la pana fina, franela y ante.'
  },
  'deep_winter': {
    id: 'deep_winter',
    name: 'Invierno Oscuro (Deep Winter)',
    temperatura: 'Fría Neutra',
    valor: 'Muy Oscuro',
    croma: 'Brillante y Profundo',
    descripcion: 'Piel clara o morena con subtono frío, pelo negro carbón, ojos oscuros penetrantes. Máximo contraste.',
    powerColors: [
      { name: 'Negro Azabache Puro', hex: '#000000' },
      { name: 'Azul Real Intenso', hex: '#1D4ED8' },
      { name: 'Rojo Carmesí', hex: '#991B1B' },
      { name: 'Verde Esmeralda', hex: '#065F46' },
      { name: 'Blanco Óptico Inmaculado', hex: '#FFFFFF' }
    ],
    neutrosBase: ['Negro Puro', 'Blanco Glaciar', 'Gris Carbón', 'Azul Medianoche'],
    avoidColors: [
      { name: 'Beige Sucio', hex: '#D6C7A1' },
      { name: 'Naranja Quemado', hex: '#C2410C' },
      { name: 'Marrón Dorado', hex: '#A16207' }
    ],
    reglaEstilo: 'El contraste blanco y negro absoluto es tu mayor arma. Camisas blancas nítidas con americanas negras o azul medianoche.'
  },
  'cool_winter': {
    id: 'cool_winter',
    name: 'Invierno Verdadero / Frío (Cool Winter)',
    temperatura: 'Completamente Fría',
    valor: 'Medio-Oscuro',
    croma: 'Puro y Glaseado',
    descripcion: 'Subtono rosado o azulado, cabello ceniza o negro azabache, ojos azules o grisáceos fríos.',
    powerColors: [
      { name: 'Azul Zafiro', hex: '#1E3A8A' },
      { name: 'Púrpura Imperial', hex: '#581C87' },
      { name: 'Rojo Rubí Frío', hex: '#881337' },
      { name: 'Gris Acero', hex: '#475569' }
    ],
    neutrosBase: ['Gris Plomo', 'Blanco Nieve', 'Negro'],
    avoidColors: [
      { name: 'Dorado Amarillo', hex: '#EAB308' },
      { name: 'Naranja Terracota', hex: '#EA580C' }
    ],
    reglaEstilo: 'Metales siempre plateados (acero, platino, titanio). Huye de la orfebrería dorada.'
  },
  'clear_winter': {
    id: 'clear_winter',
    name: 'Invierno Brillante (Clear Winter)',
    temperatura: 'Fría',
    valor: 'Medio',
    croma: 'Ultra Saturado y Cristalino',
    descripcion: 'Ojos muy cristalinos y brillantes que contrastan fuertemente con la tez.',
    powerColors: [
      { name: 'Azul Cobalto', hex: '#2563EB' },
      { name: 'Magenta / Cereza', hex: '#BE185D' },
      { name: 'Verde Esmeralda Vivo', hex: '#059669' },
      { name: 'Blanco Puro', hex: '#FFFFFF' }
    ],
    neutrosBase: ['Negro Espejo', 'Gris Plata', 'Azul Marino Eléctrico'],
    avoidColors: [{ name: 'Marrón Apagado', hex: '#574135' }],
    reglaEstilo: 'Bloques de color definidos sin transiciones turbias.'
  },
  'light_spring': {
    id: 'light_spring',
    name: 'Primavera Clara (Light Spring)',
    temperatura: 'Cálida',
    valor: 'Claro',
    croma: 'Luminoso',
    descripcion: 'Piel clara dorada, ojos verdes/miel luminosos, cabello rubio o castaño claro con luz.',
    powerColors: [
      { name: 'Verde Manzana Suave', hex: '#65A30D' },
      { name: 'Coral Claro', hex: '#FB7185' },
      { name: 'Azul Aguamarina', hex: '#06B6D4' },
      { name: 'Beige Marfil', hex: '#FEF3C7' }
    ],
    neutrosBase: ['Beige Claro', 'Camel Suave', 'Gris Claro Cálido'],
    avoidColors: [{ name: 'Negro Pesado', hex: '#000000' }, { name: 'Burdeos', hex: '#4C0519' }],
    reglaEstilo: 'Linos claros, trajes tono arena y camisas celestes con corbatas en tonos pastel cálidos.'
  },
  'warm_spring': {
    id: 'warm_spring',
    name: 'Primavera Verdadera / Cálida (Warm Spring)',
    temperatura: 'Muy Cálida',
    valor: 'Medio-Luminoso',
    croma: 'Vivo y Dorado',
    descripcion: 'Resplandor dorado natural, piel que se broncea fácil con un toque cálido inconfundible.',
    powerColors: [
      { name: 'Verde Jade', hex: '#10B981' },
      { name: 'Naranja Melocotón', hex: '#EA580C' },
      { name: 'Azul Turquesa', hex: '#0284C7' },
      { name: 'Amarillo Trigo', hex: '#FACC15' }
    ],
    neutrosBase: ['Camel Dorado', 'Crema', 'Marrón Avellana'],
    avoidColors: [{ name: 'Negro Mate', hex: '#18181B' }],
    reglaEstilo: 'Marrón coñac en calzado y cinturón. Verde jade en jerséis finos de cuello redondo.'
  },
  'clear_spring': {
    id: 'clear_spring',
    name: 'Primavera Brillante (Clear Spring)',
    temperatura: 'Cálida Neutra',
    valor: 'Medio',
    croma: 'Brillante',
    descripcion: 'Ojos muy contrastados, calidez vivaz en las facciones.',
    powerColors: [
      { name: 'Azul Turquesa Intenso', hex: '#0284C7' },
      { name: 'Verde Lima Vivo', hex: '#84CC16' },
      { name: 'Coral Intenso', hex: '#F43F5E' }
    ],
    neutrosBase: ['Gris Perla', 'Azul Marino Brillante', 'Blanco Cálido'],
    avoidColors: [{ name: 'Gris Rata Lavado', hex: '#64748B' }],
    reglaEstilo: 'Polo de piqué con vivos contrastantes y prendas superiores que aporten energía.'
  },
  'light_summer': {
    id: 'light_summer',
    name: 'Verano Claro (Light Summer)',
    temperatura: 'Fría',
    valor: 'Muy Claro',
    croma: 'Pastel / Suave',
    descripcion: 'Piel nórdica o muy clara, ojos celestes/grises, cabello rubio ceniza.',
    powerColors: [
      { name: 'Azul Bebé / Tiza', hex: '#93C5FD' },
      { name: 'Verde Menta Pastel', hex: '#6EE7B7' },
      { name: 'Gris Perla Frío', hex: '#CBD5E1' }
    ],
    neutrosBase: ['Gris Nube', 'Azul Marino Lavado', 'Blanco Roto Frío'],
    avoidColors: [{ name: 'Negro Rígido', hex: '#000000' }],
    reglaEstilo: 'Camisas azul Oxford lavado, trajes de lino gris perla y jerséis de cachemira celestes.'
  },
  'cool_summer': {
    id: 'cool_summer',
    name: 'Verano Verdadero / Frío (Cool Summer)',
    temperatura: 'Completamente Fría',
    valor: 'Medio',
    croma: 'Ahumado',
    descripcion: 'Subtono azulado puro, ojos azul pizarra, cabello castaño ceniza frío.',
    powerColors: [
      { name: 'Azul Denim Medio', hex: '#3B82F6' },
      { name: 'Frambuesa Suave', hex: '#BE123C' },
      { name: 'Gris Pizarra', hex: '#475569' }
    ],
    neutrosBase: ['Gris Pizarra', 'Azul Marino Ceniza', 'Blanco Frío'],
    avoidColors: [{ name: 'Dorado', hex: '#F59E0B' }],
    reglaEstilo: 'Jerséis melange en tonos gris azulado y americanas azul tinta frío.'
  },
  'soft_summer': {
    id: 'soft_summer',
    name: 'Verano Suave (Soft Summer)',
    temperatura: 'Fría Neutra',
    valor: 'Medio',
    croma: 'Muted / Apagado',
    descripcion: 'Facciones suaves y difusas, armonía sutil y sofisticada.',
    powerColors: [
      { name: 'Verde Salvia Frío', hex: '#6B7280' },
      { name: 'Ciruela Apagado', hex: '#701A75' },
      { name: 'Azul Denim Desgastado', hex: '#60A5FA' }
    ],
    neutrosBase: ['Gris Marengo Suave', 'Taupe Frío', 'Azul Tinta'],
    avoidColors: [{ name: 'Neón', hex: '#22C55E' }],
    reglaEstilo: 'Elegancia sobria británica: estampados micro-cuadros príncipe de gales en tonos ceniza.'
  }
};

// 2. Sistema Kibbe para Hombres (5 Familias Arquetípicas Masculinas)
export const KIBBE_MENS_SYSTEM = {
  'Dramatic': {
    name: 'Dramático (Líneas Afiladas y Verticalidad Extrema)',
    kibbeFamily: 'Yang Extremo',
    estructuraOsea: 'Estatura alta o presencia longitudinal muy marcada. Hombros angulosos, mandíbula cincelada y afilada.',
    acomodacionRequerida: 'Verticalidad y Sastrería Rígida Estructurada.',
    prendasClave: ['Abrigos largos estructurados hasta media pantorrilla', 'Solapas de pico afiladas', 'Pantalones rectos con caída vertical rígida', 'Monocromatismo severo'],
    evitar: ['Prendas con drapeados suaves, ropa holgada sin hombrera o cortes abullonados.']
  },
  'Classic': {
    name: 'Clásico (Equilibrio Proporcional Satorial)',
    kibbeFamily: 'Equilibrio Yang/Yin',
    estructuraOsea: 'Simetría perfecta. Nada destaca por ser ni muy ancho ni muy estrecho. Rostro equilibrado.',
    acomodacionRequerida: 'Simetría y Sastrería Impecable Atemporal.',
    prendasClave: ['Trajes ingleses dos botones de proporciones canónicas', 'Solapas clásicas de 8 cm con muesca', 'Jerséis finos de cuello pico o caja simétricos', 'Corbatas de pala media (7.5-8 cm)'],
    evitar: ['Excesos vanguardistas, asimetrías o contrastes estrambóticos.']
  },
  'Natural': {
    name: 'Natural (Anchura Atlética y Relajación Estructurada)',
    kibbeFamily: 'Yang Suave y Robusto',
    estructuraOsea: 'Hombros anchos y fuertes con porte atlético natural. Clavículas prominentes y espalda abierta.',
    acomodacionRequerida: 'Anchura en Hombros y Tejidos con Textura.',
    prendasClave: ['Americanas desestructuradas sin hombrera (Spalla Camicia italiana)', 'Sobrecamisas de lino o franela', 'Tejidos táctiles (pana, tweed, lino lavado)', 'Pantalones de corte relajado'],
    evitar: ['Trajes excesivamente rígidos tipo esmoquin encorsetado que aprisionen los hombros.']
  },
  'Gamine': {
    name: 'Gamine (Compacto, Juvenil y Dinámico)',
    kibbeFamily: 'Combinación de Opuestos',
    estructuraOsea: 'Estatura media-baja o complexión compacta y ágil. Facciones vivas y afiladas.',
    acomodacionRequerida: 'Siluetas Ajustadas y Bloques de Color Cortados.',
    prendasClave: ['Cazadoras cortas a la cadera (bomber, biker, harrington)', 'Pantalones cropped con dobladillo visible en el tobillo', 'Rayas marineras bretonas', 'Cuellos pequeños'],
    evitar: ['Abrigos oversized largos que arrastren visualmente la silueta hacia el suelo.']
  },
  'Romantic': {
    name: 'Romántico (Líneas Curvas y Suavidad Texturada)',
    kibbeFamily: 'Yin Extremo',
    estructuraOsea: 'Hombros redondeados, menor angulosidad en mandíbula, tendencia a silueta suave y envolvente.',
    acomodacionRequerida: 'Caída Fluida y Curvatura Suave.',
    prendasClave: ['Lana merino extrafina, cachemira y sedas', 'Cuellos abiertos y fluidos', 'Pantalones con pinzas fluidas de tiro alto que respeten la cintura natural'],
    evitar: ['Prendas de cuero duro acartonado o hombreras exageradas que choquen con la suavidad corporal.']
  }
};

// 3. Geometría Facial Masculina (Accesorios y Cuellos)
export const FACE_SHAPES = {
  'Oval': {
    name: 'Rostro Ovalado',
    descripcion: 'Proporciones equilibradas, barbilla suavemente curvada, pómulos como punto más ancho.',
    cuellosCamisa: ['Cuello Cutaway / Italiano', 'Cuello Inglés / Semi-Spread', 'Cuello Mao'],
    solapasRecomendadas: 'Cualquier solapa (muesca estándar, pico o chal).',
    gafasDeSol: 'Casi cualquier silueta: Wayfarer clásica, Aviador o Clubmaster.',
    reglaOro: 'El rostro más versátil; el objetivo es simplemente mantener el balance natural.'
  },
  'Square': {
    name: 'Rostro Cuadrado',
    descripcion: 'Mandíbula ancha y angular muy marcada, frentes de anchura similar.',
    cuellosCamisa: ['Cuello Francés / Cerrado', 'Cuello con Botones (Button-Down)', 'Cuello con Puntas Alargadas'],
    solapasRecomendadas: 'Solapa estándar o delgada para no ensanchar más horizontalmente.',
    gafasDeSol: 'Monturas redondeadas o aviador (suavizan la angulosidad de la mandíbula).',
    reglaOro: 'Evita cuellos abiertos horizontales (Cutaway extremo) que enfaticen la anchura del mentón.'
  },
  'Round': {
    name: 'Rostro Redondo',
    descripcion: 'Anchura y longitud similares, mejillas llenas y mandíbula redondeada sin ángulos vivos.',
    cuellosCamisa: ['Cuello Inglés Estrecho', 'Cuello Italiano Clásico', 'Cuellos con Puntas Hacia Abajo'],
    solapasRecomendadas: 'Solapas de pico (Peak lapel) que creen diagonales verticales.',
    gafasDeSol: 'Gafas cuadradas o rectangulares (aportan la estructura y ángulos que faltan).',
    reglaOro: 'Genera líneas verticales con jerséis en pico y cuellos de camisa cerrados.'
  },
  'Heart': {
    name: 'Rostro Corazón / Triángulo Invertido',
    descripcion: 'Frente ancha y barbilla puntiaguda y estrecha.',
    cuellosCamisa: ['Cuello Cutaway Abierto', 'Cuello Italiano Clásico con separación'],
    solapasRecomendadas: 'Solapa con muesca ancha.',
    gafasDeSol: 'Gafas con montura más ancha en la parte inferior o aviador.',
    reglaOro: 'El cuello de camisa abierto llena el espacio visual alrededor del mentón estrecho.'
  },
  'Oblong': {
    name: 'Rostro Alargado / Rectangular',
    descripcion: 'Longitud del rostro notablemente mayor que la anchura.',
    cuellosCamisa: ['Cuello Cutaway Extremo', 'Cuello Spread Amplio', 'Cuello Club redondeado'],
    solapasRecomendadas: 'Solapas anchas horizontales.',
    gafasDeSol: 'Gafas grandes cuadradas o estilo Wayfarer voluminosas.',
    reglaOro: 'Usa cuellos amplios que expandan la vista horizontalmente y rompan la longitud.'
  }
};

// 4. Morfología Clásica y Siluetas Antropométricas
export const BODY_SHAPES = {
  'Trapecio': {
    title: 'Trapecio (El Estándar Atlético Equilibrado)',
    caracteristicas: 'Hombros y pecho moderadamente más anchos que la cintura y cadera. Proporción V áurea.',
    ventajas: 'La silueta canónica de la sastrería. La mayoría de marcas confeccionan con este patrón base.',
    reglasOro: [
      'Entalle Regular Tailored o Slim Fit estructurado sin apretar.',
      'Solapas estándar de 8 a 9 cm.',
      'Pantalones con pinzas sutiles o corte tapered que sigan la caída natural de la pierna.',
      'Aplica la regla de los tercios: tiro medio-alto para piernas estilizadas (2/3) y torso pulido (1/3).'
    ],
    prendasEstrella: ['Blazers desestructurados', 'Polos de punto con cuello italiano', 'Pantalones chinos cónicos', 'Sobrecamisas rectas'],
    erroresAEvitar: ['Skinny jeans extremos que desproporcionen la pantorrilla, o ropa sin hombro definido.']
  },
  'Triángulo Invertido': {
    title: 'Triángulo Invertido (Atlético V-Taper Pronunciado)',
    caracteristicas: 'Espalda muy ancha, dorsales y pectorales desarrollados, y cintura/cadera notablemente estrechas.',
    ventajas: 'Presencia física imponente.',
    reglasOro: [
      'Descarta hombreras gruesas para no parecer un triángulo exagerado.',
      'Utiliza americanas de hombro natural (Spalla Camicia napolitana).',
      'Equilibra la silueta inferior con pantalones de pernera recta o pinzas profundas que aporten volumen a la cadera.',
      'Cuellos en V o dos botones desabrochados para abrir el pecho con naturalidad.'
    ],
    prendasEstrella: ['Americanas sin estructura', 'Pantalones rectos con doble pinza', 'Camisas de corte relaxed'],
    erroresAEvitar: ['Pantalones pitillo skinny que te hagan parecer un cono invertido.']
  },
  'Rectángulo': {
    title: 'Rectángulo (Silueta Recta / Esbelta)',
    caracteristicas: 'Hombros, pecho, cintura y cadera tienen una anchura lineal casi idéntica.',
    ventajas: 'Facilidad suprema para superponer capas (layering) sin añadir volumen excesivo.',
    reglasOro: [
      'Crear la ilusión óptica de cintura más estrecha y hombros más anchos.',
      'Americanas cruzadas (Double-breasted) que dibujan diagonales perfectas en el torso.',
      'Prendas con textura contundente: pana gruesa, lana Shetland, jerséis de ochos.',
      'Cinturón de cuero noble que corte y defina la cintura.'
    ],
    prendasEstrella: ['Americanas cruzadas', 'Jerseys de cuello cisne grueso', 'Cazadoras tipo bomber o biker'],
    erroresAEvitar: ['Prendas monocromáticas holgadas que acentúen la caja recta.']
  },
  'Triángulo': {
    title: 'Triángulo (Silueta Pera / Cadera Dominante)',
    caracteristicas: 'Cintura y caderas más anchas que los hombros. Hombros estrechos o caídos.',
    ventajas: 'Muy favorecido con sastrería clásica de corte inglés.',
    reglasOro: [
      'Estructurar siempre la parte superior con americanas de hombrera marcada (corte Savile Row).',
      'Solapas de pico anchas para ensanchar la línea visual del torso.',
      'Colores claros y estampados arriba; tonos oscuros y mate en pantalones.',
      'Pantalones rectos de tiro alto con caída limpia sin ceñir en los muslos.'
    ],
    prendasEstrella: ['Trajes ingleses estructurados', 'Camisas de rayas verticales finas', 'Pantalones oscuros rectos'],
    erroresAEvitar: ['Polos ceñidos en la cintura y pantalones claros ajustados.']
  },
  'Óvalo': {
    title: 'Óvalo / Manzana (Volumen Central)',
    caracteristicas: 'Torso redondeado, mayor volumen en abdomen y cintura, brazos y piernas más delgados.',
    ventajas: 'Gran presencia y elegancia con tejidos nobles y caída vertical continua.',
    reglasOro: [
      'Crear líneas verticales continuas llevando sobrecamisas o blazers abiertos.',
      'Monocromatismo oscuro (azul marino, marengo, negro) en capas superiores e inferiores.',
      'Pantalones de tiro alto apoyados en la cintura natural, jamás por debajo del abdomen.',
      'Tejidos densos y mate (lana fría de buen gramaje, sarga densa) que no se peguen.',
      'Evitar cinturones contrastantes que partan la silueta.'
    ],
    prendasEstrella: ['Sobrecamisas abiertas densas', 'Pantalones de tiro alto con tirantes', 'Cuellos en V o polo abierto'],
    erroresAEvitar: ['Tejidos brillantes o satinados, camisetas cortas que terminen en la barriga.']
  }
};

/**
 * Evalúa con precisión un outfit según todas las leyes de sastrería:
 * Armonía HSL, 60-30-10, jerarquía de formalidad, regla de los tercios y texturas.
 */
export function scoreOutfit(items = []) {
  if (!items || items.length === 0) return { score: 0, feedback: 'Sin prendas seleccionadas', reasons: [] };

  let score = 78;
  const reasons = [];

  // Formalidad
  const formalities = items.map(i => i.formality || 'Smart Casual');
  const hasFormal = formalities.some(f => f.includes('Formal') || f.includes('Business'));
  const hasUltraCasual = formalities.some(f => f.includes('Casual') && !f.includes('Smart'));

  if (hasFormal && hasUltraCasual) {
    score -= 16;
    reasons.push('⚠️ Disonancia de formalidad: mezcla piezas de gala/oficina rígida con elementos ultra-casuales.');
  } else {
    score += 10;
    reasons.push('✓ Coherencia de registro impecable (Smart Casual satorial equilibrado).');
  }

  // Base de Neutros y regla 60-30-10
  const colors = items.map(i => i.color || 'Neutro');
  const neutrals = ['Negro', 'Blanco', 'Gris', 'Gris Carbón', 'Azul Marino', 'Beige', 'Camel', 'Crudo', 'Pizarra'];
  const neutralCount = colors.filter(c => neutrals.some(n => c.toLowerCase().includes(n.toLowerCase()))).length;

  if (neutralCount >= items.length - 1) {
    score += 8;
    reasons.push('✓ Regla 60-30-10 respetada: base sólida de tonos neutros que evita saturación visual.');
  }

  // Mezcla de Texturas y Tejidos
  const fabrics = items.map(i => (i.fabric || '').toLowerCase());
  const hasTexture = fabrics.some(f => f.includes('lana') || f.includes('pana') || f.includes('lino') || f.includes('ante') || f.includes('cuero'));
  const hasSmooth = fabrics.some(f => f.includes('algodón') || f.includes('popelín') || f.includes('sarga') || f.includes('denim'));

  if (hasTexture && hasSmooth) {
    score += 8;
    reasons.push('✓ Contraste táctil de alta gama: combina tejidos con textura rica y bases lisas de calidad.');
  }

  const finalScore = Math.min(99, Math.max(45, score));
  let verdict = 'Conjunto Correcto';
  if (finalScore >= 92) verdict = 'Outfit Impecable Satorial';
  else if (finalScore >= 82) verdict = 'Conjunto Muy Estiloso';
  else if (finalScore < 72) verdict = 'Requiere Ajustes de Armonía';

  return {
    score: finalScore,
    verdict,
    reasons
  };
}
