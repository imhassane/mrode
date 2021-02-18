<template>
  <div class="bestsellsers-container relative py-24 px-16">
    <h1 class="text-2xl md:text-6xl mb-12">Best sellers du catalogue</h1>
    <div class="h-full">
      <mlm-catalog-best-seller-details
        v-for="(c, index) in products"
        :key="index"
        :product="c"
        v-if="shouldRender(index)"
      />
    </div>
    <div class="left-arrow"><i class="fas fa-arrow-left cursor-pointer" @click="() => renderNext(-1)"></i></div>
    <div class="right-arrow"><i class="fas fa-arrow-right cursor-pointer" @lick="() => renderNext(1)"></i></div>
  </div>
</template>

<script>
import MlmCatalogBestSellerDetails from "./mlm-catalogue-best-seller-details";
export default {
  name: "mlm-catalogue-best-sellers",
  components: {MlmCatalogBestSellerDetails},
  data: () => ({
    currentIndex: 0,
  }),
  props: ["products"],
  methods: {
    shouldRender(index) {
      return index === this.currentIndex;
    },
    renderNext(direction) {
      let index = this.currentIndex;
      index += direction;

      if(index <= 0)
        index = this.products.length - 1;
      else if(index >= this.products.length - 1)
        index = 0;

      this.currentIndex = index;
    }
  }
}
</script>

<style scoped>
.bestsellsers-container {
  width: 100%;
}

.left-arrow, .right-arrow {
  position: absolute;
  top: 50%;
}

h1 {
  font-family: sans-serif !important;
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
}
</style>
