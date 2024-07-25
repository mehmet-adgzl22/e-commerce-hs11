import {
    calculateCartTotal,
    getCartFromLocalStorage,
    saveToLocalStorage,
    updateCartIcon,
  } from "./utils.js";
  
  export let cart = getCartFromLocalStorage();
  
  export const addToCart = (event, products) => {
    const productID = parseInt(event.target.dataset.id);
    const product = products.find((product) => productID === product.id);
    if (product) {
      const existingItem = cart.find((item) => item.id === productID);
  
      if (existingItem) {
        existingItem.quantity++;
      } else {
        console.log("ürün sepete ilk defa ekleniyor");
        const cartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        };
        cart.push(cartItem);
      }
      saveToLocalStorage(cart);

      event.target.textContent = "Added";
      updateCartIcon(cart);
  
      displayCartTotal();
    }
  };
  
  export const renderCartItems = () => {
    const cartItemsElement = document.getElementById("cartItems");
    cartItemsElement.innerHTML = cart
      .map(
        (item) => `<div class="cart-item">
                <img
                  width="100"
                  src="${item.image}"
                  alt=""
                />
                <div class="cart-item-info">
                  <h2 class="cart-item-title">${item.title}</h2>
                  <input
                    type="number"
                    min="1"
                    value="${item.quantity}"
                    class="cart-item-quantity"
                    data-id="${item.id}"
                  />
                </div>
                <h2>$${item.price}</h2>
                <button class="remove-from-cart" data-id="${item.id}">Remove</button>
              </div>`
      )
      .join("");
  
    const removeButtons = document.getElementsByClassName("remove-from-cart");
  
    for (let i = 0; i < removeButtons.length; i++) {
      const removeButton = removeButtons[i];
      removeButton.addEventListener("click", removeFromCart);
    }
  
    const quantityInputs = document.getElementsByClassName("cart-item-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
      const quantityInput = quantityInputs[i];
      quantityInput.addEventListener("change", changeQuantity);
    }
  };
  
  const removeFromCart = (event) => {
    const productID = Number(event.target.dataset.id);
    cart = cart.filter((item) => item.id !== productID);
    saveToLocalStorage(cart);
    renderCartItems();
    displayCartTotal();
  
    updateCartIcon(cart);
  };
  const changeQuantity = (event) => {
    const productID = Number(event.target.dataset.id);
    const quantity = Number(event.target.value);
  
    if (quantity > 0) {
      const cartItem = cart.find((item) => item.id === productID);
     
      if (cartItem) {
        cartItem.quantity = quantity;
        saveToLocalStorage(cart);

        displayCartTotal();
  
        updateCartIcon(cart);
      }
    }
  };
  
  export const displayCartTotal = () => {
    const cartTotalElement = document.getElementById("cartTotal");
    const total = calculateCartTotal(cart);
    console.log(total);
    cartTotalElement.textContent = `Total:$${total.toFixed(2)}`;
  };