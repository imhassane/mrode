<template>
  <div>
    <div class="border-b py-4">
      <nuxt-link to="/catalogue/categories" :class="$theme.buttons.primary">Categories</nuxt-link>
      <nuxt-link to="/catalogue/categories/add" :class="$theme.buttons.primary">Nouvelle catégorie</nuxt-link>
    </div>
    <div>
      <NuxtChild />
    </div>
  </div>
</template>

<script>
export default {
  head: () => ({
    title: "Catégories"
  })
}
</script>
