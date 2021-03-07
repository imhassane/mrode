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
            'border-l-4 border-green-500': $route.fullPath.includes(item.to)
          }"
        >
          <nuxt-link
            class="text-sm flex flex-col items-center"
            :to="`/catalogue/${item.to}`"
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
  name: "catalogue-navigation",
  computed: {
    items: () => ([
      { to: "categories", name: "Categories", icon: "fas fa-images" },
      { to: "products", name: "Produits", icon: "fas fa-shopping-bag" },
      { to: "gammes", name: "Gammes", icon: "fas fa-hashtag" },
      { to: "formations", name: "Formations", icon: "fas fa-graduation-cap" },
    ])
  }
}
</script>
