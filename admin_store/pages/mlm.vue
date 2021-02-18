<template>
  <div>
    <div class="flex">
      <div class="w-40">
        <mlm-navigation />
      </div>
      <div class="flex-1 mx-6">
        <NuxtChild />
      </div>
    </div>
  </div>
</template>

<script>
import MlmNavigation from "@/components/navigations/mlm-navigation";
export default {
  components: {MlmNavigation},
  head: () => ({
    title: "Reseau MLM"
  })
}
</script>
