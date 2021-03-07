<i18n lang="yaml">
  fr:
    requiredFormations: "Vous devez acheter les kits de bases pour pouvoir passer une commande"

  en:
    requiredFormations: "You need to buy the basic kits to use our shop"
</i18n>

<template>
  <as-loading v-if="$apollo.loading" />
  <div v-else>
    <p class="pb-1 border-b font-bold text-xl">Catalogues</p>
    <mlm-catalogue-list :catalogues="catalogues" />

    <v-alert
      v-if="!$auth.hasAllRequiredFormations"
      border="top"
      color="indigo"
      dark
    >
      {{ $t('requiredFormations') }}
    </v-alert>

    <p class="my-4 pb-2 font-bold text-xl border-b">Derniers produits</p>
    <mlm-products-list v-if="getStoreProducts" :products="getStoreProducts" />

    <div class="my-4 flex justify-center">
      <button class="bg-black border-black text-white rounded font-semibold px-3 py-2">
        Charger plus de produits
      </button>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import MlmCatalogueList from "../../components/shop/mlm-catalogue-list";
import MlmProductsList from "../../components/shop/mlm-products-list";
import AsLoading from "../../components/as-loading";

const PRODUCTS = gql`
    {
        getStoreProducts(start: 0, count: 20) {
            id, name, marketPrice, slug,
            mainCover { url },
            status, colors
        }
    }
`;

export default {
  components: {AsLoading, MlmProductsList, MlmCatalogueList},
  head: () => ({
    title: "Notre boutique",
  }),
  apollo: {
    getStoreProducts: {
      query: PRODUCTS,
    }
  },
  computed: {
    catalogues: () => ([
      { id: 1, title: "Parfums", totalProducts: 10 },
      { id: 2, title: "Soins", totalProducts: 5 },
      { id: 3, title: "Beauté", totalProducts: 12 },
      { id: 4, title: "Huiles", totalProducts: 3 },
      { id: 5, title: "Cheveux", totalProducts: 7 },
    ]),
  }
}
</script>
