import gql from "graphql-tag";

const SET_ADDRESS = gql`mutation ($id: ID!) { setCurrentAddress(id: $id) { street {name, number}, country, city, postalCode }}`;

const GET_ADDRESSES = gql`query ($id: ID!){ getMlmMemberAddresses(id: $id) { id, street { name, number }, country, city, postalCode, mainAddress } }`


export const state = () => {

};

export const actions = {
  async setCurrentUserAddress({commit}, payload) {
    const client = this.app.apolloProvider.defaultClient;
    try {
      const updateVariables = {id: payload.user};
      const { data: { setCurrentAddress } } = await client.mutate({
        mutation: SET_ADDRESS,
        variables: { id: payload.id },
        update(store) {
          const data = store.readQuery({ query: GET_ADDRESSES, variables: updateVariables });
          data.getMlmMemberAddresses = data.getMlmMemberAddresses.map(a => {
            if(a.id === payload.id)
              a.mainAddress = true;
            else
              a.mainAddress = false;
            return a;
          });
          store.writeQuery({ query: GET_ADDRESSES, variables: updateVariables, data });
        }
      });

      await commit('auth/setUserAddress', setCurrentAddress, {root: true});
    } catch (ex) {
      await commit('messages/removeMessages', {root: true});

      if(ex.graphQLErrors && ex.graphQLErrors.length)
        await commit('messages/setError', ex.graphQLErrors[0].message, {root: true});
      else
        await commit('messages/setError', ex.message, {root: true});
    }
  }
};
