<template>
  <div class="relative" @click="visible = !visible" @mouseenter="visible = true" @mouseleave="visible = false">
    <div>
      <img class="cursor-pointer" width="25" :src="getLang($i18n.locale)" />
    </div>
    <div class="absolute pt-1 w-32 right-0 z-30" v-if="visible">
      <ul class="bg-white border w-full shadow">
        <li
          v-for="(item, id) in langs"
          :key="id"
          class="flex p-1 border-b"
        >
          <img width="25" :src="getLang(item.value)" />
          <nuxt-link :to="switchLocalePath(item.value)" class="ml-3">{{ item.name }}</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "lang-switcher",
  data: () => ({
    icons: {
      fr: "https://img.icons8.com/color/48/000000/france-circular.png",
      en: "https://img.icons8.com/fluent/48/000000/usa-circular.png"
    },
    visible: false
  }),
  computed: {
    langs: () => ([
      { value: "fr", name: "Français" },
      { value: "en", name: "English" },
    ])
  },
  methods: {
    getLang(lang) {
      return this.icons[lang];
    }
  }
}
</script>
