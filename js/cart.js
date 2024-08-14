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
            productDiv.className = "cart-item mx-5 mb-3"

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
                    className: "alertBox-cart",
                    gravity: "top",
                    offset: {
                        x: 10,
                        y: 30
                    },

                }).showToast();
            }

            productDiv.appendChild(name)
            productDiv.appendChild(cant)
            productDiv.appendChild(price)
            productDiv.appendChild(removeProduct)

            containerCart.appendChild(productDiv)
            total += subTotal;
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

function processPay() {
    listState()

    // Oculta el formulario de pago inicialmente
    const paymentForm = document.getElementById('paymentForm')
    const backCartButton = document.getElementById('backCart')
    const cartDisplay = document.getElementById('cart')

    paymentForm.style.display = 'none'
    backCartButton.classList.add('disabled')

    // Muestra el formulario de pago y oculta el carrito al hacer clic en 'Ir a Pagar'
    document.getElementById('payCart').onclick = () => {
        cartDisplay.style.display = 'none';
        paymentForm.style.display = 'block';
        backCartButton.classList.remove('disabled')
    };
    (() => {
        const form = document.getElementById('checkoutForm');
        form.addEventListener('submit', validateSendForm, false);
    })();
}

// Manejo para el envío del formulario

function validateSendForm(event) {
    const pageURL = window.location.origin
    try {
        'use strict'
        event.preventDefault() // Evitamos el envio del formulario
        const form = document.getElementById('checkoutForm')

        if (!form.checkValidity()) {
            event.stopPropagation()
            Swal.fire({
                title: 'Rellena la información',
                text: 'Falta información en los campos obligatorios',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            })
            form.classList.add('was-validated')
            throw new Error("Datos ingresados incompletos!!")
        } else {
            Swal.fire({
                title: "Validando el Pago!",
                html: "Nos encontramos validando tu pago...",
                timer: 5000,
                timerProgressBar: true,
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    Swal.fire({
                        title: 'Pago Realizado',
                        text: 'Se realizo el pago correctamente, sera enviado a la pagina de inicio',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    })
                    setTimeout(() => {
                        localStorage.removeItem('total')
                        localStorage.removeItem('carrito')
                        form.submit()
                        window.location.href = pageURL
                    },5000)
                } else {
                    throw new Error("No se logro procesar el pago correctamente!!")
                }
            })
        }
    } catch (err) {
        console.log('Se dectecto el siguiente error al enviar el formulario: ', err)
    }
}

function listState() {
    // Cargar comunas desde un archivo JSON y rellenar el select
    fetch('../db/states.json')  // Ajusta la ruta según la ubicación de tu archivo JSON
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('state')
            data.states.forEach(state => {
                const option = document.createElement('option')
                option.value = state
                option.textContent = state
                select.appendChild(option)
            })
        })
}

cartProducts()
processPay()