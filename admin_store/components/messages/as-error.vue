<template>
  <div class="error-block mb-4" @click="removeMessage">{{ messages.error }}</div>
</template>

<script>
export default {
  name: "as-error",
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
