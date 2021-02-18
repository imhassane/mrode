<template>
  <div
    class="catalog-resume-container relative"
    :style="`background-image: url('${cover}');`"
  >
    <div class="w-full h-full blur"></div>
    <div class="absolute top-0 left-0 flex flex-col justify-center h-full w-full z-10">
      <div class="md:w-1/2 mx-auto text-center text-white">
        <h1 class="text-3xl md:text-6xl uppercase font-bold">{{ title }}</h1>
        <p class="mt-4 md:mt-0 text-lg md:text-2xl">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mlm-catalogue-resume",
  props: ["id", "title", "description", "cover"],
}
</script>

<style scoped>
.catalog-resume-container {
  width: 100%;
  height: 80vh;
  background-position: center;
  background-size: cover;
  overflow-x: hidden;
}

.blur {
  z-index: 0;
  background-color: rgba(0, 0, 0, .6);
}
</style>
