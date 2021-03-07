import gql from "graphql-tag";

const GET_MEMBER = gql`
  {
    authenticatedMlmMember {
      id
      firstName, lastName, avatarUrl,
      address { street {name, number}, country, city, postalCode }
      favoritesCount
    }
  }
`;

export const state = () => ({
  loading: false,
  theme: 'light'
});

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setTheme(state, payload) {
    state.theme = payload;
  }
};

export const actions = {
  async nuxtServerInit({commit}, ctx) {
    try {

      // Cart.
      const { data } = await ctx.$api.$get("/cart");
      commit('cart/setCart', data);

      // Theme.
      commit('setTheme', ctx.app.$cookies.get("theme") || 'light')

    } catch { }
  },

  switchThemeMode({ commit }) {
    let theme = this.$colorMode.value;
    if(theme === 'light') {
      theme = 'dark';
    } else {
      theme = 'light';
    }

    this.$cookies.set('theme', theme, { sameSite: true });

    this.$colorMode.preference = theme;
    commit('setTheme', theme);
  }
};
