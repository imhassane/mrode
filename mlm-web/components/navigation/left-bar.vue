<template>
  <aside class="border-r-2 fixed bg-white">
    <ul>
      <li :class="linkClass">
        <nuxt-link to="/tableau-de-bord">
          <i class="fas fa-gem mr-2"></i>
          <span class="font-semibold" v-if="showDescription">1500</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/tableau-de-bord">
          <i class="fas fa-home mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Tableau de bord</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/boutique">
          <i class="fas fa-shopping-bag mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Boutique</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/associes">
          <i class="fas fa-users mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Associés</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/revenus">
          <i class="fas fa-euro-sign mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Revenus</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/commandes">
          <i class="fas fa-tags mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Commandes</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/statistiques">
          <i class="fas fa-chart-pie mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Statistiques</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/forum/questions-recentes/">
          <i class="fab fa-forumbee mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Forum</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/notifications">
          <i class="fas fa-bell mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Notifications</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/messages">
          <i class="fas fa-envelope mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Messages</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/parametres">
          <i class="fas fa-cog mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Paramètres</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/deconnexion">
          <i class="fas fa-sign-out-alt mr-2"></i>
          <span class="font-semibold" v-if="showDescription">Déconnexion</span>
        </nuxt-link>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: "left-bar",
  props: ["showDescription"],
  computed: {
    linkClass: () => "border-b-2 py-3 px-4"
  }
}
</script>
