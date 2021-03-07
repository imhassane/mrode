<template>
  <div>
    <as-loading v-if="$apollo.loading" />
    <div v-if="getFormation" class="flex flex-col gap-y-5 divide-y">
      <div class="flex gap-x-8 mt-2">
        <div class="w-4/12">
          <img :src="getFormation.cover" class="object-cover w-full h-64 rounded" alt="">
        </div>
        <div class="flex-1">
          <h1>{{ getFormation.name }}</h1>
          <div class="my-3">
            <div>
              <span :class="$theme.tags.success" v-if="!getFormation.isRequired">Non requis</span>
              <span :class="$theme.tags.danger" v-else>Requis</span>

              <span :class="$theme.tags.success" v-if="getFormation.isVisible">Visible publiquement</span>
              <span :class="$theme.tags.danger" v-else>Masqué</span>
            </div>
            <div class="my-3">
              <p>{{ getFormation.description }}</p>
            </div>
            <div class="mb-3 flex gap-x-2">
              <div class="flex-1">
                <t-input type="number" :value="getFormation.price" />
              </div>
              <div class="flex-1">
                <t-button variant="success" type="large">Changer le prix</t-button>
              </div>
            </div>
            <div class="flex gap-x-2">
              <t-button variant="success" type="small" @click="displayContentAddModal = true">Ajouter du contenu</t-button>
              <t-button variant="success" type="small" v-if="!getFormation.isVisible">Rendre public</t-button>
              <t-button variant="danger" type="small" v-else>Masquer</t-button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-y-2 divide-y pt-3">
        <div
          v-for="(c, id) in getFormation.allContent" :key="id"
          class="flex gap-x-2 py-2"
        >
          <div class="w-24 h-24">
            <img :src="c.cover" class="object-cover w-full h-full rounded-lg" alt="">
          </div>
          <div class="flex-1 flex gap-x-3">
            <div class="flex-1">
              <h2 class="font-bold text-lg">(Ep: #{{ c.rank }}) {{ c.name }}</h2>
              <p class="mt-2 text-sm text-gray-500">Durée: {{ $utils.formatSecondsToTime(c.duration) }} </p>
              <p class="my-1 text-xs">{{ c.type.toLowerCase() }}</p>
            </div>
            <div class="flex-auto">
              <div class="flex gap-x-2">
                <span :class="$theme.tags.danger" v-if="c.isPreview">Preview de la formation</span>
                <t-button variant="danger" type="small">Supprimer</t-button>
                <t-button variant="danger" type="small">Masquer au public</t-button>
                <t-button variant="success" type="small">Modifier</t-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <t-modal v-model="displayContentAddModal" header="Contenu de la formation">
      <div class="flex flex-col gap-y-3">
        <div>
          <input type="text" v-model="formationContentValues.name" placeholder="Nom du contenu" class="w-full" />
        </div>
        <div>
          <input type="text" v-model="formationContentValues.cover" placeholder="URL de l'image de couverture" class="w-full" />
        </div>
        <div>
          <input type="text" v-model="formationContentValues.url" placeholder="URL du contenu" class="w-full" />
        </div>
        <div class="">
          <t-select placeholder="Type du contenu" v-model="formationContentValues.type" :options="{ARTICLE: 'Article', VIDEO: 'Video'}"></t-select>
        </div>
        <div class="flex gap-x-3 items-center">
          <div>
            <span class="block mb-1">Durée</span>
            <input type="number" value="0" v-model="formationContentValues.duration" placeholder="Durée" />
          </div>
          <div>
            <t-checkbox name="preview"></t-checkbox>
            <span class="ml-2">Mettre en preview</span>
          </div>
        </div>
        <div class="flex justify-end">
          <t-button variant="success" @click="addFormationContent">Ajouter le contenu</t-button>
        </div>
      </div>
    </t-modal>
  </div>
</template>

<script>
import gql from "graphql-tag";
import AsLoading from "@/components/as-loading";

const GET_PRODUCT = gql`
query ($id: ID!) {
    getFormation(id: $id) {
        name, cover, isRequired, isVisible,
        description, price,
        allContent {
            id, name, cover, url, isPreview, duration, type, rank
        }
    }
}
`;

const ADD_FORMATION_CONTENT = gql`mutation ($formationId: ID!, $name: String!, $cover: String!, $url: String!, $isPreview: Boolean!, $duration: Int!, $type: FormationContentType!){
    addFormationContent(formationId: $formationId, name: $name, cover: $cover, url: $url, isPreview: $isPreview, duration: $duration, formationType: $type) {
        id, name, cover, url, isPreview, duration, type, rank
    }
}`;

export default {
  components: {AsLoading},
  head: () => ({
    title: "Informations sur la formation"
  }),
  data: () => ({
    displayContentAddModal: false,
    formationContentValues: {
    name: null, cover: null, url: "https://www.youtube.com/embed/qF7dkrce-mQ", isPreview: false,
    duration: 0, type: "VIDEO"
  }
  }),
  methods: {
    async addFormationContent() {
      try {
        const variables = {
          ...this.formationContentValues,
          formationId: this.$route.params.id,
        };
        const id = this.$route.params.id;

        if(!variables.name || variables.name.trim().length < 5) {
          alert("Veuillez entrer un nom de plus de 5 caractères");
          return;
        }

        variables.duration = parseInt(variables.duration);

        await this.$apollo.mutate({
          mutation: ADD_FORMATION_CONTENT,
          variables,
          update(store, { data: { addFormationContent }}) {
            const data = store.readQuery({
              query: GET_PRODUCT,
              variables: { id }
            });

            data.getFormation.allContent.push(addFormationContent);
            store.writeQuery({ query: GET_PRODUCT, variables: { id }, data });
          }
        })
      } catch(err) {
        let error = null;
        if(err.graphQLErrors && err.graphQLErrors.length)
          error = err.graphQLErrors[0].message;
        else
          error = err.message;
        alert(error);
      }
    },

  },
  apollo: {
    getFormation: {
      query: GET_PRODUCT,
      variables() {
        return {
          id: this.$route.params.id,
        }
      }
    }
  }
}
</script>
