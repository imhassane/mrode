<template>
  <div class="min-h-screen">
    <header class="flex justify-between py-2">
      <div class="flex-1"></div>
      <div class="flex-1 flex gap-x-2 justify-end">
        <lang-switcher />
      </div>
    </header>
    <section>
      <div class="absolute bottom-0 w-full z-50">
        <div class="md:w-2/3 mx-auto">
          <mlm-error v-if="messages.error" />
          <mlm-infos v-else-if="messages.infos" />
        </div>
      </div>
      <as-loading v-if="loading" />
      <Nuxt />
    </section>
    <footer>

    </footer>
  </div>
</template>

<script>
import LangSwitcher from "../components/lang-switcher";
import MlmError from "../components/messages/mlm-error";
import MlmInfos from "../components/messages/mlm-infos";
import AsLoading from "../components/as-loading";
export default {
  name: "guest",
  middleware: "guest",
  components: {AsLoading, MlmInfos, MlmError, LangSwitcher},
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    loading() {
      return this.$store.state.loading;
    }
  }
}
</script>
