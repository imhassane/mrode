// const CART_COOKIE = "489sPg3DMdsDL";
const CART_COOKIE = "mlmCart";

export const state = () => ({
  products: [],
  keys: [],
  totalPrice: 0,
  quantity: 0
});

export const mutations = {

  addProductInCart(state, payload) {
    let products = [], keys = [], totalPrice = 0, totalQuantity = 0, found = false;
    for(let { product, quantity } of state.products) {
      const { id } = product;

      if(id === payload.product.id) {
        quantity += payload.quantity;
        found = true;
      }

      products.push({ product, quantity });
      keys.push(id);

      totalQuantity += quantity;
      totalPrice += quantity * product.marketPrice;
    }

    if(!found) {
      let { product, quantity } = payload;
      if(!quantity) quantity = 1;

      totalQuantity += quantity;
      totalPrice += product.marketPrice * quantity;

      keys.push(product.id);
      products.push({ product, quantity });
    }

    state.products = products;
    state.quantity = totalQuantity;
    state.totalPrice = totalPrice;
    state.keys = keys;
  },

  updateCartProduct(state, { id, quantity }) {
    if(!state.keys.includes(id)) return;

    quantity = parseInt(quantity);
    if(isNaN(quantity)) quantity = 1;

    let keys = [],
        products = [],
        totalPrice = 0,
        totalQuantity = 0;

    for(let item of state.products) {
      if(item.product.id === id) {
        item.quantity = quantity;
      }

      if(item.quantity > 0) {
        products.push(item);
        keys.push(item.product.id);
        totalPrice += item.product.marketPrice * item.quantity;
        totalQuantity += item.quantity;
      }

      state.products = products;
      state.keys = keys;
      state.totalPrice = totalPrice;
      state.quantity = totalQuantity;
    }
  },

  setCart(state, { products, totalPrice, quantity, keys }) {
    state.products = products;
    state.totalPrice = totalPrice;
    state.quantity = quantity;
    state.keys = keys;
  }
};

export const actions = {
  saveCart(_, cart) {
    this.$cookies.remove(CART_COOKIE);
    this.$cookies.set(CART_COOKIE, cart, {
      path: "/",
      sameSite: true,
    });
  },

  getCartCookies() {
    return CART_COOKIE;
  }
};
