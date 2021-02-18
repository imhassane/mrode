<template>
  <div>

    <div class="bg-white px-4 pt-2 pb-4 rounded">
      <h1>Poser une question</h1>
    </div>

    <div class="md:my-6 bg-white p-4 rounded">
      <div>
        <label for="title" class="font-semibold">Votre question</label>
        <input type="text" id="title" class="w-full" v-model="values.title" />
      </div>

      <div class="my-4">
        <label for="content" class="font-semibold">Décrivez votre problème</label>
        <textarea id="content" minlength="0" v-model="values.description" class="h-64 w-full bg-gray-50 border rounded p-3"></textarea>
        <p class="text-xs mt-1" v-if="values.description">{{ values.description.length }} / 30</p>
      </div>

      <div class="flex justify-end">
        <button class="btn-primary" @click="handleSubmit">Poser ma question</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  head: () => ({
    title: "Poser une question"
  }),
  data: () => ({
    values: { title: null, description: null }
  }),
  methods: {
    async handleSubmit() {
      const { values } = this;
      if(!values.title || values.title.trim().length < 10) {
        await this.$store.commit('messages/setError', "Le titre doit contenir au moins 10 caractères");
        return;
      }

      if(!values.description || values.description.trim().length < 30) {
        await this.$store.commit('messages/setError', "La description doit contenir au moins 30 caractères");
        return;
      }

      try {
        await this.$store.commit("setLoading", true);
        await this.$api.$post("forum/thread/new", {
          ...values,
          author: this.$store.state.auth.user.id,
        });
        this.values = { title: null, description: null };
        await this.$store.commit('messages/setInfos', "La question a été ajoutée au forum");
      } catch (ex) {
        await this.$store.dispatch("messages/handleError", ex);
      } finally {
        await this.$store.commit("setLoading", false);
      }


    }
  }
}
</script>
