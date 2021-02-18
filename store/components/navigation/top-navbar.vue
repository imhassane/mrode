<i18n lang="yaml">
  fr:
    about: "A propos"
    contact: "Contact"
    faq: "FAQ"

  en:
    about: "About"
    contact: "Contact"
    faq: "FAQ"
</i18n>

<template>
  <div class="border-b flex font-medium items-center py-1 px-10 text-xs">
    <ul class="flex-1 flex">
      <li class="mr-4">
        <nuxt-link to="/">{{ $t('about') }}</nuxt-link>
      </li>
      <li class="mr-4">
        <nuxt-link to="/">{{ $t('contact') }}</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/">{{ $t('faq') }}</nuxt-link>
      </li>
    </ul>
    <ul class="flex-1 justify-end flex">
      <li>
        <lang-switcher />
      </li>
    </ul>
  </div>
</template>
<script>
import LangSwitcher from "../lang-switcher";
export default {
  components: {LangSwitcher}
}
</script>
