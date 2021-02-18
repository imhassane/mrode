const REGISTER_FIRST_STEP = "JrlP4ilBUuMyb8C";
const REGISTER_SECOND_STEP = "8ORl4ilUyrMyb8C";

export const state = () => ({
  user: null,
  registerFirstStep: null,
  registerSecondStep: null,
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setRegisterFirstStep(state, user) {
    state.registerFirstStep = user;
  },
  setRegisterSecondStep(state, user) {
    state.registerSecondStep = user;
  }
};

export const actions = {
  async getRegisterFirstStep({commit}) {
    try {
      const user = this.$cookies.get(REGISTER_FIRST_STEP);
      commit('setRegisterFirstStep', user);
    } catch {}
  },
  async getRegisterSecondStep({commit}) {
    try {
      const user = this.$cookies.get(REGISTER_SECOND_STEP);
      commit('setRegisterSecondStep', user);
    } catch {}
  },
  async registerFirstStep({dispatch}, values) {
    try {
      this.$cookies.set(REGISTER_FIRST_STEP, values);
      dispatch('getRegisterFirstStep');
    } catch {}
  },
  async registerSecondStep({dispatch}, values) {
    try {
      this.$cookies.set(REGISTER_SECOND_STEP, values);
      dispatch('getRegisterSecondStep');
    } catch {}
  },
  async removeRegisterCookies({commit}) {
    try {
      this.$cookies.remove(REGISTER_FIRST_STEP);
      this.$cookies.remove(REGISTER_SECOND_STEP);
      commit('setRegisterFirstStep', null);
      commit('setRegisterSecondStep', null);
    } catch { }
  }
}
