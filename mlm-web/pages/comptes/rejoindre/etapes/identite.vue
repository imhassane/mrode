<i18n lang="yaml">
  fr:
    stepTitle: "Etape 2: Identité"
    first_name: "Prénom"
    last_name: "Nom"
    email_address: "Adresse email"
    password: "Mot de passe"
    password_confirmation: "Confirmez le mot de passe"
    continue: "Etape suivante"
    errors:
      fill_inputs: "Veuillez remplir tous les champs"
      first_name: "Le prénom doit contenir au moins 2 caractères"
      last_name: "Le nom doit contenir au moins 2 caractères"
      email: "L'adresse email n'est pas correcte"
      password: "Le mot de passe doit contenir au moins 8 caractères"
      password_confirmation: "Les mots de passe ne correspondent pas"

  en:
    stepTitle: "Step 2: Identity"
    first_name: "First Name"
    last_name: "Last Name"
    email_address: "Email Address"
    password: "Password"
    password_confirmation: "Confirm the password"
    continue: "Next step"
    errors:
      fill_inputs: "Fill all the fields"
      first_name: "The first name should contain at least 2 characters"
      last_name: "The last name should contain at least 2 characters"
      email: "The email address is not correct"
      password: "The password should contain at least 8 characters"
      password_confirmation: "The passwords do not match"
</i18n>

<template>
  <as-loading v-if="loading" />
  <div class="min-h-screen container flex flex-col justify-center" v-else>

    <div class="mb-10">
      <h1>{{ $t('stepTitle')}}</h1>
    </div>

    <div class="flex flex-col gap-y-4">
      <div class="md:flex md:gap-x-4">
        <div class="flex-1">
          <label for="first_name">{{ $t('first_name')}}</label>
          <input type="text" id="first_name" class="w-full" v-model="initials.firstName" @input="handleFirstNameChange" />
          <p v-if="errors.firstName" class="error-text">{{ $t('errors.first_name') }}</p>
        </div>
        <div class="flex-1">
          <label for="last_name">{{ $t('last_name')}}</label>
          <input type="text" id="last_name" class="w-full" v-model="initials.lastName" @input="handleLastNameChange" />
          <p v-if="errors.lastName" class="error-text">{{ $t('errors.last_name') }}</p>
        </div>
      </div>
      <div class="md:flex md:gap-x-4">
        <div class="flex-1">
          <label for="password">{{ $t('password')}}</label>
          <input type="password" id="password" class="w-full" v-model="initials.password" @input="handlePasswordChange" />
          <p v-if="errors.password" class="error-text">{{ $t('errors.password') }}</p>
        </div>
        <div class="flex-1">
          <label for="password">{{ $t('password_confirmation')}}</label>
          <input type="password" id="password_confirmation" class="w-full" v-model="initials.passwordConfirmation" @input="handlePasswordConfirmationChange" />
          <p v-if="errors.passwordConfirmation" class="error-text">{{ $t('errors.password_confirmation') }}</p>
        </div>
      </div>
      <div class="flex justify-end">
        <button class="btn-primary" @click.prevent="handleSubmit">{{ $t('continue') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";
import AsLoading from "~/components/as-loading";

export default {
  head: () => ({
    title: "Rejoindre notre réseau mlm",
  }),
  layout: "guest",
  components: { AsLoading },
  data: () => ({
    loading: false,
    initials: { firstName: null, lastName: null, password: null, passwordConfirmation: null },
    values: { firstName: null, lastName: null, password: null, passwordConfirmation: null },
    errors: { firstName: false, lastName: false, password: false, passwordConfirmation: false },
    messages: { error: null,}
  }),
  methods: {
    handleInputData(value, length, key) {
      if(value && value.trim().length > length) {
        this.errors[key] = false;
        this.values[key] = value;
      } else {
        this.values[key] = null;
        this.errors[key] = true;
      }
    },
    handleFirstNameChange({ target: { value }}) {
      this.handleInputData(value, 2, 'firstName');
    },
    handleLastNameChange({ target: { value }}) {
      this.handleInputData(value, 2, 'lastName');
    },
    handlePasswordChange({ target: { value }}) {
      this.handleInputData(value, 8, 'password');
    },
    handlePasswordConfirmationChange({ target: { value }}) {
      if(value !== this.values.password) {
        this.errors.passwordConfirmation = true;
        this.values.passwordConfirmation = null;
      } else {
        this.errors.passwordConfirmation = false;
        this.values.passwordConfirmation = value;
      }
    },
    async handleSubmit() {
      let valid = true;
      for(let key of Object.keys(this.values)) {
        if(this.values[key] === null)
          valid = false;
      }

      if(!valid) {
        this.messages.error = this.$t('errors.fill_inputs');
        return;
      }

      await this.$store.dispatch('users/registerFirstStep', this.values);
      await this.$router.push("/comptes/rejoindre/etapes/documents?code=" + this.$route.query.code);
    }
  },
  async asyncData({store, query, redirect, app: { apolloProvider }, ...ctx}) {
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

    return {};
  }
}
</script>
