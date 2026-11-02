/**
 * STYLUS Shopping Advisor & Wardrobe Gap Engine (Fase 2)
 * 1. Evaluador Inteligente de Compras ("¿Me lo compro?")
 * 2. Recomendador Proactivo de Prendas Faltantes (Armario Cápsula de Alta Rentabilidad)
 */

import { COLOR_SEASONS, BODY_SHAPES } from './fashionEngine';

// Prendas Esenciales del Armario Cápsula Masculino Ideal
export const MENS_CAPSULE_BLUEPRINT = [
  {
    key: 'sobrecamisa_beige',
    name: 'Sobrecamisa de Lino o Algodón Beige / Crudo',
    category: 'abrigos',
    impact: 'Multiplica x3 las combinaciones de entretiempo',
    estimatedPrice: '60€ - 120€',
    colorHex: '#D7C4A5',
    reason: 'Se usa abierta sobre camisetas o cerrada como camisa casual. Rellena la brecha entre informal y arreglado.',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
    tags: ['Entretiempo', 'Layering', 'Versatilidad Máxima']
  },
  {
    key: 'pantalon_lino_blanco_roto',
    name: 'Pantalón de Lino o Mezcla Blanco Roto / Crema',
    category: 'inferiores',
    impact: 'Elegancia italiana instantánea para primavera y verano',
    estimatedPrice: '70€ - 140€',
    colorHex: '#F1E9DA',
    reason: 'Combina sublime con camisas azules, polos verde oliva y americanas azul marino.',
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&auto=format&fit=crop&q=80',
    tags: ['Verano', 'Sprezzatura', 'Lujo Silencioso']
  },
  {
    key: 'loafers_cuero_marron',
    name: 'Mocasines Penny Loafers en Piel Marrón Coñac',
    category: 'calzado',
    impact: 'El calzado definitivo para transicionar de día a cena formal',
    estimatedPrice: '140€ - 220€',
    colorHex: '#6F3C18',
    reason: 'Mucho más sofisticados que unas zapatillas y menos rígidos que un zapato Oxford de cordones.',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    tags: ['Calzado Clásico', 'Inversión Duradera']
  },
  {
    key: 'polo_punto_azul_marino',
    name: 'Polo de Punto Fino Azul Marino con Cuello Abierto',
    category: 'superiores',
    impact: 'Sustituto sofisticado de la camiseta básica',
    estimatedPrice: '50€ - 90€',
    colorHex: '#1E293B',
    reason: 'El tejido de punto aporta textura de lujo y enmarca la mandíbula mejor que un cuello redondo estándar.',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
    tags: ['Básico Elevado', 'Textura']
  },
  {
    key: 'cazadora_harrington_oliva',
    name: 'Cazadora Harrington o Bomber Ligera Verde Oliva',
    category: 'abrigos',
    impact: 'Aporta juventud y toque militar urbano equilibrado',
    estimatedPrice: '90€ - 160€',
    colorHex: '#3F4E3A',
    reason: 'Excelente estructura en hombros sin resultar pesada. Resiste viento y lluvia ligera.',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    tags: ['Casual Premium', 'Atlántico']
  }
];

/**
 * Evalúa una prenda potencial que el usuario quiere comprarse
 */
export function evaluatePurchaseCandidate(candidate, currentWardrobe = [], userProfile = {}) {
  const { name, category, price = 50, color = 'Neutro', colorHex = '#CCCCCC', fabric = '', brand = '' } = candidate;

  let score = 80;
  const pros = [];
  const cons = [];

  // 1. Detección de redundancia (¿Ya tiene 3 prendas idénticas?)
  const sameCategoryItems = currentWardrobe.filter(item => item.category === category);
  const sameColorItems = sameCategoryItems.filter(item => 
    item.color?.toLowerCase().includes(color.toLowerCase()) || 
    color.toLowerCase().includes(item.color?.toLowerCase())
  );

  if (sameColorItems.length >= 2) {
    score -= 22;
    cons.push(`Ya posees ${sameColorItems.length} prendas muy similares en tu armario (${category} de color ${color}). Riesgo alto de compra redundante.`);
  } else {
    score += 8;
    pros.push(`Rellena un hueco no saturado en tu categoría de ${category}.`);
  }

  // 2. Compatibilidad con Colorimetría (Otoño Oscuro, Invierno, etc.)
  const seasonKey = userProfile.seasonColor ? 'deep_autumn' : 'deep_autumn';
  const seasonData = COLOR_SEASONS[seasonKey] || COLOR_SEASONS['deep_autumn'];
  
  const isPowerColor = seasonData.powerColors?.some(pc => 
    pc.name.toLowerCase().includes(color.toLowerCase()) || 
    color.toLowerCase().includes(pc.name.toLowerCase())
  );

  const isAvoidColor = seasonData.avoidColors?.some(ac => 
    ac.name.toLowerCase().includes(color.toLowerCase()) || 
    color.toLowerCase().includes(ac.name.toLowerCase())
  );

  if (isPowerColor) {
    score += 15;
    pros.push(`¡Color Estrella! El tono ${color} pertenece a tu paleta personal (${seasonData.name}), realzará la luminosidad de tu piel.`);
  } else if (isAvoidColor) {
    score -= 15;
    cons.push(`El color ${color} está marcado como desfavorable en tu colorimetría (puede apagar tu rostro o desentonar).`);
  } else {
    pros.push(`Color neutro o compatible con la mayoría de tus prendas.`);
  }

  // 3. Cálculo de nuevos outfits desbloqueados
  // Si compras una parte de abajo, multiplica las de arriba; si compras un abrigo, se combina con todo.
  let potentialOutfits = 6;
  if (category === 'abrigos') {
    potentialOutfits = Math.min(18, currentWardrobe.filter(i => i.category === 'superiores').length * 2);
  } else if (category === 'superiores') {
    potentialOutfits = Math.min(14, currentWardrobe.filter(i => i.category === 'inferiores').length * 2);
  } else if (category === 'inferiores') {
    potentialOutfits = Math.min(16, currentWardrobe.filter(i => i.category === 'superiores').length * 2);
  } else if (category === 'calzado') {
    potentialOutfits = Math.min(20, currentWardrobe.filter(i => i.category === 'inferiores').length * 3);
  }

  pros.push(`Desbloqueará aproximadamente ${potentialOutfits} combinaciones nuevas con tu armario actual.`);

  // 4. Rentabilidad Proyectada (Coste Por Uso estimado)
  const numPrice = Number(price) || 60;
  const estimatedWearsYear1 = category === 'calzado' ? 40 : category === 'inferiores' ? 35 : 25;
  const projectedCPW = (numPrice / estimatedWearsYear1).toFixed(2);

  if (projectedCPW < 3) {
    pros.push(`Rentabilidad extraordinaria: Coste proyectado de solo ${projectedCPW}€ por puesta en el primer año.`);
    score += 5;
  } else {
    pros.push(`Coste proyectado: ${projectedCPW}€ por puesta (inversión de gama media/alta).`);
  }

  // Puntuación final y veredicto
  const finalScore = Math.min(98, Math.max(35, score));
  let verdict = 'Buena Opción';
  let badgeColor = 'gold';

  if (finalScore >= 88) {
    verdict = 'Compra Maestra (Muy Recomendada)';
    badgeColor = 'success';
  } else if (finalScore >= 72) {
    verdict = 'Buena Adición con Potencial';
    badgeColor = 'gold';
  } else {
    verdict = 'Compra Dudosa / Capricho Redundante';
    badgeColor = 'danger';
  }

  return {
    score: finalScore,
    verdict,
    badgeColor,
    projectedCPW,
    unlockedOutfits: potentialOutfits,
    pros,
    cons,
    candidate
  };
}

/**
 * Analiza el armario del usuario y recomienda las piezas clave prioritarias que le faltan
 */
export function getRecommendedGaps(currentWardrobe = []) {
  const recommendations = [];

  // Ver si le falta calzado marrón formal/smart
  const hasBrownShoes = currentWardrobe.some(i => i.category === 'calzado' && (i.color?.toLowerCase().includes('marrón') || i.color?.toLowerCase().includes('cuero')));
  if (!hasBrownShoes) {
    recommendations.push(MENS_CAPSULE_BLUEPRINT.find(b => b.key === 'loafers_cuero_marron'));
  }

  // Ver si le falta sobrecamisa
  const hasOvershirt = currentWardrobe.some(i => i.subcategory === 'sobrecamisas' || i.name?.toLowerCase().includes('sobrecamisa'));
  if (!hasOvershirt) {
    recommendations.push(MENS_CAPSULE_BLUEPRINT.find(b => b.key === 'sobrecamisa_beige'));
  }

  // Ver si le faltan pantalones claros
  const hasLightPants = currentWardrobe.some(i => i.category === 'inferiores' && (i.color?.toLowerCase().includes('blanco') || i.color?.toLowerCase().includes('crema') || i.color?.toLowerCase().includes('arena')));
  if (!hasLightPants) {
    recommendations.push(MENS_CAPSULE_BLUEPRINT.find(b => b.key === 'pantalon_lino_blanco_roto'));
  }

  // Siempre sugerir al menos 3 items
  MENS_CAPSULE_BLUEPRINT.forEach(item => {
    if (recommendations.length < 3 && !recommendations.some(r => r?.key === item.key)) {
      recommendations.push(item);
    }
  });

  return recommendations.filter(Boolean);
}
