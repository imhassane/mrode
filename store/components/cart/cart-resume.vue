<i18n lang="yaml">
  fr:
    quantity: "Quantité"
    subtotal: "Sous-total"
    shippingPrice: "Frais de transports"

  en:
    quantity: "Quantity"
    subtotal: "Subtotal"
    shippingPrice: "Shipping fees"
</i18n>

<template>
  <div class="px-8">

    <div class="mb-3 text-xs flex flex-col gap-y-4">
      <div
        v-for="(item, id) in cart.items"
        :key="id"
        class="flex gap-x-4 items-center border-b py-4"
      >
        <div class="h-12 w-12 relative">
          <img :src="item.cover" class="w-full h-full object-cover rounded" :alt="item.name" />
          <div
            class="text-xs w-4 h-4 bg-black text-white flex items-center rounded justify-center absolute"
            style="top: -5px; right: -5px;"
          >{{ item.quantity }}</div>
        </div>
        <div class="flex-1">
          <p class="mb-2">{{ item.name }}</p>
          <div class="mt-2 flex items-center gap-x-3">
            <div class="h-4 w-4 rounded-full border" :style="`background-color: ${item.color}`"></div>
            <p>{{ item.weight }} g</p>
          </div>
        </div>
        <div class="w-16">
          <p class="text-right">{{ item.price * item.quantity }} €</p>
        </div>
      </div>
    </div>

    <div class="py-5">
      <div class="flex justify-between">
        <p>{{ $t('subtotal') }}</p>
        <p class="text-right">{{ cart.totalPrice }} €</p>
      </div>
      <div class="mt-2 flex justify-between">
        <p>{{ $t('shippingPrice') }}</p>
        <p class="text-right">{{ 0 }} €</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "cart-resume",
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    }
  }
}
</script>
