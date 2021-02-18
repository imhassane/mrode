<template>
  <header class="z-50 bg-white md:flex h-12 border-b-2 sticky top-0">
    <div class="md:w-20 border-r-2 text-center flex flex-col justify-center">
      <span class="fas fa-bars cursor-pointer" @click="onTextBarDisplayChange"></span>
    </div>
    <div class="flex-1 md:flex items-center">
      <div class="md:w-1/2 flex flex-col justify-center px-3 py-0">
        <mlm-search />
      </div>
      <div class="md:w-64">
        <p class="text-sm" v-if="$auth.user.address">
          <i class="fas fa-location-arrow mr-1"></i>
          {{ renderAddress($auth.user.address )}}
        </p>
      </div>
      <div class="flex-1 md:flex flex-col justify-center px-1">
        <ul class="md:flex justify-end">
          <li class="relative">
            <nuxt-link to="/panier/"><i class="fas fa-shopping-cart w-8 mx-1"></i></nuxt-link>
            <p class="absolute text-xs h-5 w-5 flex items-center justify-center rounded"
               style="right: 7px; top: -10px;">
              {{ $store.state.cart.quantity }}
            </p>
          </li>
          <li>
            <i class="fas fa-bell w-8 mx-1"></i>
          </li>
          <li>
            <i class="fas fa-envelope w-8 mx-1"></i>
          </li>
          <li>
            <img :src="$auth.user.avatarUrl"
                 alt=""
                 class="w-6 h-6 object-cover rounded-full mr-4"
            />
          </li>
          <li>
            <i class="fas fa-cog w-8"></i>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import MlmSearch from "../forms/mlm-search";
export default {
  name: "mlm-header",
  components: {MlmSearch},
  props: ["onTextBarDisplayChange"],
  methods: {
    renderAddress(address) {
      return `
        ${address.street.number} ${address.street.name}, ${address.postalCode}, ${address.country}
      `;
    }
  }
}
</script>
