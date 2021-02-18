<template>
  <div>
    <mlm-title title="Panier" />
    <hr class="my-4" />
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
          <div class="flex mt-4">
            <div class="mr-4">
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
</template>

<script>
import MlmTitle from "../../components/general/mlm-title";
export default {
  components: {MlmTitle},
  head: () => ({
    title: "Panier"
  }),
  computed: {
    cart() {
      return this.$store.state.cart;
    }
  }
}
</script>
