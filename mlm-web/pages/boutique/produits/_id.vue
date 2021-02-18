<template>
  <as-loading v-if="$apollo.loading" />
  <div v-else>
    <div class="mb-2">
      <button class="btn-primary" @click="$router.push('/boutique')">
        <span class="mr-2 fas fa-arrow-left"></span>
        Retour à la boutique
      </button>
    </div>
    <div class="md:flex pb-8 border-b-2" v-if="getProduct">
      <div class="md:w-1/2 flex flex-wrap justify-center">
        <img
          class="h-48 object-cover"
          v-for="(i, id) in getProduct.covers"
          :key="id"
          :src="i.url" alt="Couverture"
        />
      </div>
      <div class="flex-1 px-6">
        <mlm-title :title="getProduct.name" />

        <p class="font-bold text-xl">{{ getProduct.marketPrice }} €</p>
        <p class="my-4 text-sm">{{ getProduct.description }}</p>

        <div class="my-4 flex gap-x-3">
          <button
            class="btn-primary px-3 py-2"
            @click="handleAddToCart"
          >
            <client-only>
              <i class="fas fa-shopping-bag mr-2"></i>
            </client-only>
            Ajouter au panier
          </button>
          <button
            class="btn-primary px-3 py-2"
          >
            <client-only>
              <i class="fas fa-heart mr-2"></i>
            </client-only>
            Ajouter aux favoris
          </button>
        </div>
      </div>
    </div>
    <div class="py-4 px-8 border-b-2" v-if="getProduct">
      <mlm-title title="Description du produit" />
      <div class="my-4" v-html="getProduct.article"></div>
    </div>
    <div class="py-4 px-8 border-b-2">
      <mlm-title title="Statistiques du produit" />
      <div class="mt-6">
        <horizontal-bar :styles="styles" :chart-data="productsData" />
      </div>
    </div>
    <div class="py-4 px-8">
      <mlm-title title="Revues" />
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import MlmTitle from "../../../components/general/mlm-title";
import HorizontalBar from "../../../components/horizontal-bar";
import AsLoading from "../../../components/as-loading";

const PRODUCT = gql`
    query ($id: ID!){
        getProduct(id: $id) {
            id, name, marketPrice, description,
            reference, covers { url }, mainCover { url },
            colors, article, status, weights,
            options {
                id, option, plusValue, availableQuantity
            }
        }
    }
`;

export default {
  components: {AsLoading, HorizontalBar, MlmTitle},
  head: () => ({
    title: "Informations du produit"
  }),
  data: () => ({
    productsData: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [
        {
          label: 'Commandes',
          backgroundColor: '#118092',
          data: [100, 140, 130, 120, 150, 200, 220, 250, 230, 400, 350, 200]
        },
      ]
    }
  }),
  apollo: {
    getProduct: {
      query: PRODUCT,
      variables() {
        return { id: this.$route.params.id };
      },
      update(data) {
        data.getProduct.selectedOption = data.getProduct.options[0];
        return data.getProduct;
      }
    }
  },
  methods: {
    fillProductsData() {
      this.productsData = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        datasets: [
          {
            label: 'Commandes',
            backgroundColor: '#118092',
            data: [100, 140, 130, 120, 150, 200, 220, 250, 230, 400, 350, 200]
          },
        ]
      };
    },
    async handleAddToCart() {
      if(!this.getProduct)
        return;

      const { id, mainCover, marketPrice, name, selectedOption, options } = this.getProduct;
      const product = { id, mainCover, marketPrice, name, selectedOption, options };

      try {
        await this.$store.commit('cart/addProductInCart', { product, quantity: 1 });
        await this.$store.dispatch('cart/saveCart', this.$store.state.cart);
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    }
  },

  computed: {
    styles: () => ({
      height: "400px",
      position: "relative",
    })
  },
  created() {
    this.fillProductsData();
  }
}
</script>
