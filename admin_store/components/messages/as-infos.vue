<template>
  <div class="infos-block mb-4" @click="removeMessage">{{ messages.infos }}</div>
</template>

<script>
export default {
  name: "as-infos",
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
