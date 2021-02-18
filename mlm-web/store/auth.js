export const state = () => ({
  user: null,
  auth: false,
  token: null,
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setAuth(state, auth) {
    state.auth = auth;
  },
  setToken(state, token) {
    state.token = token;
  },
  setUserAddress(state, address) {
    state.user = { ...state.user, address };
  }
};

export const actions = {
}
