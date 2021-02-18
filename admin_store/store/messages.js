export const state = () => ({
  error: null,
  infos: null,
});

export const mutations = {
  setError(state, error) {
    state.error = error;
    state.infos = null;
  },
  setInfos(state, infos) {
    state.infos = infos;
    state.error = null;
  },
  removeMessages(state) {
    state.infos = null;
    state.error = null;
  }
};

export const actions = {
  async handleError({commit}, ex) {
    if(ex.graphQLErrors && ex.graphQLErrors.length)
      await commit('setError', ex.graphQLErrors[0].message);
    else
      await commit('setError', ex.message);
  }
};
