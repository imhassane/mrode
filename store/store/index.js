export const state = () => ({
  user: null,
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  }
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const data = await this.$axios.$get("/api/cart/");
    console.log(data);
    commit('cart/setCart', data);

    const res = await this.$axios.$get("/api/get-customer");
    commit('setUser', res.data);
  }
};
