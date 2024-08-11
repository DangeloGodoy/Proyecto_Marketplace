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

    // Resetear descuento si el carrito está vacío
    let discountApplied = false
    document.getElementById('inputdisc').value = ''

    let buttonDisc = document.getElementById('buttonDiscount')
    buttonDisc.onclick = () => {
        if (!discountApplied && cart.length > 0) {
            let inputDiscount = document.getElementById('inputdisc').value
            fetch("../db/codesDesc.json")
                .then(response => response.json())
                .then(codeDiscount => {
                    let foundCode = codeDiscount.find(codeDes => codeDes.code === inputDiscount)

                    if (foundCode) {
                        desc = (foundCode.discount / 100)
                        total = total - (desc * total)
                        discountApplied = true
                        Swal.fire({
                            title: "Descuento Aplicado",
                            html: `Se aplico correctamente el codigo <b>${foundCode.code}</b> con un ${foundCode.discount}% de descuento`,
                            icon: "success"
                          });    
                    } else {
                        Swal.fire({
                            title: "Codigo invalido o vacio",
                            text: "El codigo ingresado no es valido o el campo esta vacio",
                            icon: "error"
                          });  
                    }

                    let totalCart = document.getElementById('totalCart')
                    totalCart.innerHTML = `Total: $ ${total.toLocaleString('es-CL')}`
                })
        }
    }
}

cartProducts();