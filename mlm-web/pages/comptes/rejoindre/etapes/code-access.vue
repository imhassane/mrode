<i18n lang="yaml">
  fr:
    title: "Etape 1: Code d'accès"
    labelTitle: "Entrez le code d'accès"
    validate: "Vérifier mon code d'accès"
    invalidAccessCode: "Le code d'accès doit contenir 8 caractères"
    accessCodeNotFound: "Le code d'accès n'existe pas"

  en:
    title: "Step 1: Access code"
    labelTitle: "Enter your access code"
    validate: "Verify my access code"
    invalidAccessCode: "The access code should contain 8 characters"
    accessCodeNotFound: "The access code does not exist"
</i18n>

<template>
  <div class="min-h-screen flex flex-col justify-center">
    <div class="md:w-2/3 mx-auto">

      <h1>{{ $t('title') }}</h1>

      <div class="mt-5">
        <label for="accessCode">{{ $t('labelTitle') }}</label>
        <input type="text" maxlength="8" class="w-full" id="accessCode" v-model="accessCode" />
      </div>

      <div class="mt-5 flex justify-end">
        <button class="btn-primary" @click="handleSubmit">{{ $t('validate') }}</button>
      </div>

    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  head() {
    return {
      title: this.$t('title'),
    };
  },
  layout: "guest",
  data: () => ({
    accessCode: null,
  }),
  methods: {
    async handleSubmit() {
      if(!this.accessCode || this.accessCode.length !== 8) {
        await this.$store.commit('messages/setError', this.$t('invalidAccessCode'));
        return;
      }

      try {
        const variables = { code: this.accessCode };
        const { data: { verifyMlmAccessCode } } = await this.$apollo.mutate({
          mutation: gql`mutation ($code: String!) { verifyMlmAccessCode (code: $code) }`,
          variables,
        });

        if(verifyMlmAccessCode) {
          await this.$router.push("/comptes/rejoindre/etapes/identite?code=" + this.accessCode);
        } else {
          await this.$store.commit('messages/setError', this.$t('accessCodeNotFound'));
        }
      } catch(ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    }
  }
}
</script>
