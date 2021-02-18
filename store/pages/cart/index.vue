<i18n lang="yaml">
  fr:
    title: "Panier"
    price: "Prix"
    quantity: "Quantité"
    remove: "Retirer cet article"
    orderResume: "Résumé de la commande"
    cartTotal: "Sous total"
    deliveryPrice: "Frais d'expédition"
    total: "Total"
    nextStep: "Etape suivante: Livraison"

  en:
    title: "Cart"
    price: "Price"
    quantity: "Quantity"
    remove: "Remove this product"
    resume: "Order resume"
    cartTotal: "Subtotal"
    deliveryPrice: "Shipping costs"
    total: "Total"
    nextStep: "Next step: check out"
</i18n>

<template>
  <as-loading v-if="loading" />
  <div class="md:w-2/3 mx-auto py-16" v-else>
    <div class="flex gap-x-8 mb-5">
      <h1 class="font-bold text-lg border-b pb-3 md:w-3/5">{{ $t('title') }}</h1>
      <h1 class="font-bold text-lg border-b pb-4 flex-1" v-if="cart && cart.items.length">{{ $t('orderResume') }}</h1>
    </div>

    <div class="my-4" v-if="error">
      <t-alert variant="danger" :show="error !== null">
        {{ error }}
      </t-alert>
    </div>

    <div v-if="!cart || cart.items.length === 0" class="md:w-3/5">
      <empty-product />
    </div>
    <div class="flex gap-x-8" v-else>
      <div class="md:w-3/5 divide-y">
        <div
          v-for="(item, id) in cart.items"
          :key="id"
          class="flex py-3 gap-x-8"
        >
          <div class="w-40">
            <img :src="item.cover" class="h-40 object-cover" :alt="item.name" />
          </div>
          <div class="flex-1">
            <p class="font-semibold">{{ item.name }}</p>
            <div class="my-3">
              <p class="mb-3 text-sm">{{ $t('price') }}: {{ item.price }} €</p>
              <p class="mb-3 text-sm">{{ $t('quantity') }}</p>
              <input
                type="number" min="0" v-model="item.quantity" class="border h-10 w-20 text-center"
                @focusout="() => handleQuantityChange(item)"
              />
            </div>
            <div class="mt-3">
              <button
                class="text-sm text-red-500"
                @click="() => handleQuantityChange({...item, quantity: 0})">{{ $t('remove') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex justify-between mb-5">
          <p>{{ $t('cartTotal') }}</p>
          <p class="text-right">{{ cart.totalPrice }} €</p>
        </div>
        <div class="flex justify-between mb-5">
          <p>{{ $t('deliveryPrice') }}</p>
          <p class="text-right">0 €</p>
        </div>
        <div class="flex justify-between py-6 border-t font-semibold">
          <p>{{ $t('total') }}</p>
          <p class="text-right">{{ parseFloat(cart.totalPrice) }} €</p>
        </div>
        <div class="my-6 flex justify-center items-center">
          <t-button
            @click="() => $router.push('/checkout/personal-informations/')"
            variant="fullBlack"
          >
            {{ $t('nextStep') }}
          </t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyProduct from "../../components/empty/empty-product";
import AsLoading from "../../components/as-loading";
export default {
  components: {AsLoading, EmptyProduct},
  head(){
    return {
      title: this.$i18n.t('title')
    };
  },
  data: () => ({
    loading: false,
    error: null,
  }),
  methods: {
    async handleQuantityChange(item) {
      try {
        await this.$store.dispatch('cart/addToCart', item);
      } catch(err) {
        this.error = err.message;
      }
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    }
  }
}
</script>
