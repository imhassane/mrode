<template>
  <div v-if="$apollo.loading"></div>
  <div v-else>
    <mlm-modal v-if="showAddUser" :on-close="onCloseAddUser">
      <template>
        <div>
          <h1 class="font-bold text-xl mb-4">Adresse email</h1>
          <input
            type="email" class="w-full px-3 py-2 border"
            placeholder="Ex: john.doe@gmail.com"
            v-model="email"
          />
          <p class="my-2 text-sm text-red-500" v-if="error">{{ error }}</p>
          <div class="mt-2">
            <button class="btn-primary float-right" @click="handleSendInvitation">Ajouter</button>
          </div>
        </div>
      </template>
    </mlm-modal>
    <div class="md:flex justify-between">
      <mlm-title title="Mes associés" />
      <div>
        <button
          class="bg-black border-black text-white font-semibold rounded px-3 py-1"
          @click="showAddUser = !showAddUser"
        >Ajouter</button>
      </div>
    </div>
    <div class="mt-8 flex flex-col items-center">
      <div v-if="adder">
        <div>
          <img class="w-32 h-32 rounded object-cover" :src="adder.avatarUrl" alt="">
        </div>
      </div>
      <div class="mt-5">
        <div>
          <img :src="$auth.user.avatarUrl" alt="" class="w-32 h-32 rounded object-cover">
        </div>
      </div>
      <div class="mt-3 flex flex-wrap justify-center gap-x-3 w-full">
        <div
          v-for="(p, i) in hierarchy" :key="i"
          class="p-2" :id="`member-${p.id}`"
        >
            <div class="">
              <img @click="() => handleFetchUserHierarchy(p.id, 0, i, $auth.user.id, hierarchy.length)" class="object-cover w-32 h-32 rounded" :src="p.avatarUrl" :alt="`${p.firstName} ${p.lastName}`" />
            </div>
            <div class="my-1">
              <p class="text-sm">{{ p.firstName }} {{ p.lastName.toUpperCase()}}</p>
            </div>
        </div>
      </div>
      <div class="w-full">
        <div
          class="my-4 flex gap-x-3 w-full justify-between"
          v-for="(h, hId) in subHierarchies"
          :key="`s-${hId}`"
        >
          <div
            v-for="(row, rowId) in h"
            :key="`s-${rowId}`"
            class="flex flex-wrap justify-center gap-x-3 w-full"
          >
            <div
              v-for="(p, pId) in row.values"
              :key="p.id" :id="`member-${p.id}`"
            >
              <div class="">
                <img @click="() => handleFetchUserHierarchy(p.id, hId + 1, pId, 1, row.values.length)" class="object-cover w-32 h-32 rounded" :src="p.avatarUrl" :alt="`${p.firstName} ${p.lastName}`" />
              </div>
              <div class="my-1">
                <p class="text-sm">{{ p.firstName }} {{ p.lastName.toUpperCase()}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { SVG } from "@svgdotjs/svg.js";
import MlmTitle from "../../components/general/mlm-title";
import MlmModal from "../../components/general/mlm-modal";

const GET_MEMBER_COLLABORATORS = gql`query ($id: ID!) {
            getMlmMemberCollaborators(id: $id) {
                adder { id, avatarUrl, firstName, lastName }
                hierarchy { id, avatarUrl, firstName, lastName }
            }
        }`;

const GET_MEMBER_SUB_COLLABORATORS = gql`query ($id: ID!) {
            getMlmMemberCollaborators(id: $id) {
                hierarchy { id, avatarUrl, firstName, lastName }
            }
        }`;

export default {
  components: {MlmModal, MlmTitle},
  head: () => ({
    title: "Associés",
  }),
  data: () => ({
    showAddUser: false,
    email: null,
    error: null,
    /*
      SUBHIERARCHIES
       [ { id: 1, from: 0, values: [] }, { id: 2, from: 0, values: [] } ],
       [ { id: 12, from: 1, values: [] }, { id: 13, from: 1, values: [] } ]
     */
    subHierarchies: [],
    hierarchiesKey: 0
  }),
  apollo: {
    getMlmMemberCollaborators: {
      query: GET_MEMBER_COLLABORATORS,
      async error(err) {
        await this.$store.dispatch('messages/handleError', err);
      },
      variables() {
        return { id: this.$store.state.auth.user.id }
      }
    }
  },
  computed: {
    adder() {
      return this.getMlmMemberCollaborators.adder;
    },
    hierarchy() {
      return this.getMlmMemberCollaborators.hierarchy;
    }
  },
  methods: {
    onCloseAddUser() {
      this.showAddUser = !this.showAddUser;
    },
    async handleSendInvitation() {
      if(!this.email || !/@/.test(this.email)) {
        this.error = "L'adresse email n'est pas valide";
        return;
      }
      this.error = null;

      try {
        const variables = { email: this.email };
        await this.$store.commit('setLoading', true);
        await this.$apollo.mutate({
          mutation: gql`mutation ($email: String!) { inviteMlmMember(email: $email) }`,
          variables
        });
        this.email = null;
        this.showAddUser = false;
      } catch (ex) {
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      } finally {
        await this.$store.commit('setLoading', false);
      }
    },
    async handleFetchUserHierarchy(userId, level, rank, parentId, partsLength) {
      /**
       * userId: Identifiant de la personne dont on veut les informations
       * level: Niveau dans la hierarchie
       * rank: ID, itérateur généré par le v-for qui nous permet de savoir à quel utilisateur la hierarchie suivante appartient.
       * parentId: ID de l'utilisateur parent de la hierarchie actuelle
       * partsLength: La taille de la hierarchie actuelle
       */
      try {
        await this.$store.commit('setLoading', true);
        const { data: { getMlmMemberCollaborators: { hierarchy } } } =
          await this.$apollo.query({
            query: GET_MEMBER_SUB_COLLABORATORS,
            variables: { id: userId }
          });

        if(this.subHierarchies.length <= level)
          this.subHierarchies = [...this.subHierarchies, []];

        if(!this.subHierarchies[level].length)
          for(let i = 0; i < partsLength; i++)
            this.subHierarchies[level].push({ id: userId, from: parentId, values: []});

        // Mise à jour de la hierarchie concernée.
        this.subHierarchies[level][rank].values = hierarchy;

        // Dessin des lignes.


      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      } finally {
        await this.$store.commit('setLoading', false);
      }
    }
  },
}
</script>
