<template>
  <div>
    <div class="border-b py-4">
      <nuxt-link to="/dashboard/stock" :class="$theme.buttons.primary">Stock</nuxt-link>
      <nuxt-link to="/dashboard/stock/update" :class="$theme.buttons.primary">Mettre à jour le stock</nuxt-link>
      <nuxt-link to="/dashboard/stock/orders" :class="$theme.buttons.primary">Commandes</nuxt-link>
    </div>
    <div>
      <NuxtChild />
    </div>
  </div>
</template>
