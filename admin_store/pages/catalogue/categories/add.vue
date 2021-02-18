<template>
  <div>
    <h1 :class="$theme.titles.h1 + ' mb-3'">Ajouter une catégorie</h1>
    <hr />

    <div class="my-6">

      <as-error v-if="error">{{ error}}</as-error>
      <as-success v-if="success">La catégorie a été ajoutée avec succès</as-success>

      <div :class="$theme.inputs.text">
        <input type="text" class="flex-1" v-model="values.name" placeholder="Nom de la catégorie" />
      </div>
      <div :class="$theme.inputs.text + ' my-3'">
        <textarea class="h-24 w-full p-1" v-model="values.description" placeholder="Description de la catégorie"></textarea>
      </div>
      <div class="flex justify-end my-3">
        <button :class="$theme.buttons.primary" @click="submit">Ajouter</button>
      </div>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";
import AsError from "~/components/messages/as-error";
import AsSuccess from "~/components/messages/as-success";

const CREATE_CATEGORY = gql`
    mutation ($name: String!, $description: String!) {
        createCategory(name: $name, description: $description) { id, name, visible, insertedAt }
    }
`;

const GET_CATEGORIES = gql`{ getCategories(start: 0, count: 20) { id, name, visible, insertedAt } }`;

export default {
  components: {AsSuccess, AsError},
  head: () => ({
    title: "Ajouter une catégorie"
  }),
  data: () => ({
    values: { name: "", description: "" },
    error: null, success: false,
  }),
  methods: {
    async submit() {
      try {
        const variables = this.values;
        await this.$apollo.mutate({
          mutation: CREATE_CATEGORY,
          variables,
          update(store, { data: { createCategory } }) {
            const data = store.readQuery({ query: GET_CATEGORIES });
            if(data.getCategories)
              data.getCategories.push(createCategory);
            store.writeQuery({ query: GET_CATEGORIES, data });
          }
        });
        this.error = null;
        this.success = true;
      } catch (ex) {
        this.success = false;
        if(ex.graphQLErrors)
          this.error = ex.graphQLErrors[0].message;
      }
    }
  }
}
</script>
