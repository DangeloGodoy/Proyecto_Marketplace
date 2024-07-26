const products = [
    {
        id: 1,
        name: "Smartphone Galaxy S21",
        marke: "Samsung",
        type: "Smartphone",
        price: 799000,
        img: "./img/galaxy_s21.jpg"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        marke: "Apple",
        type: "Smartphone",
        price: 999000,
        img: "./img/iphone_15_pro.jpg"
    },
    {
        id: 3,
        name: "Laptop XPS 13",
        marke: "Dell",
        type: "Laptop",
        price: 1199000,
        img: "./img/Laptop_xps_13.jpg"
    },
    {
        id: 4,
        name: "MacBook Pro",
        marke: "Apple",
        type: "Laptop",
        price: 1499000,
        img: "./img/macbook_pro.jpg"
    },
    {
        id: 5,
        name: "Televisor OLED CX",
        marke: "LG",
        type: "Televisor",
        price: 1299000,
        img: "./img/lg_oled_cx.jpg"
    },
    {
        id: 6,
        name: "Televisor QLED Q60T",
        marke: "Samsung",
        type: "Televisor",
        price: 1099000,
        img: "./img/samsung_qled_q60t.jpg"
    },
    {
        id: 7,
        name: "Tablet Galaxy Tab S7",
        marke: "Samsung",
        type: "Tablet",
        price: 649000,
        img: "./img/galaxy_tab_s7.jpg"
    },
    {
        id: 8,
        name: "iPad Pro",
        marke: "Apple",
        type: "Tablet",
        price: 899000,
        img: "./img/ipad_pro.jpg"
    },
    {
        id: 9,
        name: "Auriculares WH-1000XM4",
        marke: "Sony",
        type: "Auriculares",
        price: 349000,
        img: "./img/sony_wh1000xm4.jpg"
    },
    {
        id: 10,
        name: "Auriculares AirPods Pro",
        marke: "Apple",
        type: "Auriculares",
        price: 249000,
        img: "./img/airpods_pro.jpg"
    }
];

const codeDiscount = [
    {
        id: 1,
        code: "desc10",
        discount: 10
    },
    {
        id: 2,
        code: "desc25",
        discount: 25
    },
    {
        id: 3,
        code: "desc50",
        discount: 50
    }
];

function cardProducts() {
    const contaniner = document.getElementById('listProducts');

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
        price.textContent = `$ ${product.price}`;
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

        contaniner.appendChild(productDiv);
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
    localStorage.setItem('carrito',JSON.stringify(productsCart));
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
    const containerCart = document.getElementById('cart');
    containerCart.innerHTML = ''; 
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    if (cart.length === 0) {
        let messageCart = document.createElement("p");
        messageCart.className = "message-cart"
        messageCart.textContent = "El carrito esta vacio";
        containerCart.appendChild(messageCart);
        let totalCart = document.getElementById('totalCart');
        totalCart.innerHTML = `Total: $ 0`;
    } else {
    cart.forEach((product, index) => {
        let productDiv = document.createElement("div");
        productDiv.className = "cart-item mb-3";

        let name = document.createElement("h5");
        name.className = "cart-item-title";
        name.textContent = product.name;

        let cant = document.createElement("p")
        cant.className = "cart-item-price"
        cant.textContent = `Cantidad de productos: ${product.count}`

        let price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = `$ ${product.price * product.count}`;

        let removeProduct = document.createElement("button");
        removeProduct.className = "btn btn-outline-danger";
        removeProduct.textContent = "Borrar Producto";
        removeProduct.onclick = () => removeCart(product.id);

        productDiv.appendChild(name);
        productDiv.appendChild(cant)
        productDiv.appendChild(price);
        productDiv.appendChild(removeProduct);

        containerCart.appendChild(productDiv);
        total += product.price * product.count;
    });


    let totalCart = document.getElementById('totalCart');
    totalCart.innerHTML = `Total: $ ${total}`;

    let buttonDisc = document.getElementById('buttonDiscount');
    let discountApplied = false;
    document.getElementById('inputdisc').value = '';

    buttonDisc.onclick = () => {
    if (!discountApplied && cart.length > 0) {
        let inputDiscount = document.getElementById('inputdisc').value;
        let foundCode = codeDiscount.find(codeDes => codeDes.code === inputDiscount);
        
        if (foundCode) {
            desc = (foundCode.discount / 100);
            total = total - (desc * total);
            discountApplied = true;
        }

        let totalCart = document.getElementById('totalCart');
        totalCart.innerHTML = `Total: $ ${total}`;
    }
    } 
    }
}

document.addEventListener('DOMContentLoaded',() => {
    cardProducts();
    cartProducts();
});