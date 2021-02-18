<template>
  <div class="w-full md:flex md:flex-row-reverse">
    <div class="md:w-1/2 h-full">
      <img :src="product.cover" :alt="product.name" class=" mx-auto mb-4 md:mb-0 object-cover shadow md:shadow-2xl" />
    </div>
    <div class="md:w-1/2 flex flex-col justify-center">
      <div class="text-center">
        <p class="font-semibold mb-3">{{ product.name }}</p>
        <p class="font-semibold mb-2">{{ product.price }} €</p>
        <p class="font-light">{{ product.description }}</p>
        <p class="my-4">
          <nuxt-link class="bg-black text-white font-semibold border-black px-3 py-2" to="">Voir le produit</nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "mlm-catalog-best-seller-details",
  props: ["product"],
  computed: {
  }
}
</script>

<style scoped>
img {
  height: 400px;
  width: 300px;
}

@media screen and (max-width: 400px) {
  img {
    height: 200px;
    width: 200px;
  }
}
</style>
