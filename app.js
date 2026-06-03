// ── CART ─────────────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('rv_cart') || '[]');

function saveCart(){ localStorage.setItem('rv_cart', JSON.stringify(cart)); }

function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function toggleCart(){
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function addToCart(name, price, img){
  const existing = cart.find(i => i.name === name);
  if(existing){ existing.qty++; }
  else { cart.push({name, price, img, qty:1}); }
  saveCart(); updateCartUI();
  showToast('✓ Added to cart — ' + name);
  const s = document.getElementById('cartSidebar');
  if(!s.classList.contains('open')) toggleCart();
}

function changeQty(idx, delta){
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx,1);
  saveCart(); updateCartUI();
}

function removeFromCart(idx){
  cart.splice(idx,1);
  saveCart(); updateCartUI();
}

function updateCartUI(){
  const count = cart.reduce((s,i) => s+i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);

  const el = document.getElementById('cartItems');
  if(!el) return;

  if(cart.length === 0){
    el.innerHTML = '<div class="cart-empty"><p>🛒</p><div>Your cart is empty</div></div>';
    document.getElementById('cartFooter').style.display = 'none';
    return;
  }

  document.getElementById('cartFooter').style.display = 'block';

  let subtotal = 0;
  el.innerHTML = cart.map((item, idx) => {
    const n = parseInt(item.price.replace(/[^0-9]/g,''));
    subtotal += n * item.qty;
    return `
    <div class="cart-item">
      <div class="ci-img"><img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'"/></div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${item.price}</div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
        </div>
      </div>
      <button class="ci-del" onclick="removeFromCart(${idx})">✕</button>
    </div>`;
  }).join('');

  const shipping = subtotal >= 999 ? 0 : 79;
  document.getElementById('cartSubtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
  document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
  document.getElementById('cartTotal').textContent = '₹' + (subtotal + shipping).toLocaleString('en-IN');
}

// ── NAV ACTIVE LINK ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.getAttribute('href') === path) a.classList.add('active');
  });
});

// ── MOBILE MENU ───────────────────────────────────────────────────────────────
function toggleMenu(){
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ── CHECKOUT ──────────────────────────────────────────────────────────────────
function checkout(){
  window.location.href = 'checkout.html';
}

// ── WISHLIST ──────────────────────────────────────────────────────────────────
function toggleWish(btn){
  btn.classList.toggle('active');
  if(btn.classList.contains('active')){ btn.innerHTML='♥'; btn.style.color='var(--pink)'; showToast('❤️ Added to wishlist!'); }
  else { btn.innerHTML='♡'; btn.style.color=''; }
}
