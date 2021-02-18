<template>
  <div>
    <div class="border-b py-4">
      <nuxt-link to="/dashboard/orders" :class="$theme.buttons.primary">En attente</nuxt-link>
      <nuxt-link to="/dashboard/orders/all" :class="$theme.buttons.primary">Commandes en traitement</nuxt-link>
      <nuxt-link to="/dashboard/orders/preparation-began" :class="$theme.buttons.primary">En traitement</nuxt-link>
      <nuxt-link to="/dashboard/orders/preparation-done" :class="$theme.buttons.primary">Traitées</nuxt-link>
      <nuxt-link to="/dashboard/orders/dispatched" :class="$theme.buttons.primary">Expédiées</nuxt-link>
      <nuxt-link to="/dashboard/orders/closed" :class="$theme.buttons.primary">Terminées</nuxt-link>
      <nuxt-link to="/dashboard/orders/pre-order" :class="$theme.buttons.warningFull">Précommandes</nuxt-link>
      <nuxt-link to="/dashboard/orders/unpaid" :class="$theme.buttons.dangerFull">Non payées</nuxt-link>
    </div>
    <div>
      <NuxtChild />
    </div>
  </div>
</template>
