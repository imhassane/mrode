<template>
  <div>
    <h1 :class="$theme.titles.h1 + ' mb-3'">Catégories</h1>
    <hr />
    <div class="mb-3 mt-1">
      <div :class="$theme.inputs.text">
        <span class="fas fa-search"></span>
        <input type="search" v-model="search" placeholder="Rechercher une catégorie" class="flex-1 px-3 py-1" />
      </div>
    </div>

    <as-error v-if="error">{{ error }}</as-error>
    <div class="mt-5">
      <div class="flex items-center text-sm py-3 border border-green-500 bg-green-500 text-white px-3 rounded-t">
        <div class="w-16">
          <input type="checkbox" class="border border-gray-300 rounded" />
        </div>
        <div class="w-16">ID</div>
        <div class="w-3/12">Nom</div>
        <div class="w-2/12">Statut</div>
        <div class="w-2/12">Date de création</div>
      </div>
      <div>
        <div
          v-for="(item, id) in getCategories"
          :key="id"
          class="flex items-center text-sm py-3 border-b px-3"
          v-if="item.name.toLowerCase().includes(search.toLowerCase())"
        >
          <div class="w-16"><t-checkbox /></div>
          <div class="w-16">{{ item.id }}</div>
          <div class="w-3/12">{{ item.name }}</div>
          <div class="w-2/12">
            <span :class="$theme.tags.success" v-if="item.visible">Public</span>
            <span :class="$theme.tags.danger" v-else>Privé</span>
          </div>
          <div class="w-2/12"><span :class="$theme.tags.success">{{ new Date(item.insertedAt).toLocaleDateString() }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsError from "../../../components/messages/as-error";
import gql from "graphql-tag";

// UPDATE: AddCategory, EditProduct (for updating the cache)
const GET_CATEGORIES = gql`
  { getCategories(start: 0, count: 20) { id, name, visible, insertedAt } }
`;

export default {
  components: {AsError},
  data: () => ({
    error: null,
    search: ""
  }),
  apollo: {
    getCategories: {
      query: GET_CATEGORIES,
      error(err) {
        if(err.graphQLErrors)
          this.error = err.graphQLErrors[0].message;
      }
    }
  }
}
</script>
