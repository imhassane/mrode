<template>
  <div>
    <div class="flex">
      <div class="w-32">
        <dashboard-navigation />
      </div>
      <div class="flex-1 mx-6">
        <NuxtChild />
      </div>
    </div>
  </div>
</template>


<script>
import DashboardNavigation from "../components/navigations/dashboard-navigation";
export default {
  components: {DashboardNavigation},
  head: () => ({
    title: "Tableau de bord"
  })
}
</script>
