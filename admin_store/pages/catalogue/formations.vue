<template>
  <div>
    <div class="border-b py-4">
      <nuxt-link to="/catalogue/formations" :class="$theme.buttons.primary">Formations</nuxt-link>
      <nuxt-link to="/catalogue/formations/add" :class="$theme.buttons.primary">Nouvelle formation</nuxt-link>
    </div>

    <t-modal v-model="showAddFormationModal" header="Nouvelle formation"></t-modal>

    <div>
      <NuxtChild />
    </div>
  </div>
</template>

<script>
export default {
  head: () => ({
    title: "Formations"
  }),
  data: () => ({
    showAddFormationModal: false,
  })
}
</script>
