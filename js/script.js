const products = [
    {
        id: 1,
        nombre: "Smartphone Galaxy S21",
        marca: "Samsung",
        tipo: "Smartphone",
        precio: 799000,
        imagen: "./img/galaxy_s21.jpg"
    },
    {
        id: 2,
        nombre: "iPhone 15 Pro",
        marca: "Apple",
        tipo: "Smartphone",
        precio: 999000,
        imagen: "./img/iphone_15_pro.jpg"
    },
    {
        id: 3,
        nombre: "Laptop XPS 13",
        marca: "Dell",
        tipo: "Laptop",
        precio: 1199000,
        imagen: "./img/Laptop_xps_13.jpg"
    },
    {
        id: 4,
        nombre: "MacBook Pro",
        marca: "Apple",
        tipo: "Laptop",
        precio: 1499000,
        imagen: "./img/macbook_pro.jpg"
    },
    {
        id: 5,
        nombre: "Televisor OLED CX",
        marca: "LG",
        tipo: "Televisor",
        precio: 1299000,
        imagen: "./img/lg_oled_cx.jpg"
    },
    {
        id: 6,
        nombre: "Televisor QLED Q60T",
        marca: "Samsung",
        tipo: "Televisor",
        precio: 1099000,
        imagen: "./img/samsung_qled_q60t.jpg"
    },
    {
        id: 7,
        nombre: "Tablet Galaxy Tab S7",
        marca: "Samsung",
        tipo: "Tablet",
        precio: 649000,
        imagen: "./img/galaxy_tab_s7.jpg"
    },
    {
        id: 8,
        nombre: "iPad Pro",
        marca: "Apple",
        tipo: "Tablet",
        precio: 899000,
        imagen: "./img/ipad_pro.jpg"
    },
    {
        id: 9,
        nombre: "Auriculares WH-1000XM4",
        marca: "Sony",
        tipo: "Auriculares",
        precio: 349000,
        imagen: "./img/sony_wh1000xm4.jpg"
    },
    {
        id: 10,
        nombre: "Auriculares AirPods Pro",
        marca: "Apple",
        tipo: "Auriculares",
        precio: 249000,
        imagen: "./img/airpods_pro.jpg"
    }
];

function cardProducts() {
    const contenedor = document.getElementById('listProducts');

    products.forEach(product => {
        let productDiv = document.createElement("div");
        productDiv.className = "card mb-4 style-card";

        let image = document.createElement("img");
        image.src = product.imagen;
        image.alt = product.nombre;
        image.className = "card-img-top img-thumbnail img-class";

        let bodyDiv = document.createElement("div");
        bodyDiv.className = "card-body";

        let name = document.createElement("h5");
        name.textContent = product.nombre;
        name.className = "card-title text-wrap";

        let company = document.createElement("p");
        company.textContent = product.marca;
        company.className = "card-subtitle"

        let type = document.createElement("p");
        type.className = "card-text";
        type.textContent = product.tipo;

        let price = document.createElement("p");
        price.textContent = `$ ${product.precio}`;
        price.className = "card-text";

        let button = document.createElement("button");
        button.textContent = `Agregar al Carrito`;
        button.className = "btn btn-success";
        button.onclick = () => {
            addToCart(product);
            cartProducts();
        };
        bodyDiv.appendChild(company)
        bodyDiv.appendChild(name);
        bodyDiv.appendChild(type)
        bodyDiv.appendChild(price);
        bodyDiv.appendChild(button);

        productDiv.appendChild(image);
        productDiv.appendChild(bodyDiv);

        contenedor.appendChild(productDiv);
    });
}

function addToCart(product) {
    let productsCart = JSON.parse(localStorage.getItem('carrito')) || [];
    let foundproducts = productsCart.find(item => item.id === product.id);
    if (foundproducts) {
        foundproducts.cantidad++;
    } else {
        product.cantidad = 1;
        productsCart.push(product);
    }
    localStorage.setItem('carrito',JSON.stringify(productsCart));
    cartProducts()
}

function removeCart(id) {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart[index].cantidad--;
        if (cart[index].cantidad === 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(cart));
        cartProducts();
    }
}

function cartProducts() {
    const containerCart = document.getElementById('cart');
    containerCart.innerHTML = ''; 
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    if (cart.length === 0) {
        let messageCart = document.createElement("p");
        messageCart.className = "message-cart"
        messageCart.textContent = "El carrito esta vacio";
        containerCart.appendChild(messageCart);
    } else {
    cart.forEach((product, index) => {
        let productDiv = document.createElement("div");
        productDiv.className = "cart-item mb-3";

        let name = document.createElement("h5");
        name.className = "cart-item-title";
        name.textContent = product.nombre;

        let cant = document.createElement("p")
        cant.className = "cart-item-price"
        cant.textContent = `Cantidad de producto: ${product.cantidad}`

        let price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = `$ ${product.precio * product.cantidad}`;

        let removeProduct = document.createElement("button");
        removeProduct.className = "btn btn-outline-danger";
        removeProduct.textContent = "Borrar Producto";
        removeProduct.onclick = () => removeCart(product.id);

        productDiv.appendChild(name);
        productDiv.appendChild(cant)
        productDiv.appendChild(price);
        productDiv.appendChild(removeProduct);

        containerCart.appendChild(productDiv);
        total += product.precio * product.cantidad
    });

    let totalCart = document.getElementById('totalCart');
    totalCart.innerHTML = `Total: $ ${total}`;
    }
}

document.addEventListener('DOMContentLoaded',() => {
    cardProducts();
    cartProducts();
});