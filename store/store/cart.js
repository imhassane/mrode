export const state = () => ({
  cart: {
    items: [],
    totalPrice: 0,
  }
});

export const mutations = {
  setCart(state, cart) {
    state.cart = cart;
  }
};

export const actions = {
  async addToCart({ commit }, item) {
    const cart = await this.$axios.$post("/api/cart/add", item);
    commit('setCart', cart);
  },

  async removeCart({ commit }, item) {
    const cart = await this.$axios.$delete("/api/remove-cart");
    commit('setCart', cart);
  },
};
