<template>
  <div class="py-12">
    <div class="flex flex-wrap">
      <mlm-catalogue-products-details
        v-for="(p, index) in products"
        :key="index"
        :product="p"
      />
    </div>

    <div class="bg-black text-white py-8 text-center mt-10">
      <i class="fas fa-arrow-down animate-bounce"></i>
    </div>
  </div>
</template>

<script>

import MlmCatalogueProductsDetails from "./mlm-catalogue-products-details";
export default {
  name: "mlm-catalogue-products",
  components: {MlmCatalogueProductsDetails},
  props: ["products"],
}
</script>
