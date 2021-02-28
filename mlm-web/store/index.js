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
});

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  }
};

export const actions = {
  async nuxtServerInit({commit}, ctx) {
    try {

      // Cart.
      const { data } = await ctx.$api.$get("/cart");
      commit('cart/setCart', data);
    } catch { }
  },
};
