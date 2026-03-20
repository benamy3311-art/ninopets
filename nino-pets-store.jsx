import { useState, useReducer, useCallback, useMemo, useEffect } from "react";

// ============================================================
// === ICONOS SVG INLINE ===
// ============================================================

const I = ({ children, size = 20, className = "", fill = "none", sw = 1.8 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const Icons = {
  Search: (p) => <I {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></I>,
  Cart: (p) => <I {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></I>,
  Plus: (p) => <I {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>,
  Minus: (p) => <I {...p}><line x1="5" y1="12" x2="19" y2="12"/></I>,
  X: (p) => <I {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>,
  Trash: (p) => <I {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></I>,
  Star: (p) => <I {...p} fill="#FBBF24" sw={0}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></I>,
  Heart: (p) => <I {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></I>,
  Mail: (p) => <I {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/></I>,
  Phone: (p) => <I {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></I>,
  MapPin: (p) => <I {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></I>,
  Insta: (p) => <I {...p}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></I>,
  Arrow: (p) => <I {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></I>,
  Truck: (p) => <I {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></I>,
  Shield: (p) => <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>,
  Check: (p) => <I {...p}><polyline points="20 6 9 17 4 12"/></I>,
  Paw: ({ size = 20, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" stroke="none">
      <ellipse cx="7.5" cy="7" rx="2.5" ry="3"/>
      <ellipse cx="16.5" cy="7" rx="2.5" ry="3"/>
      <ellipse cx="4" cy="13" rx="2" ry="2.5"/>
      <ellipse cx="20" cy="13" rx="2" ry="2.5"/>
      <path d="M12 22c-3 0-5.5-2-6.5-4.5-.7-1.7.3-3.5 1.5-4.5 1.5-1.2 3.2-2 5-2s3.5.8 5 2c1.2 1 2.2 2.8 1.5 4.5C17.5 20 15 22 12 22z"/>
    </svg>
  ),
};

// ============================================================
// === DATOS / MOCK DATA ===
// TODO: Reemplazar por fetch a /api/products y /api/categories
// ============================================================

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "food", label: "Alimento" },
  { id: "toys", label: "Juguetes" },
  { id: "accessories", label: "Accesorios" },
  { id: "hygiene", label: "Higiene" },
  { id: "snacks", label: "Snacks" },
];

// Colores pastel para los placeholder de productos
const PRODUCT_COLORS = [
  { bg: "#FDE8EF", accent: "#E8578A" },
  { bg: "#E8F0FE", accent: "#5B7FD6" },
  { bg: "#FFF3CD", accent: "#D4A017" },
  { bg: "#E8F5E8", accent: "#5BA55B" },
  { bg: "#F3E8FE", accent: "#8B5BD6" },
  { bg: "#FEF0E8", accent: "#D67B5B" },
  { bg: "#E8FEFE", accent: "#5BBFD6" },
  { bg: "#FEE8F8", accent: "#D65BB8" },
  { bg: "#EDFDE8", accent: "#6BD65B" },
  { bg: "#FDE8E8", accent: "#D65B5B" },
  { bg: "#E8EDFE", accent: "#5B6BD6" },
  { bg: "#FEFDE8", accent: "#C4B85B" },
];

const PRODUCTS = [
  {
    id: "prod-001",
    name: "Chunky Adulto Pollo",
    description: "Alimento premium para perros adultos. Nutrición completa con proteína real de pollo.",
    price: 89900,
    category: "food",
    rating: 4.8,
    badge: "Popular",
    colorIndex: 0,
  },
  {
    id: "prod-002",
    name: "Snacks de Salmón Deshidratado",
    description: "Premios ricos en omega-3 para un pelaje brillante. Ingrediente único.",
    price: 34500,
    category: "snacks",
    rating: 4.6,
    badge: null,
    colorIndex: 1,
  },
  {
    id: "prod-003",
    name: "Pelota Indestructible Bounce",
    description: "Caucho natural ultra resistente para masticadores intensos. Rebote alto.",
    price: 28000,
    category: "toys",
    rating: 4.9,
    badge: "Nuevo",
    colorIndex: 2,
  },
  {
    id: "prod-004",
    name: "Cuerda Dental Multicolor",
    description: "Juguete trenzado que limpia dientes mientras juega. Algodón 100% natural.",
    price: 19500,
    category: "toys",
    rating: 4.3,
    badge: null,
    colorIndex: 3,
  },
  {
    id: "prod-005",
    name: "Collar Táctico con AirTag",
    description: "Collar resistente con soporte integrado para AirTag. Ideal para paseos seguros.",
    price: 72000,
    category: "accessories",
    rating: 4.7,
    badge: "Premium",
    colorIndex: 4,
  },
  {
    id: "prod-006",
    name: "Cama Ortopédica CloudNest",
    description: "Espuma viscoelástica con funda lavable. Ideal para perros senior.",
    price: 159000,
    category: "accessories",
    rating: 4.9,
    badge: "Popular",
    colorIndex: 5,
  },
  {
    id: "prod-007",
    name: "Cepillo Deslanador Vapor",
    description: "Cepillo con vapor integrado para un deslanado suave y eficiente.",
    price: 45000,
    category: "hygiene",
    rating: 4.5,
    badge: "Nuevo",
    colorIndex: 6,
  },
  {
    id: "prod-008",
    name: "Kit Dental Completo",
    description: "Cepillo ergonómico + pasta enzimática sabor pollo. Combate placa y mal aliento.",
    price: 38000,
    category: "hygiene",
    rating: 4.4,
    badge: null,
    colorIndex: 7,
  },
  {
    id: "prod-009",
    name: "Pechera Absorción de Impactos",
    description: "Diseño ergonómico que distribuye la presión. Bandas reflectivas nocturnas.",
    price: 68000,
    category: "accessories",
    rating: 4.6,
    badge: null,
    colorIndex: 8,
  },
  {
    id: "prod-010",
    name: "Agility Gold Premium",
    description: "Alimento súper premium con proteínas de alta digestibilidad. Fórmula avanzada.",
    price: 125000,
    category: "food",
    rating: 4.7,
    badge: null,
    colorIndex: 9,
  },
  {
    id: "prod-011",
    name: "Catnip Orgánico",
    description: "Hierba gatera premium 100% orgánica. Estimulación sensorial para tu gatito.",
    price: 15000,
    category: "toys",
    rating: 4.2,
    badge: null,
    colorIndex: 10,
  },
  {
    id: "prod-012",
    name: "Arena Calabaza Premium",
    description: "Arena aglomerante de tofu con aroma natural de calabaza. Biodegradable.",
    price: 42000,
    category: "hygiene",
    rating: 4.8,
    badge: "Popular",
    colorIndex: 11,
  },
];

// TODO: Traer datos de contacto desde /api/store-info
const STORE_INFO = {
  name: "Nino Pets",
  tagline: "Lo mejor para tu peludito",
  email: "hola@ninopets.com",
  phone: "+57 300 123 4567",
  addressCO: "Bogotá, Colombia",
  addressVE: "Maracaibo, Venezuela",
  instagram: "@ninopet_s",
  linktree: "linktr.ee/ninopets",
};

// ============================================================
// === UTILIDADES ===
// ============================================================

const formatPrice = (val) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);

// ============================================================
// === HOOKS PERSONALIZADOS ===
// ============================================================

const CART_ACTIONS = { ADD: "ADD", REMOVE: "REMOVE", UPDATE_QTY: "UPDATE_QTY", CLEAR: "CLEAR" };

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const existing = state.find((i) => i.product.id === action.payload.id);
      if (existing) return state.map((i) => i.product.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...state, { product: action.payload, quantity: 1 }];
    }
    case CART_ACTIONS.REMOVE:
      return state.filter((i) => i.product.id !== action.payload);
    case CART_ACTIONS.UPDATE_QTY:
      if (action.payload.quantity <= 0) return state.filter((i) => i.product.id !== action.payload.id);
      return state.map((i) => i.product.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i);
    case CART_ACTIONS.CLEAR:
      return [];
    default:
      return state;
  }
}

function useCart() {
  const [items, dispatch] = useReducer(cartReducer, []);
  const addItem = useCallback((product) => dispatch({ type: CART_ACTIONS.ADD, payload: product }), []);
  const removeItem = useCallback((id) => dispatch({ type: CART_ACTIONS.REMOVE, payload: id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: CART_ACTIONS.UPDATE_QTY, payload: { id, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), []);
  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.price * i.quantity, 0), [items]);
  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal };
}

function useProductFilters(products) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  // TODO: Mover filtrado al backend: /api/products?category=X&search=Y
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, searchQuery, activeCategory]);
  return { searchQuery, setSearchQuery, activeCategory, setActiveCategory, filteredProducts };
}

// ============================================================
// === COMPONENTES UI BASE (Átomos) ===
// ============================================================

function ProductPlaceholderImage({ name, colorIndex = 0, className = "" }) {
  const colors = PRODUCT_COLORS[colorIndex % PRODUCT_COLORS.length];
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${className}`} style={{ background: colors.bg }}>
      <Icons.Paw size={28} className="opacity-30" style={{ color: colors.accent }} />
      <span className="text-xs font-semibold tracking-wide opacity-50 text-center px-3 leading-tight" style={{ color: colors.accent }}>{name}</span>
    </div>
  );
}

function Badge({ children }) {
  const c =
    children === "Nuevo" ? { bg: "#E8F0FE", text: "#3B5FCC" } :
    children === "Premium" ? { bg: "#F3E8FE", text: "#7C3AED" } :
    { bg: "#FFF3CD", text: "#92700C" }; // Popular
  return (
    <span className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full" style={{ background: c.bg, color: c.text }}>
      {children}
    </span>
  );
}

function RatingStars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icons.Star size={12} />
      <span className="text-xs font-medium text-neutral-500">{rating}</span>
    </span>
  );
}

function QuantityControl({ quantity, onChange }) {
  return (
    <div className="flex items-center rounded-full overflow-hidden" style={{ border: "1px solid #E5E5E5" }}>
      <button onClick={() => onChange(quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors text-neutral-400">
        <Icons.Minus size={14} />
      </button>
      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-neutral-800">{quantity}</span>
      <button onClick={() => onChange(quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors text-neutral-400">
        <Icons.Plus size={14} />
      </button>
    </div>
  );
}

// ============================================================
// === COMPONENTES DE SECCIÓN ===
// ============================================================

// --- Logo SVG inspirado en la marca Nino Pets ---
function NinoLogo({ size = 36 }) {
  return (
    <div className="flex items-center justify-center rounded-full shadow-sm" style={{ width: size, height: size, background: "#FCE94F" }}>
      <Icons.Paw size={size * 0.48} className="text-purple-600" />
    </div>
  );
}

function Header({ searchQuery, onSearchChange, cartItemCount, onCartToggle }) {
  const [focused, setFocused] = useState(false);
  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <NinoLogo size={38} />
            <div className="hidden sm:block">
              <h1 className="text-[17px] font-bold text-neutral-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                NINO PETS
              </h1>
              <p className="text-[10px] tracking-wider text-neutral-400 mt-0.5 font-medium">{STORE_INFO.tagline}</p>
            </div>
          </div>

          {/* Search */}
          <div className={`relative flex-1 max-w-sm mx-3 sm:mx-8 transition-all duration-300 ${focused ? "max-w-md" : ""}`}>
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused ? "text-purple-500" : "text-neutral-300"}`}>
              <Icons.Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm transition-all duration-200 outline-none"
              style={{
                background: focused ? "#fff" : "#F5F5F5",
                border: focused ? "1.5px solid #7C3AED" : "1.5px solid transparent",
                color: "#1a1a1a",
              }}
            />
          </div>

          {/* Cart */}
          <button onClick={onCartToggle} className="relative p-2.5 rounded-2xl hover:bg-neutral-50 transition-all group" aria-label="Carrito">
            <span className="text-neutral-600 group-hover:text-purple-600 transition-colors"><Icons.Cart size={22} /></span>
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md" style={{ background: "#7C3AED" }}>
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroBanner() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FCE94F 0%, #FFF3A0 50%, #FFEEB8 100%)" }}>
      {/* Decorative shapes */}
      <div className="absolute top-6 right-8 w-20 h-20 rounded-full opacity-20" style={{ background: "#7C3AED" }} />
      <div className="absolute bottom-4 left-12 w-12 h-12 rounded-full opacity-15" style={{ background: "#E8578A" }} />
      <div className="absolute top-1/2 right-1/4 w-8 h-8 opacity-10" style={{ background: "#5B7FD6", borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(124,58,237,0.1)" }}>
            <Icons.Paw size={14} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 tracking-wide">Bogotá & Maracaibo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-3" style={{ fontFamily: "var(--font-display)", color: "#3B2070" }}>
            Lo mejor para tu
            <br />peludito en un
            <br />mismo lugar
          </h2>
          <p className="text-sm sm:text-base max-w-md leading-relaxed mb-6" style={{ color: "#5B4299" }}>
            Alimento, snacks, juguetes y accesorios seleccionados con amor. Envíos a toda Colombia y Venezuela.
          </p>
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm" style={{ color: "#6B5BA7" }}>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.6)" }}>
              <Icons.Truck size={14} /> Envío rápido
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.6)" }}>
              <Icons.Shield size={14} /> Garantía total
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.6)" }}>
              <Icons.Paw size={14} className="text-purple-600" /> 100% confiable
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap" style={{ scrollbarWidth: "none" }}>
      {categories.map((cat) => {
        const active = cat.id === activeCategory;
        return (
          <button key={cat.id} onClick={() => onSelect(cat.id)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: active ? "#7C3AED" : "#F5F5F5",
              color: active ? "#fff" : "#666",
              border: "none",
            }}>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [adding, setAdding] = useState(false);
  const handleAdd = () => { setAdding(true); onAddToCart(product); setTimeout(() => setAdding(false), 700); };

  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ease-out hover:-translate-y-1" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}>
      {/* Image placeholder */}
      <div className="relative aspect-square overflow-hidden">
        <ProductPlaceholderImage name={product.name} colorIndex={product.colorIndex} />
        {product.badge && <div className="absolute top-3 left-3"><Badge>{product.badge}</Badge></div>}
        {/* TODO: Botón de favoritos con persistencia */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm" aria-label="Favorito">
          <Icons.Heart size={14} className="text-neutral-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#B0B0B0" }}>
            {CATEGORIES.find((c) => c.id === product.category)?.label}
          </span>
          <RatingStars rating={product.rating} />
        </div>
        <h3 className="font-semibold text-neutral-800 text-sm leading-snug mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
        </h3>
        <p className="text-[11px] text-neutral-400 leading-relaxed mb-3 flex-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-bold text-neutral-900">{formatPrice(product.price)}</span>
          <button onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95"
            style={{
              background: adding ? "#16A34A" : "#7C3AED",
              color: "#fff",
            }}>
            {adding ? <><Icons.Check size={13} /> Listo</> : <><Icons.Plus size={13} /> Agregar</>}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "#F5F0FF" }}>
        <Icons.Search size={24} className="text-purple-300" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-600 mb-1" style={{ fontFamily: "var(--font-display)" }}>No encontramos productos</h3>
      <p className="text-sm text-neutral-400">Intenta con otra búsqueda o categoría.</p>
    </div>
  );
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((p, i) => (
        <div key={p.id} className="fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
          <ProductCard product={p} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}

function CartDrawer({ isOpen, onClose, cart }) {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = cart;
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    if (isOpen) { window.addEventListener("keydown", h); document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }} />
      <aside className={`fixed top-0 right-0 z-50 h-full w-full max-w-md flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`} style={{ background: "#FAFAFA", boxShadow: "-8px 0 30px rgba(0,0,0,0.08)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <div className="flex items-center gap-2.5">
            <span style={{ color: "#7C3AED" }}><Icons.Cart size={20} /></span>
            <h2 className="text-lg font-bold text-neutral-800" style={{ fontFamily: "var(--font-display)" }}>Tu carrito</h2>
            {items.length > 0 && <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">{items.length}</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors">
            <Icons.X size={18} className="text-neutral-400" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center -mt-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "#F5F0FF" }}>
                <Icons.Paw size={32} className="text-purple-300" />
              </div>
              <h3 className="text-lg font-bold text-neutral-700 mb-1" style={{ fontFamily: "var(--font-display)" }}>¡Vacío por ahora!</h3>
              <p className="text-sm text-neutral-400 max-w-[220px] mb-5">Explora la tienda y encuentra algo especial para tu peludito.</p>
              <button onClick={onClose} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95" style={{ background: "#7C3AED" }}>
                Explorar <Icons.Arrow size={15} />
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const colors = PRODUCT_COLORS[item.product.colorIndex % PRODUCT_COLORS.length];
                return (
                  <li key={item.product.id} className="flex gap-3 p-3 bg-white rounded-2xl" style={{ border: "1px solid #F0F0F0" }}>
                    <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center" style={{ background: colors.bg }}>
                      <Icons.Paw size={20} style={{ color: colors.accent }} className="opacity-40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-neutral-800 truncate">{item.product.name}</h4>
                      <p className="text-sm font-bold mt-0.5" style={{ color: "#7C3AED" }}>{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-2.5 mt-2">
                        <QuantityControl quantity={item.quantity} onChange={(q) => updateQuantity(item.product.id, q)} />
                        <button onClick={() => removeItem(item.product.id)} className="p-1.5 text-neutral-300 hover:text-red-400 transition-colors">
                          <Icons.Trash size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-neutral-700 whitespace-nowrap self-start">{formatPrice(item.product.price * item.quantity)}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 space-y-3" style={{ borderTop: "1px solid #F0F0F0" }}>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 text-sm">Subtotal</span>
              <span className="text-xl font-bold text-neutral-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-neutral-400">Envío calculado en el checkout.</p>
            {/* TODO: Integrar pasarela de pago (Stripe, MercadoPago, etc.) */}
            <button onClick={() => alert("🐾 ¡Checkout próximamente! Estamos en beta.")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-bold text-white transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #9B5DE5 100%)" }}>
              Ir al checkout <Icons.Arrow size={16} />
            </button>
            <button onClick={clearCart} className="w-full text-center text-xs text-neutral-400 hover:text-red-400 transition-colors py-1">Vaciar carrito</button>
          </div>
        )}
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-16" style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <NinoLogo size={32} />
              <span className="font-bold text-neutral-800 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>NINO PETS</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Lo mejor para tu peludito en un mismo lugar. Alimento, snacks, juguetes y accesorios con envíos a Colombia y Venezuela.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-neutral-600 text-xs mb-3 uppercase tracking-widest">Contacto</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li className="flex items-center gap-2"><span className="text-purple-400"><Icons.Mail size={14} /></span>{STORE_INFO.email}</li>
              <li className="flex items-center gap-2"><span className="text-purple-400"><Icons.Phone size={14} /></span>{STORE_INFO.phone}</li>
              <li className="flex items-center gap-2"><span className="text-purple-400"><Icons.MapPin size={14} /></span>{STORE_INFO.addressCO}</li>
              <li className="flex items-center gap-2"><span className="text-purple-400"><Icons.MapPin size={14} /></span>{STORE_INFO.addressVE}</li>
              <li className="flex items-center gap-2"><span className="text-purple-400"><Icons.Insta size={14} /></span>{STORE_INFO.instagram}</li>
            </ul>
          </div>

          {/* TODO: Agregar páginas internas (Nosotros, FAQ, Términos, Blog) */}
          <div>
            <h4 className="font-semibold text-neutral-600 text-xs mb-3 uppercase tracking-widest">Info</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="hover:text-purple-500 cursor-pointer transition-colors">Sobre nosotros</li>
              <li className="hover:text-purple-500 cursor-pointer transition-colors">Política de envío</li>
              <li className="hover:text-purple-500 cursor-pointer transition-colors">Devoluciones</li>
              <li className="hover:text-purple-500 cursor-pointer transition-colors">Preguntas frecuentes</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center" style={{ borderTop: "1px solid #EBEBEB" }}>
          <p className="text-xs text-neutral-300">
            © 2026 Nino Pets. Hecho con mucho amor para tu peludito.
            <span className="block mt-1">Beta v0.1</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// === APP PRINCIPAL ===
// TODO: React Router (/productos, /producto/:id, /checkout, /cuenta)
// TODO: Autenticación (AuthProvider)
// TODO: Notificaciones toast
// TODO: Wishlist / favoritos persistentes
// ============================================================

export default function App() {
  const cart = useCart();
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory, filteredProducts } = useProductFilters(PRODUCTS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = useCallback(() => setIsCartOpen((p) => !p), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFFFF", fontFamily: "var(--font-body)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap');
        :root {
          --font-display: 'Outfit', 'DM Sans', system-ui, sans-serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: fadeInUp 0.4s ease-out both; }
        * { box-sizing: border-box; }
        ::selection { background: #E8DCFF; color: #3B2070; }
      `}</style>

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} cartItemCount={cart.totalItems} onCartToggle={toggleCart} />
      <HeroBanner />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800" style={{ fontFamily: "var(--font-display)" }}>Nuestros productos</h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              {filteredProducts.length} resultado{filteredProducts.length !== 1 && "s"}
              {activeCategory !== "all" && ` en ${CATEGORIES.find((c) => c.id === activeCategory)?.label.toLowerCase()}`}
            </p>
          </div>
          <CategoryFilter categories={CATEGORIES} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>
        <ProductGrid products={filteredProducts} onAddToCart={cart.addItem} />
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} cart={cart} />
    </div>
  );
}
