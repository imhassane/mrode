<i18n lang="yaml">
  fr:
    newsletter:
      text: "Retrouvez nos nouveaux produits, les promotions et nos offres d'emploi en rejoignant notre newsletter."
      input: "Votre adresse email"
    poweredby: "Développé par Hassane"
    about: "A propos"
    contact: "Contact"
    faq: "FAQ"
    legal: "Mentions légales"
    privacy: "Vie privée"
    conditions: "Conditions d'utilisation"
    delivery: "Livraisons"
    payment: "Paiements"
    returns: "Politique de retour"

  en:
    newsletter:
      text: "Be the first to know about our new products, promotions and our job offers by joining our newsletter."
      input: "Enter the address email"
    poweredby: "Powered by Hassane"
    about: "About"
    contact: "Contact"
    faq: "FAQ"
    legal: "Legal mentions"
    privacy: "Privacy"
    conditions: "Conditions"
    delivery: "Delivery"
    payment: "Payment"
    returns: "Returns policy"
</i18n>

<template>
  <footer class="border-t py-20 px-10 text-sm">

    <div class="flex">
      <div class="flex-1 flex">
        <ul class="flex-1">
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('delivery') }}</nuxt-link>
          </li>
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('payment') }}</nuxt-link>
          </li>
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('returns') }}</nuxt-link>
          </li>
        </ul>
        <ul class="flex-1">
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('legal') }}</nuxt-link>
          </li>
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('privacy') }}</nuxt-link>
          </li>
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('conditions') }}</nuxt-link>
          </li>
        </ul>
        <ul class="flex-1 flex flex-col">
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('about') }}</nuxt-link>
          </li>
          <li class="mb-4">
            <nuxt-link to="/">{{ $t('contact') }}</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/">{{ $t('faq') }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="flex-1">
        <div class="w-2/3 mx-auto">
          <p class="leading-relaxed">{{ $t('newsletter.text') }}</p>
          <div class="mt-3">
            <div class="flex border-b border-black py-2">
              <input type="email" :placeholder="$t('newsletter.input')" class="flex-1 text-black" />
              <img width="25" src="https://img.icons8.com/ios/50/000000/important-mail.png"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 px-24 flex flex-col justify-center">
      <div class="flex justify-end">
        <lang-switcher />
      </div>
      <p class="mt-5 text-right">{{ $t('poweredby') }}</p>
    </div>

  </footer>
</template>
<script>
import LangSwitcher from "../lang-switcher";
export default {
  components: {LangSwitcher}
}
</script>
