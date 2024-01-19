const navCenter = document.querySelector('.navbar'),
  sidebarBtn = document.querySelector('.toggle-nav'),
  sidebarOverlay = document.querySelector('.sidebar-overlay'),
  sidebarClose = document.querySelector('.sidebar-close'),
  toggleCart = document.querySelector('.toggle-cart'),
  cartOverlay = document.querySelector('.cart-overlay'),
  cartClose = document.querySelector('.cart-close')

sidebarBtn.addEventListener('click', () => {
  sidebarOverlay.classList.add('show')
})
sidebarClose.addEventListener('click', () => {
  sidebarOverlay.classList.remove('show')
})
toggleCart.addEventListener('click', () => {
  cartOverlay.classList.add('show')
})
cartClose.addEventListener('click', () => {
  cartOverlay.classList.remove('show')
  location.reload()
})

const toDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date))
}

document.querySelectorAll('.date').forEach((item) => {
  item.textContent = toDate(item.textContent)
})

document.querySelectorAll('.price').forEach((item) => {
  item.textContent = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(item.textContent)
})

// ##########################
// const toggle = document.querySelector('.toggle'),
//   navigation = document.querySelector('.navigation'),
//   container = document.querySelector('.container')

// toggle.addEventListener('click', () => {
//   // toggle.classList.toggle('active')
//   navigation.classList.toggle('active')
// })

const cards = document.querySelector('.cart-items')

if (cards) {
  cards.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-remove')) {
      const id = e.target.dataset.id

      fetch('/products/remove/' + id, {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((card) => {
          console.log(card)
          if (card.itemCard.length) {
            const html = card.itemCard
              .map((item) => {
                const { name, count, price, imageSmall, _id } = item
                return `
        <div class="cart-item-g">
        <img src='${imageSmall}' class='cart-item-img' alt='' />
        <div class='bag-items'>
         <div class="desc-item">
          <h4 class='cart-item-name'>${name}</h4>
          <p class='cart-item-price'>${price}.00</p>
          <button class='cart-item-remove-btn js-remove' data-id='${_id}'>remove</button>
          </div>
          <div>
          <p class='cart-item-amount'>${count}</p>
          </div>
          </div>
          </div>
               `
              })
              .join('')
            cards.innerHTML = html

            document.querySelector(
              '.cart-total'
            ).textContent = `total: $${card.priceCard}.00`
          } else {
            cards.innerHTML = '<p>Card is empty</p>'
            document.querySelector('.cart-total').textContent = `total: $0.00`
          }
        })
    }
  })
}
