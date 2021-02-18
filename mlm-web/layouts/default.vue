<template>
  <div class="">
    <mlm-header :on-text-bar-display-change="handleLeftBarTextDisplay" />
    <div class="md:flex bg-gray-100">
      <div class="relative mr-4" :class="{ 'md:w-40': showLeftBarText, 'md:w-10': !showLeftBarText}">
        <left-bar :show-description="showLeftBarText" />
      </div>
      <main class="md:flex-1 px-3 py-4" style="min-height: 92vh;">
        <div class="absolute bottom-0 w-full">
          <div class="md:w-2/3 mx-auto">
            <mlm-error v-if="messages.error" />
            <mlm-infos v-else-if="messages.infos" />
          </div>
        </div>
        <as-loading v-if="loading" />
        <Nuxt />
      </main>
    </div>
  </div>
</template>

<script>
import MlmHeader from "../components/general/mlm-header";
import LeftBar from "../components/navigation/left-bar";
import MlmInfos from "../components/messages/mlm-infos";
import MlmError from "../components/messages/mlm-error";
import AsLoading from "../components/as-loading";
export default {
  name: "default",
  middleware: "auth",
  components: {AsLoading, MlmError, MlmInfos, LeftBar, MlmHeader},
  data: () => ({
    showLeftBarText: false
  }),
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    handleLeftBarTextDisplay() {
      this.showLeftBarText = !this.showLeftBarText;
    }
  }
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
