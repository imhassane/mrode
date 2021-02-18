<template>
  <div>
    <div class="flex">
      <div class="w-32">
        <catalogue-navigation />
      </div>
      <div class="flex-1 mx-8">
        <NuxtChild />
      </div>
    </div>
  </div>
</template>

<script>
import CatalogueNavigation from "../components/navigations/catalogue-navigation";
export default {
  components: {CatalogueNavigation},
  head: () => ({
    title: "Catalogue"
  })
}
</script>
