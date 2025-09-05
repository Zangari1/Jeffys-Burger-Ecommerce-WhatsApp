const menu = document.getElementById("menu")
const cartbtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abre modal do carrinho
cartbtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fecha clicando fora do modal
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// Fecha no botão fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Adiciona item ao carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)

        // ✅ Toast de confirmação
        Toastify({
            text: `${name} adicionado ao carrinho!`,
            duration: 2000,
            gravity: "top",
            position: "right",
            style: { background: "#22c55e" }
        }).showToast()
    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({ name, price, quantity: 1 })
    }

    updateCartModal();
}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add(
            "flex", 
            "items-center", 
            "justify-between", 
            "border-b", 
            "border-gray-300", 
            "pb-2", 
            "mb-2"
        )
        
        cartItemElement.innerHTML = `
            <!-- Nome do produto -->
            <div class="w-1/3">
                <p class="font-medium">${item.name}</p>
                <p class="text-sm text-gray-500">R$ ${item.price.toFixed(2)} un.</p>
            </div>

            <!-- Controles de quantidade -->
            <div class="flex items-center gap-2 w-1/3 justify-center">
                <button class="decrease-qty px-2 bg-red-500 text-white rounded" data-name="${item.name}">-</button>
                <span class="font-medium">${item.quantity}</span>
                <button class="increase-qty px-2 bg-green-500 text-white rounded" data-name="${item.name}">+</button>
            </div>

            <!-- Subtotal -->
            <div class="w-1/3 text-right font-semibold">
                R$ ${(item.price * item.quantity).toFixed(2)}
            </div>
        `

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement)
    })

    // Total formatado
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // contador mostra total de unidades
    cartCounter.innerHTML = cart.reduce((sum, item) => sum + item.quantity, 0)
}

// Eventos para botões de + e -
cartItemsContainer.addEventListener("click", function(event){
    const name = event.target.getAttribute("data-name")

    if(event.target.classList.contains("increase-qty")){
        increaseQty(name)
    }

    if(event.target.classList.contains("decrease-qty")){
        decreaseQty(name)
    }
})

function increaseQty(name){
    const item = cart.find(i => i.name === name)
    if(item){
        item.quantity += 1
        updateCartModal()
    }
}

function decreaseQty(name){
    const item = cart.find(i => i.name === name)
    if(item){
        if(item.quantity > 1){
            item.quantity -= 1
        } else {
            cart = cart.filter(i => i.name !== name) // remove item se chegar a 0
        }
        updateCartModal()
    }
}

// Validação do endereço
addressInput.addEventListener("input", function(event){
    if(event.target.value !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar compra
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "#ef4444" },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map(item =>
        `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`
    ).join(" | ")

    const message = encodeURIComponent(cartItems)
    const phone = "11999999999"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

// Função de horário de funcionamento
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 16 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
