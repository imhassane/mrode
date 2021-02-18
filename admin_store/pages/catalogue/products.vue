<template>
  <div>
    <div class="border-b py-4">
      <nuxt-link to="/catalogue/products" :class="$theme.buttons.primary">Produits</nuxt-link>
      <nuxt-link to="/catalogue/products/add" :class="$theme.buttons.primary">Nouveau produit</nuxt-link>
    </div>
    <div>
      <NuxtChild />
    </div>
  </div>
</template>
