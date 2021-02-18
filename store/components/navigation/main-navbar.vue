<i18n lang="yaml">
  fr:
    shop: "Boutique"
    catalogue: "Catalogue"
    blog: "Journal"
    upcoming: "Bientôt"

  en:
    shop: "Shop"
    catalogue: "Catalogue"
    blog: "Journal"
    upcoming: "Coming soon"
</i18n>

<template>
  <nav class="bg-white flex pt-8 pb-4 px-10 items-center sticky top-0 border-b z-20 bg-white">
    <ul class="w-64">
      <li>
        <img width="25" src="https://img.icons8.com/ios/50/000000/search--v1.png"/>
      </li>
    </ul>
    <ul class="flex-1 flex justify-center uppercase">
      <li>
        <nuxt-link to="/">{{ $t('shop') }}</nuxt-link>
      </li>
      <li class="ml-8">
        <nuxt-link to="/">{{ $t('catalogue') }}</nuxt-link>
      </li>
      <li class="mx-10">
        <nuxt-link to="/">MRODE</nuxt-link>
      </li>
      <li class="mr-8">
        <nuxt-link to="/">{{ $t('blog') }}</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/">{{ $t('upcoming') }}</nuxt-link>
      </li>
    </ul>
    <ul class="w-64 flex justify-end">
      <li class="relative">
        <nuxt-link to="/cart/" class="relative bg-red-500">
          <img width="25" src="https://img.icons8.com/ios/50/000000/shopping-bag--v1.png"/>
        </nuxt-link>
        <div
          style="position: absolute; z-index: 10; right: -8px; bottom: 10px; font-size: 12px;"
          class="bg-black text-white flex justify-center items-center w-4 h-4 rounded-full"
        >
          {{ cartCount }}
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'main-navbar',
  computed: {
    cartCount() {
      const cart = this.$store.state.cart.cart;

      return (cart.items || []).length;
    }
  }
}
</script>
