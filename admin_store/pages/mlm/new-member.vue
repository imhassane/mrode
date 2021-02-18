<template>
  <div class="py-3">
    <h1>Nouveau membre</h1>
    <hr />
    <div class="mt-3">
      <as-error v-if="messages.error" />
      <as-infos v-else-if="messages.infos" />

      <label for="email">Adresse email</label>
      <input type="email" v-model="email" />
      <div class="mt-2">
        <button class="btn-primary" @click="handleSubmit">Ajouter</button>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import AsError from "@/components/messages/as-error";
import AsInfos from "@/components/messages/as-infos";

const INVITE_MLM_MEMBER = gql`
    mutation ($email: String!) {
        inviteMlmMember(email: $email)
    }
`;

export default {
  components: {AsInfos, AsError},
  head: () => ({
    title: "Nouveau membre",
  }),
  data: () => ({
    email: null,
  }),
  methods: {
    async handleSubmit() {
      if(!this.email || this.email.length < 5) {
        await this.$store.commit('messages/setError', "L'adresse email est incorrecte");
        return;
      }
      try {
        const variables = { email: this.email };
        await this.$apollo.mutate({
          mutation: INVITE_MLM_MEMBER,
          variables,
        });
        await this.$store.commit('messages/setInfos', "L'invitation a été envoyée");
      } catch(ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    }
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    }
  }
}
</script>
