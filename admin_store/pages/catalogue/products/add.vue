<template>
  <div>

    <div class="mt-2 mb-3">
      <h1 :class="$theme.titles.h1 + ' mb-3'">Ajouter un produit</h1>
      <hr />
    </div>

    <div class="my-4">
      <t-alert variant="danger" :show="error !== null">
        {{ error }}
      </t-alert>
      <t-alert variant="success" :show="success">
        Le produit a été ajouté
      </t-alert>
    </div>

    <div class="mt-2 mb-3">
      <label :class="$theme.label">Nom du produit</label>
      <t-input v-model="values.name" />
    </div>
    <div class="mb-3 flex">
      <div class="flex-1">
        <label :class="$theme.label">Référence</label>
        <t-input v-model="values.reference" />
      </div>
      <div class="flex-1 mx-1">
        <label :class="$theme.label">Prix de production</label>
        <t-input v-model="values.price" />
      </div>
      <div class="flex-1">
        <label :class="$theme.label">Marge</label>
        <t-input v-model="values.margin" />
      </div>
    </div>
    <div class="mb-3 flex">
      <div class="md:w-2/12">
        <label :class="$theme.label">Poids disponibles</label>
        <t-checkbox-group v-model="values.weight" :options="{50: '50 g', 100: '100 g'}" />
      </div>
      <div class="md:w-2/12">
        <label :class="$theme.label">Couleurs disponibles</label>
        <t-checkbox-group v-model="values.colors" :options="{'#5dfdcb': 'Vert', '#C9F9FF': 'Vert clair'}" />
      </div>
      <div class="flex-1 ml-3">
        <label :class="$theme.label">Catégories du produit</label>
        <div class="flex flex-wrap">
          <label
            v-for="(item, id) in getCategories"
            :key="id"
            :class="$theme.tag + ' flex items-center mr-2'"
          >
            <t-checkbox v-model="values.categories" :value="item.id" />
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
      <t-textarea v-model="values.description" />
    </div>
    <div class="mb-3">
      <label :class="$theme.label">Indications</label>
      <client-only>
        <ax-editor :on-content-change="(content) => values.article = content" />
      </client-only>
    </div>
    <div class="mb-3">
      <t-button variant="success" @click="submit">Ajouter le produit</t-button>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import AxEditor from "~/components/forms/as-editor";

const GET_CATEGORIES = gql`{ getCategories(start: 0, count: 20) { id, name } }`;

const CREATE_PRODUCT = gql`
    mutation (
        $name: String!, $description: String!, $article: String!,
            $reference: String!, $price: Float!, $margin: Float!,
            $sellingStart: String, $sellingEnd: String,
            $colors: [String!]!, $weight: [Int!],
            $categories: [Int!]
    ) {
        createProduct(
            name: $name, description: $description, article: $article,
            reference: $reference, price: $price, margin: $margin,
            sellingStart: $sellingStart, sellingEnd: $sellingEnd,
            colors: $colors, weight: $weight,
            categories: $categories
        ) { id }
    }
`;

export default {
  components: {AxEditor},
  head: () => ({
    title: "Ajouter un produit"
  }),
  data: () => ({
    error: null, success: false,
    values: {
      name: "Arbre à thé", description: "", article: "", reference: "H100456", price: 1,
      margin: 300, colors: [], weight: [], categories: []
    }
  }),
  apollo: {
    getCategories: {
      query: GET_CATEGORIES,
      error(err) {
        if(err.graphQLErrors)
          this.error = err.graphQLErrors[0].message;
      }
    }
  },
  methods: {
    async submit() {
      this.values.price = parseFloat(this.values.price);
      this.values.margin = parseFloat(this.values.margin);
      this.values.weight = this.values.weight.map(c => parseInt(c));
      this.values.categories = this.values.categories.map(c => parseInt(c));

      const variables = this.values;

      try {
        await this.$apollo.mutate({
          mutation: CREATE_PRODUCT,
          variables,
        });
        this.error = null;
        this.success = true;
      } catch (ex) {
        this.success = false;
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      }
    }
  }
}
</script>
