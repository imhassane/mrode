<i18n lang="yaml">
  fr:
    title: "Kits"
    description: "Les kits sont des formations proposées par notre équipe afin de vous aider à utiliser notre plateforme, certains sont obligatoires"
    required:
      formation: "Ce kit est requis"
    buy: "Acheter ce kit"
    myKits: "Mes kits"
    see: "Lire"

  en:
    title: "Kits"
    description: "Kits are formations created by our team to help you use our platform, some kits are mandatory"
    required:
      formation: "This kit is required"
    buy: "Buy this kit"
    myKits: "My kits"
    see: "Go"

</i18n>

<template>
  <div>
    <h1>{{ $t('title') }}</h1>

    <div class="my-5">
      <p>{{ $t('description') }}</p>
    </div>

    <div class="mt-5 mb-20">
      <h3 class="font-bold text-lg">{{ $t('myKits') }}</h3>
      <div class="mt-3 flex gap-x-3">
        <div
          v-for="(k, id) in getMlmMemberFormations" :key="id"
          class="flex gap-x-3 w-32 p-3 shadow-lg rounded-lg"
        >
          <div>
            <img :src="k.cover" class="md:w-16 md:h-16 rounded-lg" :alt="k.id" />
          </div>
          <div>
            <p class="font-bold">{{ k.name }}</p>
            <button class="btn-primary">{{ $t('see') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-10">
      <div
        class="bg-white dark:bg-gray-700 rounded-lg shadow-xl px-4 py-5 flex gap-x-5"
        v-for="(f, id) in getMlmFormations" :key="id"
      >
        <div class="md:64">
          <img :src="f.cover" :alt="f.name" class="md:h-64 w-full object-cover rounded-lg" />
        </div>
        <div>
          <h3 class="font-bold md:text-3xl">{{ f.name }}</h3>
          <div class="mt-3 mb-5" v-if="f.isRequired">
            <span class="text-xs bg-red-500 text-white px-3 py-1 rounded">{{ $t('required.formation') }}</span>
          </div>
          <p class="my-3">
            {{ f.description }}
          </p>
          <p class="mt-5">
            <span class="shadow-lg px-3 py-2 rounded font-bold border">{{ f.price }} €</span>
          </p>
          <div class="mt-8">
            <button class="btn-primary py-2" @click="() => subscribeToFormation(f.id)">{{ $t('buy') }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";

const FORMATIONS = gql`{ getMlmFormations { id, name, description, cover, price, isRequired } }`;
const MLM_MEMBER_FORMATIONS = gql`query ($id: ID!){ getMlmMemberFormations(id: $id) { id, name, description, cover, price, isRequired } }`;
const SUBSCRIBE_TO_FORMATION = gql`
    mutation ($formationId: ID!) {
        subscribeToFormation(formationId: $formationId) {
            id, name, description, cover, price, isRequired
        }
    }
`;

export default {
  methods: {
    async subscribeToFormation(formationId) {
      try {
        const variables = { id: this.$auth.user.id };
        await this.$apollo.mutate({
          mutation: SUBSCRIBE_TO_FORMATION, variables: { formationId },
          update(store, { data: { subscribeToFormation } }) {
              const data = store.readQuery({ query: FORMATIONS });
              const formations = store.readQuery({ query: MLM_MEMBER_FORMATIONS, variables });
              data.getMlmFormations = data.getMlmFormations.filter(f => f.id !== formationId);
              formations.getMlmMemberFormations.push(subscribeToFormation);

              store.writeQuery({ query: FORMATIONS, data });
              store.writeQuery({ query: MLM_MEMBER_FORMATIONS, variables, data: formations });
          }
        });
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    }
  },
  apollo: {
    getMlmFormations: {
      query: FORMATIONS,
      async error(err) {
        await this.$store.dispatch('messages/handleError', err);
      }
    },
    getMlmMemberFormations: {
      query: MLM_MEMBER_FORMATIONS,
      variables() {
        return { id: this.$auth.user.id }
      },
      async error(err) {
        await this.$store.dispatch('messages/handleError', err);
      },
    }
  }
}
</script>
