<template>
  <div v-if="$apollo.loading"><span class="animate-spin"></span></div>
  <div v-else>
    <h1 :class="$theme.titles.h1 + ' mb-3'">Ajouter une gamme</h1>
    <hr />

    <div class="my-6">

      <as-error v-if="error">{{ error}}</as-error>
      <as-success v-if="success">La gamme a été ajoutée avec succès</as-success>

      <div>
        <label :class="$theme.label">Nom de la gamme</label>
        <div :class="$theme.inputs.text">
          <input type="text" class="flex-1" v-model="values.name" placeholder="Nom de la gamme" />
        </div>
      </div>

      <div class="my-4">
        <label :class="$theme.label">Decrivez la gamme</label>
        <div :class="$theme.inputs.text + ' mb-3'">
          <textarea class="h-24 w-full p-1" v-model="values.description" placeholder="Description de la gamme"></textarea>
        </div>
      </div>

      <div class="mb-4">
        <label :class="$theme.label">Sélectionnez les produits de la gamme</label>
        <div class="mt-3">
          <div class="flex flex-wrap">
            <div
              v-for="(item, id) in getCategories"
              :key="id"
              class="md:w-1/4 pr-2"
            >
              <t-card :header="item.name" >
                <ul class="divide-y">
                  <li
                    v-for="(product, _id) in item.products"
                    :key="_id"
                    class="py-2"
                  >
                    <client-only>
                      <t-toggle variant="success" @click="() => handleAddToSelected(product.id)" :checked="values.products.includes(product.id)" />
                    </client-only>
                    <span class="ml-2">{{ product.name }}</span>
                  </li>
                </ul>
              </t-card>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end my-3">
        <button :class="$theme.buttons.primary" @click="submit">Ajouter</button>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const CREATE_GAMME = gql`
    mutation ($name: String!, $description: String!, $products: [Int!]) {
        createGamme(name: $name, description: $description, products: $products) { id, name, visible, insertedAt }
    }
`;

const GET_PRODUCTS = gql`{ getCategories(start: 0, count: 20) { name, products(start: 0, count: 20) { id, name } } }`;

const GET_GAMMES = gql`
    { getGammes(start: 0, count: 20) { id, name, visible, insertedAt } }
`;

export default {
  head: () => ({
    title: "Ajouter une gamme"
  }),
  data: () => ({
    error: null,
    values: {
      name: "", description: "", products: []
    },
    success: false,
  }),
  apollo: {
    getCategories: {
      query: GET_PRODUCTS,
      error(err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    }
  },
  methods: {
    async submit() {
      const variables = this.values;
      try {
        await this.$apollo.mutate({
          mutation: CREATE_GAMME,
          variables,
          update(store, { data: { createCategory } }) {
            const data = store.readQuery({ query: GET_GAMMES });
            if(data.getGammes)
              data.getGammes.push(createCategory);
            store.writeQuery({ query: GET_GAMMES, data });
          }
        });
        this.error = null;
        this.success = true;
      } catch(ex) {
        this.success = false;
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      }
    },
    handleAddToSelected(id) {
      id = parseInt(id);

      if(this.values.products.includes(id))
        this.values.products = this.values.products.filter(i => i !== id);
      else
        this.values.products.push(id);
    }
  }
}
</script>
