<template>
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/4 px-2 py-1 mb-3" v-for="(p, i) in products" :key="i">
      <div>
        <nuxt-link class="w-full" :to="`/boutique/produits/${p.id}`">
          <img :src="p.mainCover.url" :alt="p.name" class="object-cover h-64 w-full shop-product-cover" />
        </nuxt-link>
      </div>
      <div>
        <p class="font-semibold uppercase">{{ p.name }}</p>
        <p class="font-light">{{ p.marketPrice }} €</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mlm-products-list",
  props: ["products"]
}
</script>
