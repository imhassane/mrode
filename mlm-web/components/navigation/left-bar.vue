<i18n lang="yaml">
  fr:
    dashboard: "Tableau de bord"
    shop: "Boutique"
    members: "Associés"
    incomes: "Revenus"
    orders: "Commandes"
    stats: "Statistiques"
    forum: "Forum"
    notifications: "Notifications"
    messages: "Messages"
    settings: "Paramètres"
    signout: "Déconnexion"

  en:
    dashboard: "Dashboard"
    shop: "Shop"
    members: "Partners"
    incomes: "Incomes"
    orders: "Orders"
    stats: "Statistics"
    forum: "Forum"
    notifications: "Notifications"
    messages: "Messages"
    settings: "Settings"
    signout: "Log out"

</i18n>

<template>
  <aside class="border-r-2 min-h-full fixed bg-white">
    <ul>
      <li :class="linkClass">
        <nuxt-link to="/tableau-de-bord" data-tour-step="gem">
          <i class="fas fa-gem mr-2"></i>
          <span class="font-semibold" v-if="showDescription">1500</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/tableau-de-bord">
          <i class="fas fa-home mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('dashboard') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/boutique" data-tour-step="shop">
          <i class="fas fa-shopping-bag mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('shop') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/associes" data-tour-step="members">
          <i class="fas fa-users mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('members') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/revenus" data-tour-step="gains">
          <i class="fas fa-euro-sign mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('incomes') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/commandes" data-tour-step="orders">
          <i class="fas fa-tags mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('orders') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/statistiques" data-tour-step="stats">
          <i class="fas fa-chart-pie mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('stats') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/forum/questions-recentes/" data-tour-step="forum">
          <i class="fab fa-forumbee mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('forum') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/notifications" data-tour-step="notifications">
          <i class="fas fa-bell mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('notifications') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/messages" data-tour-step="messages">
          <i class="fas fa-envelope mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('messages') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/parametres" data-tour-step="settings">
          <i class="fas fa-cog mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('settings') }}</span>
        </nuxt-link>
      </li>
      <li :class="linkClass">
        <nuxt-link to="/deconnexion" data-tour-step="signout">
          <i class="fas fa-sign-out-alt mr-2"></i>
          <span class="font-semibold" v-if="showDescription">{{ $t('signout') }}</span>
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
