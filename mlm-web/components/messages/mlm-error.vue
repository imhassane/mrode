<template>
  <v-snackbar
    v-model="messages.showError"
  >
    {{ messages.error }}

    <template v-slot:action="{ attrs }">
      <v-btn
        color="pink"
        text
        v-bind="attrs"
        @click="removeMessage"
      >
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "mlm-error",
  methods: {
    removeMessage() {
      this.$store.commit('messages/removeMessages');
    }
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    }
  }
}
</script>
