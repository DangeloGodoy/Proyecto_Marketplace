function removeCart(id) {
    let cart = JSON.parse(localStorage.getItem('carrito')) || []
    let index = cart.findIndex(item => item.id === id)
    if (index !== -1) {
        cart[index].count--
        if (cart[index].count === 0) {
            cart.splice(index, 1)
        }
        localStorage.setItem('carrito', JSON.stringify(cart))
        cartProducts()
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

            subTotal = product.price * product.count
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

                }).showToast()
            }

            productDiv.appendChild(name)
            productDiv.appendChild(cant)
            productDiv.appendChild(price)
            productDiv.appendChild(removeProduct)

            containerCart.appendChild(productDiv)
            total += subTotal
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
                        })
                    } else {
                        Swal.fire({
                            title: "Codigo invalido o vacio",
                            text: "El codigo ingresado no es valido o el campo esta vacio",
                            icon: "error"
                        })
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
    const numberCard = document.getElementById('numberCard')
    const numberCvc = document.getElementById('cvc')
    const dateTime = document.getElementById('dateTime')
    const numberZip = document.getElementById('zipCode')

    paymentForm.style.display = 'none'
    backCartButton.classList.add('disabled')

    // Muestra el formulario de pago y oculta el carrito al hacer clic en 'Ir a Pagar', además se desabilita el 
    document.getElementById('payCart').onclick = () => {
        cartDisplay.style.display = 'none'
        paymentForm.style.display = 'block'
        backCartButton.classList.remove('disabled')
        let buttonPay = document.getElementById('payCart')
        buttonPay.classList.add('disabled')
    }
    (() => {
        const form = document.getElementById('checkoutForm')
        form.addEventListener('submit', validateSendForm, false)
    })()

    dateTime.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '') // se limita solo a numero y la cantidad de caracteres
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4)
        }
        e.target.value = value.slice(0, 5)
    })

    numberZip.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '')
        if (e.target.value.length > 7) {
            e.target.value = e.target.value.slice(0, 7)
        }
    })

    numberCvc.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '')
        if (e.target.value.length > 3) {
            e.target.value = e.target.value.slice(0, 3)
        }
    })

    numberCard.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length >= 4) {
            value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 12) + ' ' + value.slice(12, 16)
        }
        e.target.value = value.slice(0, 19)
    })
}

// Manejo para el envío del formulario

function validateSendForm(event) {
    'use strict'
    const numberCard = document.getElementById('numberCard')
    const numberCvc = document.getElementById('cvc')
    const dateTime = document.getElementById('dateTime')
    const pageURL = window.location.origin
    try {
        event.preventDefault() // Evitamos el envío del formulario
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
                didOpen: () => {
                    Swal.showLoading();
                },
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    let cardNumber = numberCard.value.replace(/\D/g, '')
                    let date = dateTime.value.replace(/\D/g, '')
                    let cvc = numberCvc.value
                    if ((cardNumber === '4548865105665084' && date === '0627' && cvc === '180') || (cardNumber === '4220382712576402' && date === '1027' && cvc === '997')) {
                        Swal.fire({
                            title: 'Pago Realizado',
                            text: 'Se realizó el pago correctamente, será enviado a la página de inicio',
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        })

                        setTimeout(() => {
                            localStorage.removeItem('total')
                            localStorage.removeItem('carrito')
                            form.submit()
                            window.location.href = pageURL
                        }, 5000)
                    } else {
                        Swal.fire({
                            title: 'Error en el Pago',
                            text: 'No se logró procesar el pago correctamente',
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        })
                        throw new Error("Ocupar los datos del Readme por favor :D")
                    }
                }
            })
        }
    } catch (err) {
        console.error('Se detectó el siguiente error al enviar el formulario: ', err)
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