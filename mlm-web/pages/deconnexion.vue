<template>
  <div>
    <h1>Vous êtes déconnecté, on espère vous revoir bientôt</h1>
  </div>
</template>

<script>
export default {
  async mounted() {
    await this.$auth.logout();
  }
}
</script>
