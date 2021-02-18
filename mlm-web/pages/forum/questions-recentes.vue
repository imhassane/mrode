<template>
  <div>
    <div>
      <div
        v-for="(q, i) in lastQuestions"
        :key="i"
        class="bg-white border mb-3 px-2 py-4"
      >
        <div class="flex">
          <div class="w-20 py-2">
            <img class="object-cover mx-auto w-12 h-12 rounded-full" :src="q.mid_avatar_url" alt="" />
          </div>
          <div class="px-3">
            <p>
              <span class="text-blue-700 font-semibold mr-3">{{ q.mid_first_name }} {{ q.mid_last_name }}</span>
              <span>{{ q.mid_inserted_at }}</span>
            </p>
            <p class="my-2 font-semibold text-xl">{{ q.fth_title }}</p>
          </div>
        </div>
        <div class="flex">
          <div class="w-20 mr-4 py-2 text-center">
            <p><i class="fas fa-chevron-up"></i></p>
            <p>{{ q.fth_up_votes }}</p>
            <p><i class="fas fa-chevron-down"></i></p>
          </div>
          <div class="px-3">
            <div v-html="q.fth_content"></div>
            <div class="my-3 bg-gray-50 px-3 py-2">
              <button class="btn-primary mr-4"><i class="fas fa-comments mr-2"></i> {{ q.fth_answers_count }} réponse{{ q.fth_answers_count > 0 ? "s" : "" }}</button>
              <button class="btn-primary mr-4"><i class="fas fa-eye mr-2"></i> {{ q.fth_views }} vues </button>
            </div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="w-20"></div>
          <div class="flex-1 text-xs" v-if="q.fth_answers_count">

            <div class="flex flex-col gap-y-2" v-if="shouldRenderReplies[i]">
              <div
                class="bg-gray-50 px-3 py-2 rounded"
                v-for="(a, id) in q.answers"
                :key="id"
              >
                <div class="flex gap-x-2 items-center">
                  <img class="w-8 h-8 object-cover rounded-full" :src="a.mid_avatar_url" alt="" />
                  <div class="flex gap-x-2">
                    <p class="text-sm">{{ a.mid_first_name }} {{ a.mid_last_name }}</p>
                    <p class="mt-1">Répondu le <span>{{ a.ftr_inserted_at }}</span></p>
                  </div>
                </div>
                <div class="my-3" v-html="a.ftr_content"></div>
              </div>
              <div class="mt-2 flex items-center justify-center">
                <i class="fas fa-arrow-up mr-2"></i>
                <span class="cursor-pointer" @click="shouldRenderReplies[i] = false">Masquer</span>
              </div>
            </div>
            <div class="flex justify-center items-center" v-else>
              <i class="fas fa-arrow-down mr-2"></i>
              <span class="cursor-pointer" @click="() => handleFetchReplies(q.fth_id, i)">Voir les réponses</span>
            </div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="w-20"></div>
          <div class="flex-1">
            <textarea placeholder="Répondre"
                      @focusin="handleReplyFieldFocus" @focusout="handleReplyFieldFocusOut"
                      class="w-full h-12 rounded bg-gray-50 px-3 py-2"
                      v-model="values.reply"
            ></textarea>
            <div>
              <button class="btn-primary float-right mt-2" @click="() => handleReplySubmit(q.fth_id, i)"><i class="fas fa-reply mr-2"></i> Répondre</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    values: { reply: null }
  }),
  async asyncData(ctx) {
    const data = {};
    const shouldRenderReplies = {};
    try {
      const result = await ctx.$api.$get("/forum/?start=0&count=20");
      result.data = result.data.map((d, id) => {
        d.answers = [];
        shouldRenderReplies[id] = false;
        return d;
      })
      data.lastQuestions = result.data;
    } catch { }
    data.shouldRenderReplies = shouldRenderReplies;
    return data;
  },
  methods: {
    handleReplyFieldFocus({ target }) {
      target.classList.remove('h-12');
      target.classList.add('h-32');
    },
    handleReplyFieldFocusOut({ target }) {
      target.classList.remove('h-32');
      target.classList.add('h-12');
    },
    async handleReplySubmit(threadId, index) {
      if(!this.values.reply || this.values.reply.trim().length < 15) {
        await this.$store.commit('messages/setError', "Votre réponse doit contenir au moins 15 caractères");
        return;
      }

      if(!threadId) {
        return;
      }

      try {
        await this.$store.commit('setLoading', true);
        const { data } = await this.$api.$post(`/forum/thread/reply/${threadId}`, {
          reply: this.values.reply,
          author: this.$store.state.auth.user.id,
        });
        const q = this.lastQuestions[index];
        q.fth_answers_count++;
        q.fth_views++;
        q.answers = [data, ...q.answers];
        this.values.reply = null;
      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      } finally {
        await this.$store.commit('setLoading', false);
      }
    },
    async handleFetchReplies(threadId, index) {
      if(!threadId) return;
      if(index === null) return;

      try {
        await this.$store.commit('setLoading', true);
        const { data } = await this.$api.$get(`/forum/thread/replies/${threadId}/10`);
        this.lastQuestions[index].answers = data;
        this.shouldRenderReplies[index] = true
      } catch(ex) {
        await this.$store.dispatch('messages/handleError', ex);
      } finally {
        await this.$store.commit('setLoading', false);
      }
    }
  }
}
</script>
