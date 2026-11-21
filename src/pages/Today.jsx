import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, RefreshCw, Shirt, ScanFace } from 'lucide-react';
import { OCCASIONS, tempLabel } from '../lib/fashion';
import { generate, slots } from '../lib/engine';
import { useData, Page, Empty, useLocal } from '../ui';
import OutfitCard from '../OutfitCard';

export default function Today() {
  const { active, profile, weather, refreshWeather, fb } = useData();
  const [occasion, setOccasion] = useLocal('occasion', 'casual');
  const [seed, setSeed] = useState(0);
  const [idx, setIdx] = useState(0);

  const s = slots(active);
  const enough = s.top.length && s.bottom.length;
  const results = useMemo(() => (enough
    ? generate(active, { profile, weather, occasion, fb, rotation: true }, { count: 6, noise: seed ? 6 : 0, diverse: 1 })
    : []), [active, profile, weather, occasion, fb, seed, enough]);
  const cur = results[idx % Math.max(1, results.length)];
  const hour = new Date().getHours();
  const hi = hour < 13 ? 'Buenos días' : hour < 21 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <Page>
      <div className="head">
        <div>
          <div className="eyebrow">STYLUS</div>
          <h1>{hi}</h1>
        </div>
        <button className="icon-btn" onClick={() => refreshWeather(true)} aria-label="Actualizar tiempo"><RefreshCw size={18} /></button>
      </div>

      <div className="card gold row between">
        {weather ? (
          <>
            <div>
              <div className="score">{weather.now}°<span className="small muted"> · sensación {Math.round(weather.t)}°</span></div>
              <div className="small muted">{weather.label} · {weather.min}°/{weather.max}° {weather.place ? `· ${weather.place}` : ''}</div>
            </div>
            <div className="stack s" style={{ alignItems: 'flex-end' }}>
              <span className="tag">{tempLabel(weather.t)}</span>
              {weather.rain && <span className="tag warn row"><CloudRain size={12} /> lluvia {weather.pop}%</span>}
            </div>
          </>
        ) : <span className="small muted">Cargando el tiempo… (activa la ubicación o pon tu ciudad en Perfil)</span>}
      </div>

      <div className="chips mt">
        {Object.entries(OCCASIONS).map(([k, o]) => (
          <button key={k} className={`chip ${occasion === k ? 'on' : ''}`} onClick={() => { setOccasion(k); setIdx(0); }}>{o.name}</button>
        ))}
      </div>

      {!profile.season && (
        <Link to="/perfil" className="card row mt" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ScanFace className="gold" />
          <div className="grow small"><b>Hazte el escáner</b><div className="muted">Sin tu estación de color y morfología las recomendaciones son genéricas.</div></div>
        </Link>
      )}

      <div className="mt">
        {!enough ? (
          <Empty icon={Shirt} title="Tu armario está vacío">
            Sube al menos unas cuantas partes de arriba, pantalones y calzado en <Link className="gold" to="/armario">Armario</Link>. Puedes fotografiar varias prendas a la vez.
          </Empty>
        ) : cur ? (
          <OutfitCard key={`${idx}-${seed}`} res={cur} occasion={occasion} title={idx === 0 ? 'Tu outfit de hoy' : `Alternativa ${idx}`}
            onNext={() => { if (idx + 1 >= results.length) { setSeed(seed + 1); setIdx(0); } else setIdx(idx + 1); }} />
        ) : <Empty title="Sin combinaciones">No encuentro combinaciones para esta ocasión. Prueba otra o añade más prendas.</Empty>}
      </div>
      {enough && s.shoes.length === 0 && <p className="tiny mt">Consejo: añade calzado para outfits completos.</p>}
    </Page>
  );
}
