<i18n lang="yaml">
  fr:
    go_back: "Retour à l'étape précédente"
    step_title: "Etape 3: Documents"
    avatar: "Image de profile"
    siret: "Numéro de siret"
    accept_conditions: "En cochant cette case, j'accepte les conditions d'utilisation"
    authentic_documents: "Je confirme que les informations entrées sont correctes"
    submit: "Enregistrer mon compte"
    errors:
      invalidSiret: "Le numéro de siret est invalide"

  en:
    go_back: "Back to previous step"
    step_title: "Step 3: Documents"
    avatar: "Profile image"
    siret: "Siret number"
    accept_conditions: "I confirm that I've read and accepted the conditions of the platform"
    authentic_documents: "I confirm that all the informations I've sent are valid"
    submit: "Save my account"
    errors:
      invalidSiret: "The siret number is invalid"
</i18n>

<template>
  <div class="min-h-screen container flex flex-col justify-center">

    <div class="mb-10 flex gap-x-3 items-center">
      <nuxt-link to="/comptes/rejoindre/etapes/identite"><i class="fas fa-arrow-left"></i></nuxt-link>
      <h1>{{ $t('step_title')}}</h1>
    </div>

    <div>
      <div class="md:mb-5">
        <label for="siret">{{ $t('siret') }}</label>
        <input type="text" id="siret" class="w-full" maxlength="14" pattern="[0-9]{14}" v-model="values.siret" />
      </div>

      <div class="md:mb-5">
        <label for="avatar">{{ $t('avatar') }}</label>
        <input type="file" id="avatar" accept=".png, .jpeg, .jpg" v-if="!values.avatarUrl" @change="handleUpload" />
        <div v-else>
          <img :src="values.avatarUrl" class="object-cover w-48 h-48 rounded" alt="" />
          <button class="bg-red-500 mt-1 border-red-500" @click="removeImage">Supprimer l'image</button>
        </div>
      </div>

      <div class="mb-1 flex gap-x-4 items-center">
        <input type="checkbox" id="accept_conditions" v-model="checkboxes.read" />
        <label for="accept_conditions" class="mt-2">{{ $t('accept_conditions') }}</label>
      </div>

      <div class="md:mb-5 flex gap-x-4 items-center">
        <input type="checkbox" id="authentic_documents" v-model="checkboxes.validData" />
        <label for="authentic_documents" class="mt-2">{{ $t('authentic_documents') }}</label>
      </div>

      <div class="flex justify-end" v-if="checkboxes.validData && checkboxes.read">
        <button class="btn-primary" @click.prevent="handleSubmit">{{ $t('submit') }}</button>
      </div>
    </div>


  </div>
</template>

<script>
import AsLoading from "../../../../components/as-loading";
import gql from "graphql-tag";

const CREATE_MLM_MEMBER = gql`
    mutation ($firstName: String!, $lastName: String!, $code: String!, $password: String!, $avatar: String! $avatarUrl: String!, $siret: String!) {
        createMlmMember(
            firstName: $firstName, lastName: $lastName, code: $code, password: $password, avatar: $avatar, siret: $siret,
            avatarUrl: $avatarUrl
        ) { id }
    }
`;

export default {
  components: {AsLoading},
  head: () => ({
    title: "Documents à fournir"
  }),
  layout: "guest",
  data: () => ({
    checkboxes: { validData: false, read: false }
  }),
  methods: {
    async removeImage() {
      this.values.avatar = null;
      this.values.avatarUrl = null;
      await this.$store.dispatch('users/registerSecondStep', this.values);
    },
    async handleSubmit() {
      if(!this.values.siret || this.values.siret.length !== 14) {
        await this.$store.commit('messages/setError', this.$t('errors.invalidSiret'));
        return;
      }
      try {
        await this.$store.dispatch('users/registerSecondStep', this.values);
        await this.$store.commit('setLoading', true);
        const code = this.$route.query.code;
        const { passwordConfirmation, ...values} = this.values;
        const variables = { ...values.user, siret: values.siret, avatar: values.avatar, avatarUrl: values.avatarUrl, code };

        await this.$apollo.mutate({
          mutation: CREATE_MLM_MEMBER,
          variables
        });
        await this.$store.dispatch('users/removeRegisterCookies');
        await this.$store.commit('setLoading', false);
        await this.$router.push("/comptes/rejoindre/etapes/termine?code=" + code);
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      } finally {
         await this.$store.commit('setLoading', false);
      }

    },
    readFileData(f) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(f);
      });
    },
    async handleUpload({ target: { files: [file] } }) {
      await this.$store.commit('setLoading', true);
      const data = await this.readFileData(file);
      try {
        const {secure_url, public_id} = await this.$cloudinary.upload(data, { uploadPreset: "mlm_covers" });
        this.values = {...this.values, avatarUrl: secure_url, avatar: public_id};
        await this.$store.dispatch('users/registerSecondStep', this.values);
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
      await this.$store.commit('setLoading', false);
    }
  },
  async asyncData({store, redirect, query, app: {apolloProvider}}) {
    if(!query.code)
      redirect("/comptes/rejoindre/etapes/code-access");

    try {
      const client = apolloProvider.defaultClient;
      const { data: { verifyMlmAccessCode } } = await client.mutate({
        mutation: gql`mutation ($code: String!){ verifyMlmAccessCode(code: $code) }`,
        variables: { code: query.code }
      });
      if(!verifyMlmAccessCode)
        redirect("/comptes/rejoindre/etapes/code-access");
    } catch {}

    await store.dispatch('users/getRegisterFirstStep');
    if(!store.state.users.registerFirstStep)
      redirect("/comptes/rejoindre/etapes/identite?code=" + query.code);

    await store.dispatch('users/getRegisterSecondStep');
    const values = store.state.users.registerSecondStep || { siret: null, avatarUrl: null, avatar: null };
    values.user = store.state.users.registerFirstStep;
    return { values };
  }
}
</script>
