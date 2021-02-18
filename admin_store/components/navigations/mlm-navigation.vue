<template>
  <nav class="px-1">
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
            :to="`/mlm/${item.to}`"
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
  name: "mlm-navigation",
  computed: {
    items: () => ([
      { to: "new-member", name: "Nouveau membre", icon: "fas fa-user" },
      { to: "waiting", name: "En attente", icon: "fas fa-folder-open" },
    ])
  }
}
</script>
