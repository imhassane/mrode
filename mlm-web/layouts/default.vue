<template>
  <div class="">
    <mlm-header :on-text-bar-display-change="handleLeftBarTextDisplay" />
    <div class="md:flex bg-gray-100">
      <div class="md:block relative mr-4" :class="{ 'md:w-40': showLeftBarText, 'md:w-10': !showLeftBarText, 'hidden': hideLeftBar}">
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
    <v-tour name="explanationTour" :steps="steps"></v-tour>
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
    showLeftBarText: false,
    hideLeftBar: true,
  }),
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    loading() {
      return this.$store.state.loading;
    },
    steps() {
      return [
        { target: '[data-tour-step="gem"]', content: `Vos revenus` },
        { target: '[data-tour-step="shop"]', content: `Vous pouvez accéder à nos produits via notre boutique` },
        { target: '[data-tour-step="members"]', content: `Vous avez la possibilité de voir votre arbre hierarchique, la personne qui vous a invité et tous les personnes qui sont venues sur notre plateforme grace à vous` },
        { target: '[data-tour-step="gains"]', content: `Pour gérer vos revenus, déclarer vos factures et avoir un historique de vos revenus` },
        { target: '[data-tour-step="orders"]', content: `Une section spécialement faite pour gérer vos commandes et les suivre` },
        { target: '[data-tour-step="stats"]', content: `Vous avez la possibilité de voir nos produits qui se vendent le plus et toutes les statistiques à notre disposition afin de vous aider dans vos choix de produit` },
        { target: '[data-tour-step="forum"]', content: `Pour accéder au forum, posez vos questions et participer à la communauté` },
        { target: '[data-tour-step="notifications"]', content: `Vos notifications sont regroupées ici` },
        { target: '[data-tour-step="settings"]', content: `Pour accéder à vos informations personnelles et les éditer` },
        { target: '[data-tour-step="forum"]', content: `Pour vous déconnecter` },
      ]
    }
  },
  methods: {
    handleLeftBarTextDisplay() {
      this.showLeftBarText = !this.showLeftBarText;
      if(window.innerWidth < 450) {
        this.hideLeftBar = !this.hideLeftBar;
      }
    }
  },
  mounted() {
    this.$tours.explanationTour.start();
  }
}
</script>

<style>
select::-ms-expand {
  display: none;
}

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
