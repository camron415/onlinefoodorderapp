document.addEventListener('DOMContentLoaded', () => {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalDiv = document.getElementById('total');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <p><strong>${item.name}</strong> - $${item.price}</p>
      <p>Options: ${item.selectedOptions.map(opt => `${opt.name}`).join(', ') || 'None'}</p>
      <p>Total for this item: $${item.totalPrice}</p>
      <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
    `;
    cartItemsDiv.appendChild(div);
    total += item.totalPrice;
  });
  totalDiv.textContent = `Total: $${total}`;

  // Remove item
  cartItemsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    }
  });

  // Place order
  const form = document.getElementById('orderForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const payment = document.getElementById('payment').value;
    if (!name || !phone || !email || !address || !payment) {
      alert('Please fill in all fields');
      return;
    }
    // Mock AJAX send
    fetch('/api/order', { // Placeholder, no real server
      method: 'POST',
      body: JSON.stringify({ name, phone, email, address, payment, cart, total })
    }).then(() => {
      alert('Order placed successfully!');
      // Save to user orders if logged in
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      if (user) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === user.email);
        users[userIndex].orders.push({ date: new Date().toLocaleString(), items: cart, total });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(users[userIndex]));
      }
      localStorage.removeItem('cart');
      localStorage.removeItem('selectedOptions');
      window.location.href = 'index.html';
    }).catch(() => alert('Order placed (mock)'));
  });
});