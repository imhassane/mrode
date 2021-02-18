<template>
  <div>
    <div class="px-4 py-1">
      <h2 class="font-semibold pb-2 border-b mb-4">Paramètres du compte</h2>
      <div class="pb-3 border-b">
        <p class="font-semibold mb-3">Image de profil</p>
        <div class="flex">
          <div class="w-32">
            <img
              class="w-24 h-24 mx-auto rounded-full object-cover"
              :src="$auth.user.avatarUrl" alt="" />
          </div>
          <div class="ml-3 flex-1">
            <p class="font-semibold">Télécharger l'image de profil</p>
            <p><small>De préférence, choisissez une image à dimensions égales (Ex: 300 * 300px)</small></p>
            <div class="mt-3">
              <button class="btn-primary">Charger l'image</button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <p class="font-semibold mb-3">Informations additionnelles</p>
        <form class="my-4">
          <div class="flex">
            <div class="flex-1 mr-2">
              <label for="firstName" :class="labelClass">Prénom</label>
              <input type="text" id="firstName" v-model="$auth.user.firstName" :class="inputClass" />
            </div>
            <div class="flex-1">
              <label for="lastName" :class="labelClass">Nom</label>
              <input type="text" id="lastName" v-model="$auth.user.lastName" :class="inputClass" />
            </div>
          </div>
          <div class="mt-3">
            <button class="btn-primary float-right">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>
    <div class="px-4 mt-4">
      <h2 class="font-semibold mb-4">Adresses</h2>
      <div class="mt-2 mb-1">
        <p class="text-sm">
          Ces adresses seront utilisées lors du passage de vos commandes,
          assurez-vous de saisir les bonnes adresses.
        </p>
      </div>
      <div class="mt-4 mb-2">
        <p :class="labelClass">Nouvelle adresse</p>
        <div class="flex justify-between gap-x-1 items-center mt-2">
          <div class="w-24">
            <input type="number" class="w-full" placeholder="N° de rue" v-model="values.address.street.number" />
          </div>
          <div class="flex-1">
            <input type="text" class="w-full" placeholder="Nom de rue" v-model="values.address.street.name" />
          </div>
          <div class="w-40">
            <input type="number" class="w-full" placeholder="Code postal" v-model="values.address.postalCode" />
          </div>
          <div class="w-32">
            <input type="text" class="w-full" placeholder="Ville" v-model="values.address.city" />
          </div>
          <div class="w-40">
            <input type="text" class="w-full" placeholder="Pays" v-model="values.address.country" />
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <button class="btn-primary" @click="handleAddAddress">Ajouter l'adresse</button>
      </div>
      <div class="border-t pt-2 my-3">
        <div class="flex flex-col py-2 divide-y">
          <div class="font-semibold text-lg pb-2">Adresses</div>
          <div
            class="py-4 flex gap-x-2"
            v-for="(add, id) in getMlmMemberAddresses"
            :key="id"
          >
            <div class="flex-1">
              {{ renderAddress(add) }}
            </div>
            <div class="w-auto">
              <span
                class="text-sm text-white bg-green-500 p-1 rounded border border-green-500"
                v-if="add.mainAddress"
              >Adresse actuelle</span>
            </div>
            <div class="w-auto">
              <button v-if="!add.mainAddress" class="btn-primary" @click="() => handleSetCurrentAddress(add.id)">Choisir comme adresse actuelle</button>
            </div>
            <div class="w-auto">
              <button class="btn-red" @click="() => handleDeleteAddress(add.id)">
                <i class="fas fa-trash mr-1"></i>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const ADD_ADDRESS = gql`
    mutation ($city: String!, $postalCode: Int!, $country: String!, $streetName: String!, $streetNumber: String!) {
        addAddress(city: $city, postalCode: $postalCode, country: $country, streetName: $streetName, streetNumber: $streetNumber) {
            id, street { name, number }, country, city, postalCode, mainAddress
        }
    }
`;

const GET_ADDRESSES = gql`query ($id: ID!){ getMlmMemberAddresses(id: $id) { id, street { name, number }, country, city, postalCode, mainAddress } }`

export default {
  data: () => ({
    values: { address: { street: { name: "rue ", number: null }, postalCode: null, country: null, city: null } },
  }),
  computed: {
    inputClass: () => "px-3 py-1 border w-full block mt-2",
    labelClass: () => "font-semibold"
  },
  methods: {
    async handleAddAddress() {
      const { values } = this;
      if(isNaN(parseInt(values.address.postalCode))) {
        await this.$store.dispatch('messages/handleError', new Error("Le code postal est incorrect"));
      }
      try {
        const variables = {
          streetName: values.address.street.name,
          streetNumber: values.address.street.number,
          postalCode: parseInt(values.address.postalCode),
          country: values.address.country, city: values.address.city,
        };

        const updateVariables = { id: this.$store.state.auth.user.id };
        await this.$apollo.mutate({
          mutation: ADD_ADDRESS,
          variables,
          update(store, { data: { addAddress } }) {
            const data = store.readQuery({ query: GET_ADDRESSES, variables: updateVariables });
            data.getMlmMemberAddresses.push(addAddress);
            store.writeQuery({ query: GET_ADDRESSES, data, variables: updateVariables });
          }
        });
        this.values.address = { street: {} };
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    },
    async handleDeleteAddress(id) {
      try {
        const updateVariables = { id: this.$store.state.auth.user.id };
        await this.$apollo.mutate({
          mutation: gql`mutation ($id: ID!) { deleteAddress(id: $id) { id }}`,
          variables: { id },
          update(store) {
            const data = store.readQuery({ query: GET_ADDRESSES, variables: updateVariables });
            data.getMlmMemberAddresses = data.getMlmMemberAddresses.filter(a => a.id !== id);
            store.writeQuery({ query: GET_ADDRESSES, variables: updateVariables, data });
          }
        })
      } catch(ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    },
    async handleSetCurrentAddress(id) {
      try {
        const updateVariables = { id: this.$store.state.auth.user.id };
        const { data: { setCurrentAddress }} = await this.$apollo.mutate({
          mutation: gql`mutation ($id: ID!) { setCurrentAddress(id: $id) { street {name, number}, country, city, postalCode }}`,
          variables: { id },
          update(store) {
            const data = store.readQuery({ query: GET_ADDRESSES, variables: updateVariables });
            data.getMlmMemberAddresses = data.getMlmMemberAddresses.map(a => {
              if(a.id === id)
                a.mainAddress = true;
              else
                a.mainAddress = false;
              return a;
            });
            store.writeQuery({ query: GET_ADDRESSES, variables: updateVariables, data });
          }
        });
        await this.$store.commit('auth/setUserAddress', setCurrentAddress);
      } catch(ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    },
    renderAddress(address) {
      return `
        ${address.street.number} ${address.street.name}, ${address.postalCode}, ${address.country}
      `;
    }
  },
  apollo: {
    getMlmMemberAddresses: {
      query: GET_ADDRESSES,
      variables() {
        return { id: this.$store.state.auth.user.id };
      },
      async error(err) {
        await this.$store.dispatch('messages/handleError', err);
      }
    }
  }
}
</script>
