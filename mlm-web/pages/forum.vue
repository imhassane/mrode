<template>
  <div>
    <div class="flex">
      <div class="flex-1 mr-5">
        <div class="flex bg-white border mb-4">
          <nuxt-link
            to="/forum/questions-recentes"
            class="py-4 px-4 font-semibold border-black hover:bg-gray-100"
            :class="{ 'border-b-2': $route.fullPath.includes('/questions-recentes')}"
          >Questions récentes</nuxt-link>
          <nuxt-link
            to="/forum/reponses-recentes"
            class="py-4 px-4 font-semibold border-black hover:bg-gray-100"
            :class="{ 'border-b-2': $route.fullPath.includes('/reponses-recentes')}"
          >Reponses récentes</nuxt-link>
          <div class="flex-1 border-l">
            <input type="search" class="py-4 px-3 w-full" placeholder="Vous cherchez un sujet ?" />
          </div>
        </div>
        <div>
          <NuxtChild />
        </div>
      </div>
      <div class="w-3/12">
        <div class="bg-white p-3 border">
          <button class="btn-primary w-full" @click="$router.push('/forum/poser-une-question')">Poser une question</button>
        </div>
        <div class="my-3">
          <forum-activity-resume />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ForumActivityResume from "../components/forum/forum-activity-resume";
export default {
  components: {ForumActivityResume},
  head: () => ({
    title: "Forum"
  })
}
</script>
