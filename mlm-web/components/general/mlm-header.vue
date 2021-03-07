<template>
  <header class="z-50 bg-white dark-bg flex h-12 border-b-2 sticky top-0">
    <div class="w-20 border-r-2 text-center flex flex-col justify-center">
      <span class="fas fa-bars cursor-pointer" @click="onTextBarDisplayChange"></span>
    </div>
    <div class="flex-1 flex items-center">
      <div class="hidden md:w-1/2 md:flex flex-col justify-center px-3 py-0">
        <mlm-search />
      </div>
      <div class="hidden md:block md:w-64">
        <p class="text-sm" v-if="$auth.user.address">
          <client-only><i class="fas fa-location-arrow mr-1"></i></client-only>
          {{ renderAddress($auth.user.address )}}
        </p>
      </div>
      <div class="flex-1 flex flex-col justify-center px-1">
        <ul class="flex gap-x-1 justify-end">
          <li class="relative">
            <nuxt-link to="/panier/">
              <client-only><i class="fas fa-shopping-cart w-8 mx-1"></i></client-only>
            </nuxt-link>
            <p class="absolute text-xs h-5 w-5 flex items-center justify-center rounded"
               style="right: 7px; top: -10px;">
              {{ $store.state.cart.quantity }}
            </p>
          </li>
          <li class="relative">
            <nuxt-link to="/favoris">
              <client-only><i class="fas fa-heart w-8 mx-1"></i></client-only>
            </nuxt-link>
            <p class="absolute text-xs h-5 w-5 flex items-center justify-center rounded"
               style="right: 7px; top: -10px;">
              {{ $auth.user.favoritesCount }}
            </p>
          </li>
          <li>
            <client-only><i class="fas fa-bell w-8 mx-1"></i></client-only>
          </li>
          <li>
            <client-only><i class="fas fa-envelope w-8 mx-1"></i></client-only>
          </li>
          <li>
            <img :src="$auth.user.avatarUrl"
                 alt=""
                 class="w-6 h-6 object-cover rounded-full mr-4"
            />
          </li>
          <li>
            <client-only><i class="fas fa-cog w-8"></i></client-only>
          </li>
          <li>
            <client-only>
              <i class="fas fa-moon cursor-pointer" @click="$store.dispatch('switchThemeMode')"></i>
            </client-only>
          </li>
          <li class="ml-2">
            <lang-switcher />
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import MlmSearch from "../forms/mlm-search";
import LangSwitcher from "../lang-switcher";
export default {
  name: "mlm-header",
  components: {LangSwitcher, MlmSearch},
  props: ["onTextBarDisplayChange"],
  methods: {
    renderAddress(address) {
      return `
        ${address.street.number} ${address.street.name}, ${address.postalCode}, ${address.country}
      `;
    },
  }
}
</script>
