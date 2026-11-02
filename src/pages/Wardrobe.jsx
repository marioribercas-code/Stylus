import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Heart, Sparkles, X, 
  Trash2, RotateCw, Tag, Check, Camera, Image as ImageIcon, SlidersHorizontal 
} from 'lucide-react';
import { useWardrobeStore } from '../store/useWardrobeStore';

export default function Wardrobe() {
  const { 
    items, 
    activeFilter, 
    setActiveFilter, 
    searchQuery, 
    setSearchQuery, 
    addItem, 
    deleteItem, 
    toggleFavorite, 
    toggleLaundry,
    incrementWear 
  } = useWardrobeStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  // Formulario de nueva prenda
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'superiores',
    subcategory: 'camisas',
    color: 'Blanco',
    colorHex: '#FFFFFF',
    pattern: 'Liso',
    fabric: 'Algodón 100%',
    season: 'Todas',
    formality: 'Smart Casual',
    brand: '',
    price: 60,
    imageUrl: '',
    notes: ''
  });

  const categories = [
    { id: 'todos', label: 'Todo' },
    { id: 'superiores', label: 'Superiores' },
    { id: 'inferiores', label: 'Pantalones' },
    { id: 'abrigos', label: 'Chaquetas / Capas' },
    { id: 'calzado', label: 'Calzado' },
    { id: 'accesorios', label: 'Accesorios' }
  ];

  // Filtrado de prendas
  const filteredItems = items.filter((item) => {
    const matchesCategory = activeFilter === 'todos' || item.category === activeFilter;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewItem(prev => ({
          ...prev,
          imageUrl: event.target.result
        }));
        // Simular extracción de color por canvas
        extractColorFromImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorFromImage = (imageSrc) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const pixel = ctx.getImageData(25, 25, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setNewItem(prev => ({
        ...prev,
        colorHex: hex
      }));
    };
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.name) return;

    await addItem({
      ...newItem,
      imageUrl: newItem.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
    });

    setIsAddModalOpen(false);
    setNewItem({
      name: '',
      category: 'superiores',
      subcategory: 'camisas',
      color: 'Blanco',
      colorHex: '#FFFFFF',
      pattern: 'Liso',
      fabric: 'Algodón 100%',
      season: 'Todas',
      formality: 'Smart Casual',
      brand: '',
      price: 60,
      imageUrl: '',
      notes: ''
    });
  };

  return (
    <div className="wardrobe-page animate-fade-in">
      {/* Header y Acciones */}
      <div className="wardrobe-header">
        <div>
          <span className="page-kicker">Catálogo Digital</span>
          <h2 className="page-title">Mi Armario ({items.length})</h2>
        </div>
        <button className="btn btn-primary add-item-btn" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Añadir Prenda</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar-wrap">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por prenda, marca o color..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filtros de Categoría */}
      <div className="category-scroll-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${activeFilter === cat.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Prendas */}
      <div className="items-grid">
        {filteredItems.map((item) => {
          const cpw = item.wearCount > 0 ? (item.price / item.wearCount).toFixed(1) : item.price;
          return (
            <div key={item.id} className="wardrobe-card glass-card">
              <div className="card-thumb-area" onClick={() => setSelectedItemDetail(item)}>
                <img src={item.imageUrl} alt={item.name} className="card-img" />
                
                {/* Botón Favorito */}
                <button
                  className={`fav-chip-btn ${item.favorite ? 'is-fav' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  <Heart size={14} fill={item.favorite ? '#ef4444' : 'none'} />
                </button>

                {/* Badge Color */}
                <div 
                  className="color-chip" 
                  style={{ backgroundColor: item.colorHex || '#ccc' }} 
                  title={item.color} 
                />

                {item.inLaundry && (
                  <span className="laundry-badge">En Lavandería</span>
                )}
              </div>

              <div className="card-info" onClick={() => setSelectedItemDetail(item)}>
                <div className="card-info-top">
                  <span className="card-brand">{item.brand || 'Esencial'}</span>
                  <span className="card-formality">{item.formality}</span>
                </div>
                <h4 className="card-name">{item.name}</h4>

                <div className="card-meta-row">
                  <span className="card-price">{item.price}€</span>
                  <span className="card-cpw">
                    <span className="cpw-val">{cpw}€</span>/uso
                  </span>
                </div>
              </div>

              {/* Botón rápido sumar puesta */}
              <div className="card-actions-bar">
                <button 
                  className="wear-quick-btn" 
                  title="Sumar 1 puesta hoy"
                  onClick={() => incrementWear(item.id)}
                >
                  <Check size={13} />
                  <span>{item.wearCount || 0} puestas</span>
                </button>
                <button 
                  className="delete-quick-btn" 
                  title="Eliminar prenda"
                  onClick={() => deleteItem(item.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detalle de Prenda */}
      {selectedItemDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedItemDetail(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedItemDetail.name}</h3>
              <button className="close-btn" onClick={() => setSelectedItemDetail(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="detail-modal-body">
              <div className="detail-img-wrap">
                <img src={selectedItemDetail.imageUrl} alt={selectedItemDetail.name} />
              </div>

              <div className="detail-specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Categoría</span>
                  <span className="spec-val">{selectedItemDetail.category} ({selectedItemDetail.subcategory})</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Marca</span>
                  <span className="spec-val">{selectedItemDetail.brand || 'Sin especificar'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Tejido</span>
                  <span className="spec-val">{selectedItemDetail.fabric}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Temporada</span>
                  <span className="spec-val">{selectedItemDetail.season}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Precio Inicial</span>
                  <span className="spec-val">{selectedItemDetail.price}€</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Rentabilidad (CPW)</span>
                  <span className="spec-val gold-gradient-text">
                    {(selectedItemDetail.price / (selectedItemDetail.wearCount || 1)).toFixed(2)}€ / uso
                  </span>
                </div>
              </div>

              {selectedItemDetail.notes && (
                <div className="detail-notes">
                  <span className="spec-label">Notas de Estilo</span>
                  <p>{selectedItemDetail.notes}</p>
                </div>
              )}

              <div className="modal-footer-actions">
                <button 
                  className={`btn ${selectedItemDetail.inLaundry ? 'btn-secondary' : 'btn-ghost'}`}
                  onClick={() => {
                    toggleLaundry(selectedItemDetail.id);
                    setSelectedItemDetail(prev => ({ ...prev, inLaundry: !prev.inLaundry }));
                  }}
                >
                  <RotateCw size={16} />
                  <span>{selectedItemDetail.inLaundry ? 'Marcar Limpia' : 'Enviar a Lavandería'}</span>
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    incrementWear(selectedItemDetail.id);
                    setSelectedItemDetail(prev => ({ ...prev, wearCount: (prev.wearCount || 0) + 1 }));
                  }}
                >
                  <Check size={16} />
                  <span>Sumar Puesta (+1)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Añadir Prenda */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Sparkles size={18} className="gold-icon" />
                <h3>Digitalizar Prenda</h3>
              </div>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="add-form">
              {/* Selector de Foto */}
              <div className="photo-upload-container">
                {newItem.imageUrl ? (
                  <div className="uploaded-preview">
                    <img src={newItem.imageUrl} alt="Preview" />
                    <button 
                      type="button" 
                      className="change-photo-btn"
                      onClick={() => setNewItem(prev => ({ ...prev, imageUrl: '' }))}
                    >
                      Cambiar foto
                    </button>
                  </div>
                ) : (
                  <label className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                    />
                    <div className="dropzone-content">
                      <Camera size={28} className="gold-icon" />
                      <span className="dropzone-text">Hacer Foto o Subir Prenda</span>
                      <span className="dropzone-sub">La IA analizará el color y silueta automáticamente</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Campos */}
              <div className="form-group">
                <label>Nombre de la Prenda *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Camisa Lino Verde Oliva"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="superiores">Parte Superior</option>
                    <option value="inferiores">Pantalón / Inferior</option>
                    <option value="abrigos">Chaqueta / Capa Exterior</option>
                    <option value="calzado">Calzado</option>
                    <option value="accesorios">Accesorio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marca</label>
                  <input
                    type="text"
                    placeholder="Ej: Massimo Dutti, Zara..."
                    value={newItem.brand}
                    onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color Principal</label>
                  <div className="color-input-wrap">
                    <input
                      type="color"
                      value={newItem.colorHex}
                      onChange={(e) => setNewItem({ ...newItem, colorHex: e.target.value })}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del color"
                      value={newItem.color}
                      onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Precio (€)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 79"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Formalidad</label>
                  <select
                    value={newItem.formality}
                    onChange={(e) => setNewItem({ ...newItem, formality: e.target.value })}
                  >
                    <option value="Casual">Casual</option>
                    <option value="Smart Casual">Smart Casual</option>
                    <option value="Business Formal">Business Formal</option>
                    <option value="Gala / Ceremonia">Gala / Ceremonia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tejido / Material</label>
                  <input
                    type="text"
                    placeholder="Ej: Lino, Algodón, Lana..."
                    value={newItem.fabric}
                    onChange={(e) => setNewItem({ ...newItem, fabric: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary submit-item-btn">
                Guardar Prenda en Armario
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .wardrobe-page {
          padding: 16px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .wardrobe-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .page-kicker {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--accent-gold);
          letter-spacing: 0.1em;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
        }

        .add-item-btn {
          padding: 10px 16px;
          font-size: 13px;
        }

        .search-bar-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 12px 38px 12px 42px;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .search-input:focus {
          border-color: var(--border-gold);
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .category-scroll-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
        }

        .category-tab {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .category-tab.active {
          background: rgba(212, 175, 55, 0.15);
          color: var(--text-gold);
          border-color: var(--border-gold);
          font-weight: 700;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (min-width: 768px) {
          .items-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .items-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .wardrobe-card {
          display: flex;
          flex-direction: column;
          padding: 10px;
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .wardrobe-card:hover {
          transform: translateY(-3px);
          border-color: rgba(212, 175, 55, 0.35);
        }

        .card-thumb-area {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #111116;
          cursor: pointer;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .wardrobe-card:hover .card-img {
          transform: scale(1.04);
        }

        .fav-chip-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .fav-chip-btn.is-fav {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
        }

        .color-chip {
          position: absolute;
          bottom: 8px;
          left: 8px;
          width: 14px;
          height: 14px;
          border-radius: var(--radius-full);
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        }

        .laundry-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(245, 158, 11, 0.9);
          color: #000;
          font-weight: 700;
        }

        .card-info {
          padding: 8px 4px 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          cursor: pointer;
        }

        .card-info-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: var(--text-muted);
        }

        .card-brand {
          font-weight: 600;
          text-transform: uppercase;
        }

        .card-formality {
          font-size: 9px;
          background: rgba(255, 255, 255, 0.05);
          padding: 1px 5px;
          border-radius: 3px;
        }

        .card-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }

        .card-price {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .card-cpw {
          font-size: 11px;
          color: var(--text-muted);
        }

        .cpw-val {
          color: var(--text-gold);
          font-weight: 700;
        }

        .card-actions-bar {
          display: flex;
          gap: 6px;
          margin-top: 4px;
          padding-top: 6px;
          border-top: 1px solid var(--border-subtle);
        }

        .wear-quick-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 8px;
          border-radius: var(--radius-xs);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 11px;
          cursor: pointer;
        }

        .wear-quick-btn:hover {
          background: rgba(212, 175, 55, 0.1);
          color: var(--accent-gold);
        }

        .delete-quick-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-xs);
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .delete-quick-btn:hover {
          color: var(--danger);
          border-color: var(--danger);
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          background: #141419;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 24px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .photo-upload-container {
          margin-bottom: 16px;
        }

        .upload-dropzone {
          display: block;
          border: 2px dashed rgba(212, 175, 55, 0.3);
          border-radius: var(--radius-md);
          padding: 24px;
          text-align: center;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.02);
          transition: border-color var(--transition-fast);
        }

        .upload-dropzone:hover {
          border-color: var(--accent-gold);
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .dropzone-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .dropzone-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        .uploaded-preview {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .uploaded-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .change-photo-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-sm);
          font-size: 11px;
          cursor: pointer;
        }

        .add-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-group input, .form-group select {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .form-group input:focus, .form-group select:focus {
          border-color: var(--border-gold);
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .color-input-wrap {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .color-picker {
          width: 40px;
          height: 38px;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
        }

        .submit-item-btn {
          margin-top: 10px;
          padding: 14px;
          font-size: 14px;
        }

        /* Detail Modal */
        .detail-img-wrap {
          width: 100%;
          height: 220px;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 16px;
        }

        .detail-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          padding: 10px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .spec-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .spec-val {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .detail-notes {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          margin-bottom: 16px;
        }

        .detail-notes p {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .modal-footer-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
