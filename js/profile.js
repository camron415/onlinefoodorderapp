document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('user-info').innerHTML = `
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Email:</strong> ${user.email}</p>
  `;
  const ordersList = document.getElementById('orders-list');
  user.orders.forEach(order => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Order Date:</strong> ${order.date}<br><strong>Items:</strong> ${order.items.map(item => `${item.name} ($${item.price})`).join(', ')}<br><strong>Total:</strong> $${order.total}`;
    ordersList.appendChild(li);
  });
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out');
    window.location.href = 'index.html';
  });
});