<template>
  <div class="w-full md:w-1/4 px-1">
    <div>
      <nuxt-link :to="``">
        <img :src="product.mainCover.url" :alt="product.name" class="object-cover w-full catalog-product-cover" />
      </nuxt-link>
    </div>
    <div class="py-2">
      <p class="uppercase font-semibold">{{ product.name }}</p>
      <p>{{ product.marketPrice }} €</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "mlm-catalogue-products-details",
  props: ["product"],
}
</script>

<style scoped>
.catalog-product-cover {
  height: 400px;
}

@media screen and (max-width: 400px) {
  .catalog-product-cover {
    height: 200px;
  }
}
</style>
