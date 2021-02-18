<template>
  <ul class="flex">
    <li
      v-for="(c, i) in catalogues"
      :key="i"
    >
      <nuxt-link :to="`/boutique/catalogues/${c.id}/`"
        class="w-32 border-white rounded bg-white m-2 px-3 py-2 shadow flex justify-between font-semibold"
      >
        <span>{{ c.title }}</span>
        <span class="bg-black text-white text-center w-8 h-8 rounded-full border border-black">{{ c.totalProducts }}</span>
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "mlm-catalogue-list",
  props: ["catalogues"]
}
</script>
