<template>
  <div v-if="$apollo.loading">
    <span class="animate-spin"></span>
  </div>
  <div v-else>
    <div class="mt-2 mb-4">
      <h1 :class="$theme.titles.h1 + ' mb-3'">Gammes</h1>
      <hr />
    </div>

    <div class="mb-4">
      <div :class="$theme.inputs.text">
        <client-only><span class="fas fa-search mr-2"></span></client-only>
        <input type="search" v-model="search" class="flex-1 h-full py-1 px-2" placeholder="Rechercher une gamme" />
      </div>
    </div>

    <div>
      <div class="flex items-center text-sm py-2 border border-green-500 bg-green-500 text-white px-3 rounded-t">
        <div class="w-16">
          <t-checkbox />
        </div>
        <div class="w-16">ID</div>
        <div class="w-2/12">Nom</div>
        <div class="w-1/12">Statut</div>
        <div class="w-1/12">Date de création</div>
      </div>
      <div>
          <div
            class="flex py-2 border-b"
            v-for="(item, id) in getGammes"
            :key="id"
          >
            <div class="w-16"><t-checkbox /></div>
            <div class="w-16">{{ item.id }}</div>
            <div class="w-2/12">{{ item.name }}</div>
            <div class="w-1/12">
              <client-only><t-toggle v-model="item.visible" variant="success" :checked="item.visible" /></client-only>
            </div>
            <div class="w-2/12"><span :class="$theme.tag + ' text-sm'">{{ new Date(item.insertedAt).toLocaleDateString() }}</span></div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const GET_GAMMES = gql`
    { getGammes(start: 0, count: 20) { id, name, visible, insertedAt } }
`;

export default {
  head: () => ({
    title: "Gammes",
  }),
  data: () => ({
    search: "",
    error: null
  }),
  apollo: {
    getGammes: {
      query: GET_GAMMES,
      error(err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    }
  },
  methods: {
    handleStatusChange(gamme) {
      console.log(gamme)
    }
  }
}
</script>
