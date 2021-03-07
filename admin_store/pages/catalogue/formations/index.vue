<template>
  <div>
    <h1 :class="$theme.titles.h1 + ' mb-3'">Formations</h1>
    <hr />
    <div class="mb-3 mt-1">
      <div :class="$theme.inputs.text">
        <span class="fas fa-search"></span>
        <input type="search" v-model="search" placeholder="Rechercher une formation" class="flex-1 px-3 py-1" />
      </div>
    </div>

    <as-error v-if="error">{{ error }}</as-error>
    <div class="mt-5">
      <div class="flex gap-x-1 items-center text-sm py-3 border border-green-500 bg-green-500 text-white rounded-t">
        <div class="w-16">
          <input type="checkbox" class="border border-gray-300 rounded" />
        </div>
        <div class="w-16">ID</div>
        <div class="w-16">Image</div>
        <div class="w-3/12">Nom</div>
        <div class="w-1/12">Requis</div>
        <div class="w-1/12">Visible</div>
        <div class="w-2/12">Date de création</div>
        <div class="flex-1"></div>
      </div>
      <div>
        <div
          v-for="(item, id) in getAllFormations"
          :key="id"
          class="flex items-center text-sm py-3 border-b gap-x-1"
          v-if="item.name.toLowerCase().includes(search.toLowerCase())"
        >
          <div class="w-16"><t-checkbox /></div>
          <div class="w-16">{{ item.id }}</div>
          <div class="w-16">
            <img :src="item.cover" class="w-8 h-8 rounded object-cover" alt="" />
          </div>
          <div class="w-3/12">{{ item.name }}</div>
          <div class="w-1/12">
            <span :class="$theme.tags.success" v-if="!item.isRequired">Non requis</span>
            <span :class="$theme.tags.danger" v-else>Requis</span>
          </div>
          <div class="w-1/12">
            <t-toggle
              variant="success" :checked="item.isVisible"
              @click="() => switchFormationVisible(item)"
            />
          </div>
          <div class="w-2/12"><span :class="$theme.tags.success">{{ new Date(item.insertedAt).toLocaleDateString() }}</span></div>
          <div class="flex-1 flex flex-wrap gap-x-1">
            <t-button variant="success" @click="$router.push(`/catalogue/formations/details/${item.id}`)">
              <client-only><i class="fas fa-eye mr-2"></i>Voir</client-only>
            </t-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";

// Update: add.vue
const GET_FORMATIONS = gql`{ getAllFormations { id, name, isRequired, isVisible, insertedAt, cover } }`;

const SWITCH_FORMATION_VISIBLE = gql`mutation ($id: ID!) { switchFormationVisible(id: $id) { isVisible } }`;


export default {
  head: () => ({
    title: "Formations"
  }),
  data: () => ({
    search: "",
    error: null,
    showAddFormationModal: false,
  }),
  methods: {
    async switchFormationVisible({id}) {
      if(!id) return;

      try {
        await this.$apollo.mutate({
          mutation: SWITCH_FORMATION_VISIBLE, variables: { id },
          update(store) {
            const data = store.readQuery({ query: GET_FORMATIONS });
            data.getAllFormations = data.getAllFormations.map(f => {
              if(f.id === id)
                f.isVisible = true;

              return f;
            });
            store.writeQuery({ query: GET_FORMATIONS, data });
          }
        })
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    }
  },
  apollo: {
    getAllFormations: {
      query: GET_FORMATIONS,
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
