# CheckPoint Games - Design Guidelines

## Design Approach

**Reference-Based:** Drawing inspiration from Steam, Epic Games Store, and modern gaming e-commerce platforms, combined with Brazilian e-commerce best practices (Mercado Livre aesthetic for trust signals).

**Core Principle:** Create an immersive gaming experience that balances visual impact with conversion-focused e-commerce functionality.

---

## Typography System

**Font Families:**
- Primary: Inter (UI elements, body text, pricing)
- Accent: Rajdhani or Orbitron (headers, game titles) - bold, tech-forward gaming aesthetic

**Hierarchy:**
- Hero Titles: 3xl to 5xl, bold/black weight
- Section Headers: 2xl to 3xl, semibold
- Game Titles: lg to xl, semibold
- Body/Descriptions: base, regular
- Prices: xl to 2xl, bold (emphasize value)
- Metadata: sm, medium (categories, status badges)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro-spacing (buttons, cards): p-4, gap-2
- Component spacing: p-6, p-8
- Section padding: py-12, py-16, py-24
- Grid gaps: gap-4, gap-6, gap-8

**Container Strategy:**
- Max-width: max-w-7xl for main content
- Sidebars: w-64 to w-80 (filters, admin navigation)
- Product grids: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5

---

## Component Library

### Customer Interface

**Hero Section:**
- Full-width banner showcasing featured/new releases
- Large hero image (1920x600) with prominent game artwork
- Overlay gradient for text legibility
- Primary CTA: "Ver Ofertas" / "Explorar Jogos"
- Trust indicators: "Entrega Imediata" + "Pagamento Seguro via Mercado Pago"

**Game Catalog:**
- Grid layout with game cards (aspect ratio 16:9 for cover images)
- Each card includes: cover image, title, price, discount badge (if applicable), platform icons
- Hover state: slight scale transform, show "Adicionar ao Carrinho" button
- Quick view option showing game details in modal

**Filters Sidebar:**
- Sticky sidebar (left side on desktop, collapsible drawer on mobile)
- Search bar at top
- Category checkboxes with counts
- Price range section:
  - Dual-handle slider for visual selection
  - Min/Max input fields (R$ formatting)
  - "Aplicar Filtro" button
- Active filters display with clear-all option

**Product Detail Page:**
- Large cover image gallery (primary + screenshots)
- Title, platform badges, category tags
- Price display with original/discounted pricing
- Prominent "Comprar Agora" button
- Description section with formatted text
- System requirements (if applicable)
- Delivery information: "Chave enviada por email imediatamente"

**Shopping Cart:**
- Slide-out drawer (right side)
- Mini cart icon in header with item count badge
- Line items: thumbnail, title, price, remove action
- Subtotal calculation
- "Finalizar Compra" primary action

**Checkout Flow:**
- Single-page checkout or stepped process
- Order summary sidebar (sticky on desktop)
- User authentication check
- Payment method selection (pre-configured for Mercado Pago)
- Final "Pagar via Mercado Pago" button redirects to payment link

**User Account:**
- Dashboard showing recent orders
- Order history table: ID, date, total, status badges
- Order details: game keys display (copy-to-clipboard functionality)
- Profile management

### Admin Interface

**Admin Navigation:**
- Vertical sidebar with icons + labels
- Sections: Dashboard, Jogos, Pedidos, Chaves, Usuários
- Clear visual separation from customer interface

**Games Management:**
- Data table with columns: Thumbnail, Título, Categoria, Preço, Desconto, Status, Ações
- Action buttons: Editar, Excluir (with confirmation modal)
- "Adicionar Novo Jogo" prominent button
- Bulk actions: aplicar desconto, ativar/desativar

**Game Form (Add/Edit):**
- Multi-section form:
  - Informações Básicas: título, descrição (rich text editor)
  - Categoria: dropdown selection
  - Preço: valor original, desconto (%), preço final calculado
  - Imagens: upload cover + screenshots (drag-drop zone)
  - Status: toggle ativo/bloqueado
- Save/Cancel actions

**Orders Management:**
- Table view: ID, Cliente, Data, Total, Status, Ações
- Status filters: Pendente, Finalizado, Cancelado
- Status badges with visual distinction
- Order detail modal showing items, keys, payment info

**Keys Management:**
- Table: Jogo, Chave, Status, Data Adicionada
- Add keys interface: select game, bulk input (textarea for multiple keys)
- Status indicators: Ativo, Usado, Cancelado
- Filter by game and status

**Users Management:**
- User table: Nome, Email, Data Registro, Status, Ações
- Block/Unblock toggle
- View user orders history

---

## Images

**Hero Section:** 
- Large banner image (1920x600) featuring popular game artwork or gaming setup
- Dynamic rotation of featured games
- Overlay with subtle gradient for text contrast

**Game Cards:**
- Cover images (460x215 recommended, 16:9 ratio)
- High-quality game artwork from publishers

**Product Details:**
- Primary cover (large, 800x400)
- Screenshot gallery (4-6 images, 1920x1080)

**Admin:**
- Placeholder thumbnails for games without images
- Upload preview zones

---

## Key UX Patterns

**Price Display:**
- Original price with strikethrough when discounted
- Discount percentage badge (e.g., "-30%")
- Final price in larger, bold typography

**Status Communication:**
- Badges for all statuses (games, orders, keys, users)
- Visual coding: subtle backgrounds, no harsh borders

**Loading States:**
- Skeleton screens for catalog during fetch
- Spinner for checkout/payment actions

**Empty States:**
- Friendly illustrations for empty cart, no search results
- Clear call-to-action to browse games

**Trust Signals:**
- Mercado Pago logo prominent in footer and checkout
- "Entrega Imediata" messaging throughout
- Security badges near payment

**Responsive Behavior:**
- Mobile: single-column layouts, hamburger menu, bottom sheet filters
- Tablet: 2-3 column grids
- Desktop: full multi-column, persistent sidebars

---

## Accessibility
- Semantic HTML throughout
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus indicators on interactive elements
- Alt text for all game images

This comprehensive design system ensures CheckPoint Games delivers a professional, conversion-optimized gaming e-commerce experience while maintaining brand authenticity in the Brazilian gaming market.