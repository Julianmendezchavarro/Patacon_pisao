const isLocalPreview =
  ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
  window.location.port !== '3000';

const API_BASE = window.__API_BASE__ ||
  (window.location.protocol === 'file:' || isLocalPreview
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`);
const page = document.body.dataset.page;
const STORAGE_KEYS = {
  user: 'patacon_user',
  cart: 'patacon_cart'
};

const CATEGORY_CLASS_MAP = {
  Entradas: 'entradas',
  Patacones: 'patacones',
  'Perros Calientes': 'perros-calientes',
  Hamburguesas: 'hamburguesas',
  Salchipapas: 'salchipapas',
  'Menu Infantil': 'menu-infantil',
  Especiales: 'especiales',
  Adiciones: 'adiciones',
  Bebidas: 'bebidas',
  'Sodas Italianas': 'sodas-italianas'
};

function formatCurrency(value) {
  const amount = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

  return `$${amount}`;
}

function getStoredJson(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function setStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStoredUser() {
  return getStoredJson(STORAGE_KEYS.user, null);
}

function getStoredCart() {
  return getStoredJson(STORAGE_KEYS.cart, []);
}

function setMessage(element, message, type = '') {
  if (!element) return;
  element.textContent = message;
  element.className = `form-message ${type}`.trim();
}

async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
  } catch (error) {
    throw new Error('No se pudo conectar con el servidor. Inicia MySQL en XAMPP y luego ejecuta el backend en el puerto 3000.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Ocurrio un error en la solicitud.');
  }

  return data;
}

function setupTiltEffects(root = document) {
  const cards = root.querySelectorAll('[data-tilt]');

  if (!window.matchMedia('(pointer:fine)').matches) {
    cards.forEach((card) => {
      card.style.transform = '';
      card.dataset.tiltReady = '1';
    });
    return;
  }

  cards.forEach((card) => {
    if (card.dataset.tiltReady === '1') return;

    const resetTilt = () => {
      card.style.transform = '';
    };

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;

      card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('blur', resetTilt);
    card.dataset.tiltReady = '1';
  });
}

function setupRegister() {
  const form = document.getElementById('register-form');
  const message = document.getElementById('register-message');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await apiRequest(`${API_BASE}/auth/registro`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setStoredJson(STORAGE_KEYS.user, data.user);
      setMessage(message, 'Cuenta creada correctamente. Ahora puedes explorar el menu.', 'success');
      form.reset();
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 900);
    } catch (error) {
      setMessage(message, error.message, 'error');
    }
  });
}

function setupLogin() {
  const form = document.getElementById('login-form');
  const message = document.getElementById('login-message');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await apiRequest(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setStoredJson(STORAGE_KEYS.user, data.user);
      setMessage(message, `Bienvenido, ${data.user.nombre}.`, 'success');
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 700);
    } catch (error) {
      setMessage(message, error.message, 'error');
    }
  });
}

function getCategoryClass(category) {
  return CATEGORY_CLASS_MAP[category] || 'general';
}

function createProductCard(producto, onAdd) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-tilt', '');

  const media = producto.imagen
    ? `
      <div class="product-media media-tone--${getCategoryClass(producto.categoria)}">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <span class="product-chip">${producto.categoria}</span>
      </div>
    `
    : `
      <div class="product-media media-tone--${getCategoryClass(producto.categoria)}">
        <div class="product-placeholder">
          <span class="product-chip">${producto.categoria}</span>
          <h4>${producto.nombre}</h4>
          <p>Espacio listo para una foto grande del plato.</p>
        </div>
      </div>
    `;

  card.innerHTML = `
    ${media}
    <div class="product-content">
      <div class="product-top">
        <h3>${producto.nombre}</h3>
        <span class="product-price">${formatCurrency(producto.precio)}</span>
      </div>
      <p class="product-description">${producto.descripcion || 'Sin descripcion disponible.'}</p>
      <div class="product-actions">
        <button class="button primary" type="button">Agregar al carrito</button>
      </div>
    </div>
  `;

  card.querySelector('button').addEventListener('click', () => onAdd(producto));
  return card;
}

function saveCart(cart) {
  setStoredJson(STORAGE_KEYS.cart, cart);
}

function renderCart(cart) {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItems || !cartCount || !cartTotal) return;

  const count = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const total = cart.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

  cartCount.textContent = `${count} producto${count === 1 ? '' : 's'}`;
  cartTotal.textContent = formatCurrency(total);

  if (cart.length === 0) {
    cartItems.className = 'cart-items empty-state';
    cartItems.textContent = 'Aun no agregas productos al carrito.';
    return;
  }

  cartItems.className = 'cart-items';
  cartItems.innerHTML = '';

  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-top">
        <div>
          <strong>${item.nombre}</strong>
          <div class="cart-item-meta">${formatCurrency(item.precio)} c/u</div>
        </div>
        <strong class="cart-item-total">${formatCurrency(item.cantidad * item.precio)}</strong>
      </div>
      <div class="cart-controls">
        <button class="qty-button" data-action="decrease" data-id="${item.id}" type="button">-</button>
        <span class="qty-value">${item.cantidad}</span>
        <button class="qty-button" data-action="increase" data-id="${item.id}" type="button">+</button>
        <button class="remove-button" data-action="remove" data-id="${item.id}" type="button">Eliminar</button>
      </div>
    `;
    cartItems.appendChild(row);
  });
}

function renderPedidos(pedidos) {
  const container = document.getElementById('pedidos-list');
  if (!container) return;

  if (!pedidos.length) {
    container.innerHTML = '<div class="empty-state">Todavia no hay pedidos registrados.</div>';
    return;
  }

  container.innerHTML = '';

  pedidos.forEach((pedido) => {
    const card = document.createElement('article');
    card.className = 'order-card';
    card.setAttribute('data-tilt', '');
    card.innerHTML = `
      <span class="status-pill">${pedido.estado}</span>
      <h3>Pedido #${pedido.id}</h3>
      <p>${pedido.cliente_nombre}</p>
      <div class="order-meta">
        <span>${pedido.items} item(s)</span>
        <span>Total: ${formatCurrency(pedido.total)}</span>
        <span>${pedido.cliente_direccion}</span>
      </div>
    `;
    container.appendChild(card);
  });

  setupTiltEffects(container);
}

function renderFilterButtons(categories, state, onSelect) {
  const container = document.getElementById('menu-filters');
  if (!container) return;

  const allFilters = ['Todos', ...categories];
  container.innerHTML = '';

  allFilters.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter-chip ${state.activeCategory === category ? 'active' : ''}`.trim();
    button.textContent = category;
    button.addEventListener('click', () => onSelect(category));
    container.appendChild(button);
  });
}

function filterProducts(products, state) {
  const search = state.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = state.activeCategory === 'Todos' || product.categoria === state.activeCategory;
    const matchesSearch = !search || `${product.nombre} ${product.descripcion} ${product.categoria}`.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
}

function renderProductsByCategory(products, state, onAdd) {
  const productosContainer = document.getElementById('productos');
  const filtered = filterProducts(products, state);

  if (filtered.length === 0) {
    productosContainer.innerHTML = '<div class="empty-state">No encontramos productos con ese filtro.</div>';
    return;
  }

  const groupedProducts = filtered.reduce((groups, product) => {
    if (!groups.has(product.categoria)) {
      groups.set(product.categoria, []);
    }

    groups.get(product.categoria).push(product);
    return groups;
  }, new Map());

  productosContainer.innerHTML = '';

  groupedProducts.forEach((items, category) => {
    const section = document.createElement('section');
    section.className = 'category-section';
    section.innerHTML = `
      <div class="category-heading">
        <h2>${category}</h2>
        <span>${items.length} producto${items.length === 1 ? '' : 's'}</span>
      </div>
      <div class="product-grid"></div>
    `;

    const grid = section.querySelector('.product-grid');
    items.forEach((product) => {
      grid.appendChild(createProductCard(product, onAdd));
    });

    productosContainer.appendChild(section);
  });

  setupTiltEffects(productosContainer);
}

function setupHome() {
  apiRequest(`${API_BASE}/productos`)
    .then((products) => {
      const categories = [...new Set(products.map((product) => product.categoria))];
      const topCategory = categories[0] || 'Menu';
      const productCounter = document.querySelector('[data-home-products]');
      const categoryCounter = document.querySelector('[data-home-categories]');
      const highlight = document.querySelector('[data-home-highlight]');
      const sideA = document.querySelector('[data-home-side-a]');
      const sideB = document.querySelector('[data-home-side-b]');

      if (productCounter) productCounter.textContent = `${products.length}+`;
      if (categoryCounter) categoryCounter.textContent = `${categories.length}`;
      if (highlight) highlight.textContent = topCategory;
      if (sideA) sideA.textContent = `${products.length} productos listos para vitrina`;
      if (sideB) sideB.textContent = `${categories.length} categorias navegables`;
    })
    .catch(() => {
      // Si la API falla, dejamos los valores visuales por defecto.
    });
}

async function setupMenu() {
  const productosContainer = document.getElementById('productos');
  const pedidoForm = document.getElementById('pedido-form');
  const pedidoMessage = document.getElementById('pedido-message');
  const menuSearch = document.getElementById('menu-search');
  const cartItems = document.getElementById('cart-items');
  const clearCartButton = document.getElementById('cart-clear');
  const storedUser = getStoredUser();

  const state = {
    products: [],
    activeCategory: new URLSearchParams(window.location.search).get('categoria') || 'Todos',
    search: '',
    cart: getStoredCart()
  };

  if (storedUser && pedidoForm) {
    pedidoForm.clienteNombre.value = storedUser.nombre || '';
    pedidoForm.clienteEmail.value = storedUser.email || '';
  }

  const syncMenuView = () => {
    const categories = [...new Set(state.products.map((product) => product.categoria))];
    if (state.activeCategory !== 'Todos' && !categories.includes(state.activeCategory)) {
      state.activeCategory = 'Todos';
    }

    renderFilterButtons(categories, state, (category) => {
      state.activeCategory = category;
      syncMenuView();
    });
    renderProductsByCategory(state.products, state, addToCart);
    renderCart(state.cart);
  };

  const addToCart = (product) => {
    const existing = state.cart.find((item) => item.id === product.id);

    if (existing) {
      existing.cantidad += 1;
    } else {
      state.cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: Number(product.precio),
        cantidad: 1
      });
    }

    saveCart(state.cart);
    renderCart(state.cart);
  };

  try {
    state.products = await apiRequest(`${API_BASE}/productos`);
    syncMenuView();
  } catch (error) {
    productosContainer.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }

  try {
    const pedidos = await apiRequest(`${API_BASE}/pedidos`);
    renderPedidos(pedidos);
  } catch (error) {
    renderPedidos([]);
  }

  menuSearch?.addEventListener('input', (event) => {
    state.search = event.target.value;
    renderProductsByCategory(state.products, state, addToCart);
  });

  clearCartButton?.addEventListener('click', () => {
    state.cart = [];
    saveCart(state.cart);
    renderCart(state.cart);
  });

  cartItems?.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const itemId = Number(target.dataset.id);
    const item = state.cart.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    if (target.dataset.action === 'increase') item.cantidad += 1;
    if (target.dataset.action === 'decrease') item.cantidad -= 1;
    if (target.dataset.action === 'remove') item.cantidad = 0;

    state.cart = state.cart.filter((cartItem) => cartItem.cantidad > 0);
    saveCart(state.cart);
    renderCart(state.cart);
  });

  pedidoForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (state.cart.length === 0) {
      setMessage(pedidoMessage, 'Agrega al menos un producto antes de confirmar.', 'error');
      return;
    }

    const formData = new FormData(pedidoForm);
    const payload = Object.fromEntries(formData.entries());
    payload.usuarioId = storedUser?.id || null;
    payload.items = state.cart.map((item) => ({
      productoId: item.id,
      cantidad: item.cantidad
    }));

    try {
      const result = await apiRequest(`${API_BASE}/pedidos`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      state.cart = [];
      saveCart(state.cart);
      renderCart(state.cart);
      pedidoForm.reset();

      if (storedUser) {
        pedidoForm.clienteNombre.value = storedUser.nombre || '';
        pedidoForm.clienteEmail.value = storedUser.email || '';
      }

      setMessage(
        pedidoMessage,
        `Pedido #${result.pedido.id} registrado con estado ${result.pedido.estado}.`,
        'success'
      );

      const pedidos = await apiRequest(`${API_BASE}/pedidos`);
      renderPedidos(pedidos);
    } catch (error) {
      setMessage(pedidoMessage, error.message, 'error');
    }
  });
}

setupTiltEffects();

if (page === 'home') {
  setupHome();
}

if (page === 'register') {
  setupRegister();
}

if (page === 'login') {
  setupLogin();
}

if (page === 'menu') {
  setupMenu();
}
