export const state = () => ({
  error: null,
  infos: null,
  showError: false,
  showInfos: false,
});

export const mutations = {
  setError(state, error) {
    state.error = error;
    state.infos = null;

    state.showError = true;
    state.showInfos = false;
  },
  setInfos(state, infos) {
    state.infos = infos;
    state.error = null;

    state.showError = false;
    state.showInfos = true;
  },
  removeMessages(state) {
    state.infos = null;
    state.error = null;

    state.showError = false;
    state.showInfos = false;
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
