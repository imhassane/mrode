import gql from "graphql-tag";

const GET_MEMBER = gql`
  {
    authenticatedMlmMember {
      id
      firstName, lastName, avatarUrl,
      address { street {name, number}, country, city, postalCode }
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
      const client = ctx.app.apolloProvider.defaultClient;
      const { data: { authenticatedMlmMember } } = await client.query({
        query: GET_MEMBER,
      });
      commit('auth/setUser', authenticatedMlmMember);
      commit('auth/setAuth', true);

      // Cart.
      const { data } = await ctx.$api.$get("/cart");
      commit('cart/setCart', data);
    } catch { }
  },
};
