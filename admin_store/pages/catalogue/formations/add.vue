<template>
  <div>
    <v-form>
      <v-text-field clearable label="Nom de la formation" v-model="values.name"></v-text-field>
      <div class="my-3 flex gap-x-5">
        <v-text-field clearable label="Prix" v-model="values.price"></v-text-field>
        <v-select label="Langue" :items="['fr', 'en']" v-model="values.locale"></v-select>
        <v-checkbox label="Cette formation est obligatoire" v-model="values.required"></v-checkbox>
      </div>
      <div class="mb-3">
        <v-textarea label="Description de la formation" v-model="values.description"></v-textarea>
      </div>
      <div class="mb-3">
        <v-text-field label="Image de couverture" clearable v-model="values.cover"></v-text-field>
      </div>
      <v-btn @click="handleAddFormation">Ajouter la formation</v-btn>
    </v-form>
  </div>
</template>

<script>
import gql from "graphql-tag";
const ADD_FORMATION = gql`
    mutation ($name: String!, $price: Float!, $locale: String!, $cover: String!, $required: Boolean, $description: String!) {
      addFormation(
          name: $name, price: $price, locale: $locale, cover: $cover,
          required: $required, description: $description
      ) {
        id, name, isRequired, isVisible, insertedAt, cover
      }
    }
`;

const FORMATIONS = gql`{ getAllFormations { id, name, isRequired, isVisible, insertedAt, cover } }`;

export default {
  head: () => ({
    title: "Nouvelle formation"
  }),
  data: () => ({
    values: {
      name: null, price: null, locale: "fr", cover: "https://images.pexels.com/photos/2622170/pexels-photo-2622170.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      required: false, description: null,
    }
  }),
  methods: {
    async handleAddFormation() {
      try {
        this.values.price = parseFloat(this.values.price);

        await this.$apollo.mutate({
          mutation: ADD_FORMATION, variables: this.values,
          update(store, { data: { addFormation }}) {
            const data = store.readQuery({ query: FORMATIONS });
            if(data.getAllFormations)
              data.getAllFormations.push(addFormation);
            store.writeQuery({ query: FORMATIONS, data });
          }
        });

        await this.$store.commit('messages/setInfos', "La formation a bien été ajoutée");
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    }
  }
}
</script>
