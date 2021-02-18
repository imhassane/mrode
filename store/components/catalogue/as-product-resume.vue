<i18n lang="yaml">
  fr:
    preOrder: "Précommande"
    outOfStock: "Rupture de stock"

  en:
    preOrder: "Pre-order"
    outOfStock: "Out of stock"
</i18n>

<template>
  <div class="md:w-1/4">
    <div class="p-3">
      <div class="relative">
        <nuxt-link :to="`/product/${id}/${slug}`" class="h-64">
          <img :src="coverUrl" :alt="name" class="h-64 w-full object-cover" />
        </nuxt-link>
        <p
          class="px-2 h-6 z-10 rounded text-white text-xs flex justify-center items-center"
          style="position: absolute; top: 10px; right: 5px;"
          v-if="status !== 'AVAILABLE'"
          :class="{
            'bg-red-300': status === 'OUT_OF_STOCK',
            'bg-green-500': status !== 'OUT_OF_STOCK'
          }"
        >
          {{ renderStatus(status) }}
        </p>
        <div
          class="absolute h-4 z-10 flex gap-x-1 items-center"
          style="bottom: 10px; left: 10px;"
        >
          <div
            v-for="(c, cId) in colors"
            :key="cId"
            :style="`background-color: ${c}`"
            class="h-full w-4 rounded-full border"
          ></div>
        </div>
      </div>
      <div class="my-2">
        <p class="text-sm font-semibold text-center">{{ name }}</p>
        <div class="block my-2 border-b-2 border-black w-12 mx-auto"></div>
        <div class="flex divide-x-2 divide-black py-3 justify-center">
          <div
            class="flex-1 flex items-center justify-center px-3 font-semibold"
          >{{ marketPrice }}€</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "as-product-resume",
  props: ["id", "slug", "name", "marketPrice", "coverUrl", "status", "colors"],
  methods: {
    renderStatus(s) {
      if(s === "OUT_OF_STOCK")
        return this.$t("outOfStock");
      else if(s === "PRE_ORDER")
        return this.$t("preOrder");
    },
    async handleAddToCart() {
      const item = {
        id: this.id,
        name: this.name,
        price: this.marketPrice,
        cover: this.coverUrl,
        status: this.status,
        quantity: 1,
      };

      try {
        await this.$store.dispatch('cart/addToCart', item);
      } catch {
        alert("hello")
      }
    }
  }
}
</script>
