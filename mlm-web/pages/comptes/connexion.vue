<i18n lang="yaml">
  fr:
    title: "Connexion"
    access_code: "Code d'accès"
    password: "Mot de passe"
    incorrectCode: "Le code doit contenir 8 caractères"
    incorrectPassword: "Le mot de passe doit contenir 8 caractères au moins"
    submit: "Me connecter"

  en:
    title: "Sign in"
    access_code: "Access code"
    password: "Password"
    incorrectCode: "The access code should contain 8 characters at least"
    incorrectPassword: "The password should be at least 8 characters long"
    submit: "Sign in"
</i18n>

<template>
  <div class="flex flex-col justify-center min-h-screen">
    <div class="md:w-1/2 mx-auto text-gray-700">
      <h1>{{ $t('title') }}</h1>

      <div class="mt-5 md:mt-10">
        <div>
          <label for="access_code">{{ $t('access_code') }}</label>
          <input type="text" class="w-full" id="access_code" v-model="values.code" />
          <p class="error" v-if="errors.code">{{ errors.code }}</p>
        </div>

        <div class="my-4">
          <label for="password">{{ $t('password') }}</label>
          <input type="password" class="w-full" id="password" v-model="values.password" />
          <p class="error" v-if="errors.password">{{ errors.password }}</p>
        </div>

        <div>
          <button class="btn-primary" @click="handleSubmit">{{ $t('submit') }}</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  layout: "guest",
  head: () => ({
    title: "Connexion"
  }),
  data: () => ({
    values: { code: null, password: null },
    errors: { code: null, password: null }
  }),
  methods: {
    async handleSubmit() {
      const { values } = this;
      if(!values.code || values.code.trim().length !== 8) {
        this.errors.code = this.$t('incorrectCode');
        return;
      }

      if(!values.password || values.password.trim().length < 8) {
        this.errors.password = this.$t('incorrectPassword');
        return;
      }

      this.errors = { code: null, password: null };

      try {
        await this.$store.commit('setLoading', true);
        const { data: { authenticateMlmMember } } =
          await this.$apollo.mutate({
            mutation: gql`mutation ($code: String!, $password: String!) { authenticateMlmMember(code: $code, password: $password) { token }}`,
            variables: values,
          });

        this.$cookies.set("authentication", authenticateMlmMember.token, {
          path: "/"
        });

        await this.$router.push("/");
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      } finally {
        await this.$store.commit('setLoading', false);
      }
    }
  },
}
</script>
