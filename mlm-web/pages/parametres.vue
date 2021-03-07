<template>
  <div>
    <mlm-title title="Paramètres" />
    <div class="flex mt-4">
      <div class="flex-1 bg-white dark-bg mr-3 py-4 border">
        <NuxtChild />
      </div>
      <div class="w-64 bg-white dark-bg border rounded">
        <ul>
          <li :class="liClass">
            <nuxt-link to="/parametres">Compte</nuxt-link>
          </li>
          <li :class="liClass">
            <nuxt-link to="/parametres/email/">Adresse email</nuxt-link>
          </li>
          <li :class="liClass">
            <nuxt-link to="/parametres/mot-de-passe/">Mot de passe</nuxt-link>
          </li>
          <li :class="liClass">
            <nuxt-link to="/parametres/paiements/">Paiements & cartes bancaires</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MlmTitle from "../components/general/mlm-title";
export default {
  components: {MlmTitle},
  head: () => ({
    title: "Paramètres"
  }),
  computed: {
    liClass: () => "py-2 px-3 font-semibold border-b cursor-pointer hover:bg-gray-100"
  }
}
</script>
