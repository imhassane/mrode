<template>
  <div>
    <div class="border-b py-4">
      <nuxt-link to="/catalogue/gammes" :class="$theme.buttons.primary">Gammes</nuxt-link>
      <nuxt-link to="/catalogue/gammes/add" :class="$theme.buttons.primary">Nouvelle gamme</nuxt-link>
    </div>
    <div>
      <NuxtChild />
    </div>
  </div>
</template>
