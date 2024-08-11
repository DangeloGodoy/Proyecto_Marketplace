function cardProducts() {
    const contaniner = document.getElementById('listProducts');

    fetch("./db/product.json")
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                let productDiv = document.createElement("div");
                productDiv.className = "card mb-4 style-card";

                let image = document.createElement("img");
                image.src = product.img;
                image.alt = product.name;
                image.className = "card-img-top img-thumbnail img-class";

                let bodyDiv = document.createElement("div");
                bodyDiv.className = "card-body";

                let name = document.createElement("h5");
                name.textContent = product.name;
                name.className = "card-title text-wrap";

                let company = document.createElement("p");
                company.textContent = product.marke;
                company.className = "card-subtitle"

                let type = document.createElement("p");
                type.className = "card-text";
                type.textContent = product.type;

                let price = document.createElement("p");
                price.textContent = `$ ${product.price.toLocaleString('es-CL')}`;
                price.className = "card-text";

                let button = document.createElement("button");
                button.textContent = `Agregar al Carrito`;
                button.className = "btn btn-success";
                button.onclick = () => {
                    addToCart(product);
                    cartProducts();
                    Toastify({
                        text: "✅ Producto agregado al carrito",
                        gravity: "bottom",
                        position: "left",
                        className: "alertBox",
                        offset: {
                          x: 50,
                          y: 10 
                        },
                      }).showToast();
                };
                bodyDiv.appendChild(company)
                bodyDiv.appendChild(name);
                bodyDiv.appendChild(type)
                bodyDiv.appendChild(price);
                bodyDiv.appendChild(button);

                productDiv.appendChild(image);
                productDiv.appendChild(bodyDiv);

                contaniner.appendChild(productDiv);
            });
        });
}

function addToCart(product) {
    let productsCart = JSON.parse(localStorage.getItem('carrito')) || [];
    let foundproducts = productsCart.find(item => item.id === product.id);
    if (foundproducts) {
        foundproducts.count++;
    } else {
        product.count = 1;
        productsCart.push(product);
    }
    localStorage.setItem('carrito', JSON.stringify(productsCart));
    cartProducts()
}

function removeCart(id) {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart[index].count--;
        if (cart[index].count === 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(cart));
        cartProducts();
    }
}

function cartProducts() {
    const containerCart = document.getElementById('cart')
    containerCart.innerHTML = ''
    let cart = JSON.parse(localStorage.getItem('carrito')) || []
    let total = 0

    if (cart.length === 0) {
        let messageCart = document.createElement("p")
        messageCart.className = "message-cart"
        messageCart.textContent = "El carrito está vacío"
        containerCart.appendChild(messageCart)
    } else {
        cart.forEach((product) => {
            let productDiv = document.createElement("div")
            productDiv.className = "cart-item mb-3"

            let name = document.createElement("h5")
            name.className = "cart-item-title"
            name.textContent = product.name

            let cant = document.createElement("p")
            cant.className = "cart-item-price"
            cant.textContent = `Cantidad de productos: ${product.count}`

            subTotal = product.price * product.count;
            let price = document.createElement("p")
            price.className = "cart-item-price"
            price.textContent = `$ ${subTotal.toLocaleString('es-CL')}`

            let removeProduct = document.createElement("button")
            removeProduct.className = "btn btn-outline-danger"
            removeProduct.textContent = "Borrar Producto"
            removeProduct.onclick = () => {
                removeCart(product.id)
                Toastify({
                    text: "🚫 Producto eliminado al carrito",
                    gravity: "bottom",
                    position: "left",
                    className: "alertBox",
                    offset: {
                      x: 50,
                      y: 10 
                    },
                  }).showToast();
            }

            productDiv.appendChild(name)
            productDiv.appendChild(cant)
            productDiv.appendChild(price)
            productDiv.appendChild(removeProduct)

            containerCart.appendChild(productDiv)
            total += product.price * product.count
        })
    }

    let totalCart = document.getElementById('totalCart')
    totalCart.innerHTML = `Total: $ ${total.toLocaleString('es-CL')}`
}

cardProducts();
cartProducts();
