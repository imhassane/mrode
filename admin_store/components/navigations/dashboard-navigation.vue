<template>
  <nav>
    <ul>
      <li
        v-for="(item, id) in items"
        :key="id"
      >
        <div
          class="py-3 border-b"
          :class="{
            'border-b-2 border-green-500': $route.fullPath.includes(item.to)
          }"
        >
          <nuxt-link
            class="text-sm flex flex-col items-center"
            :to="`/dashboard/${item.to}`"
          >
            <client-only><span class="block" :class="item.icon"></span></client-only>
            <span>{{ item.name }}</span>
          </nuxt-link>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "dashboard-navigation",
  computed: {
    items: () => ([
      { to: "stock", name: "Stock", icon: "fas fa-truck-loading" },
      { to: "statistics", name: "Statistiques", icon: "fas fa-chart-pie" },
      { to: "orders", name: "Commandes", icon: "fas fa-shopping-cart" },
      { to: "delivery", name: "Livraisons", icon: "fas fa-shipping-fast" },
      { to: "returns", name: "Retours", icon: "fas fa-undo" },
      { to: "payments", name: "Paiements", icon: "fas fa-money-bill" },
    ])
  }
}
</script>
