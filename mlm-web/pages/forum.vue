<template>
  <div>
    <div class="flex flex-col flex-col-reverse md:flex-row">
      <div class="flex-1 md:mr-5">
        <div class="flex bg-white border mb-4 text-sm md:text-base">
          <nuxt-link
            to="/forum/questions-recentes"
            class=" p-3 md:p-4 font-semibold border-black hover:bg-gray-100"
            :class="{ 'border-b-2': $route.fullPath.includes('/questions-recentes')}"
          >Questions récentes</nuxt-link>
          <nuxt-link
            to="/forum/reponses-recentes"
            class="p-3 md:p-4 font-semibold border-black hover:bg-gray-100"
            :class="{ 'border-b-2': $route.fullPath.includes('/reponses-recentes')}"
          >Reponses récentes</nuxt-link>
          <div class="hidden md:flex-1 md:flex border-l">
            <input type="search" class="py-4 px-3 w-full" placeholder="Vous cherchez un sujet ?" />
          </div>
        </div>
        <div>
          <NuxtChild />
        </div>
      </div>
      <div class="md:w-3/12">
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
