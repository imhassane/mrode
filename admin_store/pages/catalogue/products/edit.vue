<template>
  <div v-if="$apollo.loading">
    <span class="animate-spin"></span>
  </div>
  <div v-else>
    <h1 :class="$theme.titles.h1 + ' mb-3'">Modifier un produit</h1>
    <hr />

    <div class="my-3">
      <t-alert variant="danger" :show="error !== null">
        {{ error }}
      </t-alert>
    </div>

    <div class="mt-2 mb-3">
      <label :class="$theme.label">Nom du produit</label>
      <t-input v-model="getProduct.name" />
    </div>
    <div class="mb-3 flex">
      <div class="flex-1">
        <label :class="$theme.label">Référence</label>
        <t-input v-model="getProduct.reference" />
      </div>
      <div class="flex-1 mx-1">
        <label :class="$theme.label">Prix de production</label>
        <t-input v-model="getProduct.price" />
      </div>
      <div class="flex-1">
        <label :class="$theme.label">Marge</label>
        <t-input v-model="getProduct.margin" />
      </div>
    </div>
    <div class="mb-3 flex">
      <div class="md:w-2/12">
        <label :class="$theme.label">Poids disponibles</label>
        <t-checkbox-group v-model="selectedWeights" :options="{50: '50 g', 100: '100 g'}" />
      </div>
      <div class="md:w-2/12">
        <label :class="$theme.label">Couleurs disponibles</label>
        <t-checkbox-group v-model="selectedColors" :options="{'#5dfdcb': 'Vert', '#C9F9FF': 'Vert clair'}" />
      </div>
      <div class="flex-1 ml-3">
        <label :class="$theme.label">Catégories du produit</label>
        <div class="flex flex-wrap">
          <label
            v-for="(item, id) in getCategories"
            :key="id"
            :class="$theme.tag + ' flex items-center mr-2'"
          >
            <t-checkbox v-model="selectedCategories" :value="item.id" />
            <span class="ml-2 text-sm">{{ item.name }}</span>
          </label>
        </div>
      </div>
    </div>
    <div class="mb-3 flex">
      <div class="flex-1">
        <label :class="$theme.label">Debut de vente</label>
        <t-datepicker />
      </div>
      <div class="flex-1 mx-2">
        <label :class="$theme.label">Fin de vente</label>
        <t-datepicker />
      </div>
    </div>
    <div class="mb-3">
      <label :class="$theme.label">Description du produit</label>
      <t-textarea v-model="getProduct.description" />
    </div>
    <div class="mb-3">
      <label :class="$theme.label">Indications</label>
      <client-only>
        <ax-editor :initial-content="getProduct.article" :on-content-change="(content) => getProduct.article = content" />
      </client-only>
    </div>
    <hr class="my-8" />

    <div class="mb-4 border-b">
      <div class="mb-3">
        <t-alert variant="danger" :show="error !== null">
          {{ error }}
        </t-alert>
      </div>
      <t-table
        :headers="['Couleur', 'Poids', 'Code barre', 'Valeur', 'Prix public', 'Status', 'Mettre à jour']"
      >
        <template slot="tbody" slot-scope="props">
          <tbody :class="props.tbodyClass">
            <tr :class="props.trClass">
              <td :class="props.tdClass">
                <t-checkbox-group v-model="newOption.colors" :options="{'#5dfdcb': 'Vert', '#C9F9FF': 'Vert clair'}" />
              </td>
              <td :class="props.tdClass">
                <t-checkbox-group v-model="newOption.weights" :options="{50: '50 g', 100: '100 g'}" />
              </td>
              <td :class="props.tdClass">
                <t-input v-model="newOption.barCode" />
              </td>
              <td :class="props.tdClass">
                <t-input v-model="newOption.plusValue" placeholder="Prix" :value="0" />
              </td>
              <td :class="props.tdClass">
                {{ parseFloat(newOption.plusValue || 0) + parseFloat(getProduct.marketPrice) }}€
              </td>
              <td></td>
              <td :class="props.tdClass">
                <t-button variant="success" @click="handleAddNewOption">
                  <client-only><i class="fas fa-plus mr-2"></i></client-only>
                  Ajouter
                </t-button>
                <span class="mx-1"></span>
              </td>
            </tr>
            <tr
              v-for="(o, id) in getProduct.options"
              :key="id"
              :class="props.trClass"
            >
              <td :class="props.tdClass">
                <div class="w-6 h-6 rounded-full border" :style="`background-color: ${o.color}`"></div>
              </td>
              <td :class="props.tdClass"><span :class="$theme.tag">{{ o.weight }} g</span></td>
              <td :class="props.tdClass">
                <t-input type="number" v-model="o.barCode" />
              </td>
              <td :class="props.tdClass">
                <t-input type="number" v-model="o.plusValue" :step="0.1" />
              </td>
              <td :class="props.tdClass">
                <t-tag>{{ parseFloat(getProduct.marketPrice) + parseFloat(o.plusValue )}}€</t-tag>
              </td>
              <td :class="props.tdClass">
                <t-select
                  :options="{
                      'UNAVAILABLE': 'Indisponible',
                      'AVAILABLE': 'Disponible',
                      'OUT_OF_STOCK': 'Rupture de stock',
                      'COMING_SOON': 'Bientot disponible',
                      'PRE_ORDER': 'En précommande',
                  }"
                  v-model="o.status"
                ></t-select>
              </td>
              <td :class="props.tdClass + ' flex items-center'">
                <t-button variant="success" @click="() => handleUpdateOption(o.id, o.barCode, o.plusValue, o.status)">
                  <client-only><i class="fas fa-sync-alt mr-2"></i></client-only>
                  Mettre à jour
                </t-button>
                <span class="mx-1"></span>
                <t-button variant="error" @click="() => handleDeleteOption(o.id)">
                  <client-only><i class="fas fa-trash-alt mr-2"></i></client-only>
                  Supprimer
                </t-button>
              </td>
            </tr>
          </tbody>
        </template>
      </t-table>
    </div>

    <div class="mb-3">
      <t-button variant="success" @click="submit">Mettre à jour le produit</t-button>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";
import AxEditor from "~/components/forms/as-editor";

const GET_PRODUCT = gql`
    query ($id: ID!) {
        getProduct(id: $id) {
            name, description, article, reference,
            sellingStartAt, sellingEndAt, price, margin,
            status, colors, weights, marketPrice,
            categories { id }
            options {
                id, color, weight, active,
                plusValue, barCode, status
            }
        }
    }
`;

const GET_CATEGORIES = gql`{ getCategories(start: 0, count: 20) { id, name, visible, insertedAt } }`;

const CREATE_OPTION = gql`
    mutation ($color: String!, $weight: Int!, $plusValue: Float!, $barCode: String!, $productId: ID!) {
        createOption(color: $color, weight: $weight, plusValue: $plusValue, barCode: $barCode, productId: $productId) {
            id, color, weight, active,
            plusValue
        }
    }
`;

const DELETE_OPTION = gql`
    mutation ($id: ID!) {
        deleteOption(id: $id) { id }
    }
`;

const UPDATE_OPTION  = gql`
    mutation ($optionId: ID!, $barCode: String!, $plusValue: Float!, $status: ProductStatus!) {
        updateOption(optionId: $optionId, barCode: $barCode, plusValue: $plusValue, status: $status) {
            id, color, weight, active, plusValue, status
        }
    }
`;

export default {
  head: () => ({
    title: "Modifier le produit"
  }),
  components: {AxEditor },
  methods: {
    async submit() {

    },
    async handleAddNewOption() {
      try {
        const variables = {
          plusValue: parseFloat(this.newOption.plusValue || 0),
          barCode: this.newOption.barCode,
          productId: this.$route.query.product,
        };

        if(!this.newOption.colors.length || this.newOption.colors.length > 1)
          throw new Error("Choisissez une couleur");
        else
          variables.color = this.newOption.colors[0];

        if(!this.newOption.weights.length || this.newOption.weights.length > 1)
          throw new Error("Choisissez un poids");
        else
          variables.weight = parseInt(this.newOption.weights[0]);

        const productId = this.$route.query.product;

        await this.$apollo.mutate({
          mutation: CREATE_OPTION,
          variables,
          update(store, { data: { createOption } }) {
            const data = store.readQuery({ query: GET_PRODUCT, variables: { id: productId } });
            if(data.getProduct)
              data.getProduct.options.push(createOption);
            store.writeQuery({ query: GET_PRODUCT, variables: { id: productId, }, data });
          }
        })
        this.error = null;
        this.newOption = {};
      } catch (err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    },
    async handleDeleteOption(id) {
      try {
        const productId = this.$route.query.product;
        await this.$apollo.mutate({
          mutation: DELETE_OPTION,
          variables: { id },
          update(store) {
            const data = store.readQuery({ query: GET_PRODUCT, variables: { id: productId } });
            if(data.getProduct)
              data.getProduct.options = data.getProduct.options.filter(o => o.id !== id);
            store.writeQuery({ query: GET_PRODUCT, variables: { id: productId }, data });
          }
        })
      } catch (err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    },
    async handleUpdateOption(optionId, barCode, plusValue, status) {
      try {
        const variables = { optionId, barCode, plusValue: parseFloat(plusValue), status };
        const productId = this.$route.query.product;

        await this.$apollo.mutate({
          mutation: UPDATE_OPTION,
          variables,
          update(store, { data: { updateOption } }) {
            const data = store.readQuery({ query: GET_PRODUCT, variables: { id: productId } });
            if(data.getProduct) {
              data.getProduct.options = data.getProduct.options.map(o => {
                if(o.id === optionId) {
                  o.barCode = barCode;
                  o.plusValue = plusValue;
                  o.status = status;
                }
                return o;
              });
              if(['UNAVAILABLE', 'OUT_OF_STOCK'].includes(status) && !data.getProduct.options.length)
                data.getProduct.status = 'OUT_OF_STOCK';
            }
            store.writeQuery({ query: GET_PRODUCT, variables: { id: productId }, data });
          }
        })
      } catch (err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    },
  },
  watchQuery(newQuery, oldQuery) {
    return newQuery.product !== oldQuery.product;
  },
  asyncData(ctx) {
    if(!ctx.query.product)
      ctx.redirect("/catalogue/products/");
    return {
      error: null,
      success: false,
      newOption: { margin: 300, colors: [], weights: [] },
      selectedCategories: [],
      selectedWeights: [],
      selectedColors: []
    };
  },
  created() {
    if(this.getProduct) {
      this.selectedCategories = this.getProduct.categories.map(({ id }) => id);
      this.selectedWeights = this.getProduct.weights.map(w => '' + w);
      this.selectedColors = this.getProduct.colors.map(c => c);
    }
  },
  apollo: {
    getProduct: {
      query: GET_PRODUCT,
      variables() {
        return { id: this.$route.query.product }
      },
      error(err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    },
    getCategories: {
      query: GET_CATEGORIES,
      error(err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    }
  }
}
</script>
