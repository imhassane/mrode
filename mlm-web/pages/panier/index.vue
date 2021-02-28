<template>
  <div>
    <mlm-title title="Panier" />
    <hr class="my-4" />
    <div class="md:flex md:gap-x-4">
      <div class="flex-1">
        <div v-if="$store.state.cart.quantity">
          <div
            v-for="(p, i) in cart.products"
            :key="i"
            class="flex py-4 border-b-2"
          >
            <div>
              <img :src="p.product.mainCover.url" alt="" class="object-cover h-40 w-40" />
            </div>
            <div class="px-4">
              <p class="font-bold text-xl">{{ p.product.name }}</p>
              <p class="font-bold">{{ p.product.marketPrice }} €</p>
              <p class="font-light"></p>
              <div class="flex flex-col md:flex-row gap-x-2 md:gap-x-4 gap-y-2 mt-4">
                <div class="flex gap-x-2">
                  <button class="btn-primary"
                          @click="() => $store.commit('cart/updateCartProduct', { id: p.product.id, quantity: p.quantity - 1})"
                  >-</button>
                  <input
                    type="number" :value="p.quantity" :min="0" class="border rounded w-24 px-3 py-2 text-center"
                    @change="({ target: { value }}) => $store.commit('cart/updateCartProduct', { id: p.product.id, quantity: value })"
                  />
                  <button class="btn-primary"
                          @click="() => $store.commit('cart/updateCartProduct', { id: p.product.id, quantity: p.quantity + 1})"
                  >+</button>
                </div>
                <button class="btn-red"
                        @click="() => $store.commit('cart/updateCartProduct', { id: p.product.id, quantity: 0})"
                >Retirer</button>
              </div>
            </div>
          </div>
          <div class="my-4">
            <p>
              Sous-total: <span class="ml-4">{{ $store.state.cart.totalPrice }} €</span>
            </p>
          </div>
          <div class="my-4">
            <button class="btn-primary">Valider mon panier</button>
          </div>
        </div>
        <div v-else>
          <p>Le panier est vide</p>
        </div>
      </div>
      <div class="md:w-1/3">
        <h2 class="mb-2 font-semibold">Adresse de livraison</h2>
        <p class="mb-2 text-sm">
          Vous pouvez ajouter une adresse dans les paramètres de votre compte
        </p>
        <div class="border rounded py-2 px-3 flex flex-col divide-y bg-white">
          <div
            v-for="(add, id) in getMlmMemberAddresses"
            :key="id"
            class="py-2 flex items-center text-xs"
          >
            <div class="flex-1">
              {{ renderAddress(add) }}
            </div>
            <div class="w-auto">
              <button class="btn-primary"
                      v-if="!add.mainAddress"
                      @click="$store.dispatch('address/setCurrentUserAddress', {id: add.id, user: $auth.user.id})"
              >Choisir</button>
              <span class="tag tag-primary" v-else>Adresse actuelle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import MlmTitle from "../../components/general/mlm-title";

const GET_ADDRESSES = gql`query ($id: ID!){ getMlmMemberAddresses(id: $id) { id, street { name, number }, country, city, postalCode, mainAddress } }`

export default {
  components: {MlmTitle},
  head: () => ({
    title: "Panier"
  }),
  computed: {
    cart() {
      return this.$store.state.cart;
    }
  },
  methods: {
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
