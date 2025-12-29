document.addEventListener('DOMContentLoaded', () => {
  // Load menu via AJAX
  fetch('data/menu.json')
    .then(response => response.json())
    .then(data => {
      const grid = document.getElementById('menu-grid');
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = `col-sm-6 col-lg-4 all ${item.category}`;
        div.innerHTML = `
          <div class="box">
            <div>
              <div class="img-box">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="detail-box">
                <h5>${item.name}</h5>
                <p>${item.description}</p>
                <div class="options">
                  <h6>$${item.price}</h6>
                  ${item.options.map((opt, idx) => `
                    <label>
                      <input type="checkbox" class="option-check" data-id="${item.id}" data-idx="${idx}" data-price="${opt.match(/\(\+\$(\d+)\)/)?.[1] || 0}">
                      ${opt}
                    </label>
                  `).join('')}
                  <button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        `;
        grid.appendChild(div);
      });

      // Restore options from localStorage
      const savedOptions = JSON.parse(localStorage.getItem('selectedOptions')) || {};
      Object.keys(savedOptions).forEach(id => {
        savedOptions[id].forEach(idx => {
          const cb = grid.querySelector(`input[data-id="${id}"][data-idx="${idx}"]`);
          if (cb) cb.checked = true;
        });
      });

      // Save options on change
      grid.addEventListener('change', (e) => {
        if (e.target.classList.contains('option-check')) {
          const id = e.target.dataset.id;
          const idx = e.target.dataset.idx;
          let options = JSON.parse(localStorage.getItem('selectedOptions')) || {};
          options[id] = options[id] || [];
          if (e.target.checked) {
            options[id].push(idx);
          } else {
            options[id] = options[id].filter(i => i !== idx);
          }
          localStorage.setItem('selectedOptions', JSON.stringify(options));
        }
      });

      // Add to cart
      grid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
          const id = e.target.dataset.id;
          const item = data.find(i => i.id == id);
          const selectedOpts = Array.from(grid.querySelectorAll(`input[data-id="${id}"]:checked`)).map(cb => ({
            name: cb.parentElement.textContent.trim(),
            price: parseFloat(cb.dataset.price)
          }));
          const totalPrice = item.price + selectedOpts.reduce((sum, opt) => sum + opt.price, 0);
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart.push({ ...item, selectedOptions: selectedOpts, totalPrice });
          localStorage.setItem('cart', JSON.stringify(cart));
          alert('Added to cart!');
          updateCartCount();
        }
      });

      // Isotope filters
      $('.grid').isotope({ itemSelector: '.all', percentPosition: true, masonry: { columnWidth: '.all' } });
      $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');
        var data = $(this).attr('data-filter');
        $('.grid').isotope({ filter: data });
      });
    })
    .catch(error => console.error('Error loading menu:', error));

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
  }
  updateCartCount();
});