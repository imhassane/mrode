<template>
  <div>
    <header>
      <navbar />
    </header>
    <section>
      <div class="md:flex">
        <v-snackbar
          v-model="messages.showError" color="deep-orange lighten-2"
        >
          {{ messages.error }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="blue"
              text
              v-bind="attrs"
              @click="$store.commit('messages/removeMessages')"
            >
              Fermer
            </v-btn>
          </template>
        </v-snackbar>
        <v-snackbar
          v-model="messages.showInfos"
        >
          {{ messages.infos }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="blue"
              text
              v-bind="attrs"
              @click="$store.commit('messages/removeMessages')"
            >
              Fermer
            </v-btn>
          </template>
        </v-snackbar>
        <main class="flex-1">
          <Nuxt />
        </main>
      </div>
    </section>
    <footer>

    </footer>
  </div>
</template>

<script>
import Navbar from "../components/navigations/navbar";
export default {
  components: {Navbar},
  computed: {
    messages() {
      return this.$store.state.messages;
    }
  }
}
</script>
