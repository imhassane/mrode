<i18n lang="yaml">
  fr:
    addToCart: "Ajouter au panier"
    color: "Couleurs disponibles"
    weight: "Poids disponibles"
    quantity: "Quantité"
    unavailable: "Ce produit est indisponible"

  en:
    addToCart: "Add to cart"
    color: "Colors availables"
    weight: "Weights availables"
    quantity: "Quantity"
    unavailable: "The product is not available"
</i18n>

<template>
  <as-loading v-if="$apollo.loading" />
  <div class="md:w-2/3 mx-auto py-16" v-else>
    <div>
      <div class="flex">
        <div class="flex-1" style="height: 420px;">
          <img :src="getProduct.mainCover.url" class="w-full h-full object-cover border" />
        </div>
        <div class="flex-1 pl-8">
          <h1 class="font-bold text-3xl">{{ getProduct.name }}</h1>
          <p class="my-2 text-sm text-gray-700">{{ getProduct.reference }}</p>
          <p class="my-3 text-lg">{{ parseFloat(getProduct.marketPrice) + parseFloat(currentOption.plusValue) }} €</p>

          <p class="mt-3 font-semibold text-sm">{{ $t('color') }}</p>
          <div class="my-1 flex gap-x-1">
            <div
              v-for="(c, id) in getProduct.colors"
              :key="id"
              class="w-8 h-8 rounded-full border"
              :style="`background-color: ${c}`"
              @click="() => updateOptionColor(c)"
            ></div>
          </div>

          <p class="mt-2 font-semibold text-sm">{{ $t('weight') }}</p>
          <div class="my-1 flex items-center gap-x-1">
            <t-button
              v-for="(w, wId) in getProduct.weights"
              :key="wId"
              :variant="selectedOption.weight === w ? 'success' : 'black'"
              @click="() => updateOptionWeight(w)"
            >{{ w }} g</t-button>

          </div>
          <p class="mt-4 mb-2 font-semibold text-sm">{{ $t('quantity') }}</p>
          <div>
            <input type="number" required min="1" :max="currentOption.availableQuantity" v-model="quantity" class="border h-10 w-20 text-center" />
          </div>

          <div class="my-4" v-if="cartError">
            <t-alert variant="error" :show="cartError !== null">
              {{ cartError }}
            </t-alert>
          </div>

          <div class="my-8">
            <t-button
              v-if="['AVAILABLE', 'PRE_ORDER'].includes(getProduct.status) && (quantity < currentOption.availableQuantity)"
              @click="addToCart"
              variant="black"
              :disabled="quantity > currentOption.availableQuantity"
            >
              {{ $t('addToCart') }}
            </t-button>
            <t-button :disabled="true" variant="black" v-else>{{ $t('unavailable') }}</t-button>
          </div>
        </div>
      </div>
      <div class="mt-8 text-sm">
        <div v-html="getProduct.article"></div>
      </div>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";
import AsLoading from "../../../components/as-loading";

const PRODUCT = gql`
    query ($id: ID!){
        getProduct(id: $id) {
            id, slug, name, marketPrice,
            reference, covers { url }, mainCover { url },
            colors, article, status, weights,
            options {
                id, option, plusValue, availableQuantity
            }
        }
    }
`;

export default {
  components: {AsLoading},
  head: () => ({
    title: "Détails du produit"
  }),
  data: () => ({
    error: null,
    cartError: null,
    quantity: 1,
    selectedOption: { color: null, weight: null, },
    currentOption: null,
  }),
  methods: {
    async addToCart() {
      try {
        const quantity = parseInt(this.quantity);
        const data = {
          id: this.getProduct.id,
          name: this.getProduct.name,
          cover: this.getProduct.mainCover.url,
          price: parseFloat(this.getProduct.marketPrice) + parseFloat(this.currentOption.plusValue),
          ...{...this.currentOption, optionId: this.currentOption.id },
          ...this.selectedOption,
          quantity,
        };
        await this.$store.dispatch('cart/addToCart', data);
      } catch (err) {
        this.cartError = err.message;
      }
    },
    updateOptionColor(color) {
      this.selectedOption.color = color;
      this.updateOption(this.getProduct.options);
    },
    updateOptionWeight(weight) {
      this.selectedOption.weight = weight;
      this.updateOption(this.getProduct.options);
    },
    updateOption(options) {
      const { color, weight } = this.selectedOption;
      const [current] = options.filter(({ option }) => option === `${weight}_${color}`);
      this.currentOption = current;
    }
  },
  apollo: {
    getProduct: {
      query: PRODUCT,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      error(err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      },
      update({ getProduct }) {
        this.selectedOption = {
          color: getProduct.colors[0],
          weight: getProduct.weights[0],
        }
        this.updateOption(getProduct.options)
        return getProduct;
      }
    }
  }
}
</script>
