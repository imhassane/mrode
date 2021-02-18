<template>
  <div class="bg-white">
    <header>
      <top-navbar />
    </header>
    <main-navbar />
    <main class="w-full">
      <Nuxt />
    </main>
    <page-footer />
  </div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

  * {
    font-family: 'Inter', 'Rajdhani', sans-serif;
  }

  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.5s;
  }
  .page-enter,
  .page-leave-to {
    opacity: 0;
  }


</style>
<script>
import TopNavbar from "../components/navigation/top-navbar";
import MainNavbar from "../components/navigation/main-navbar";
import PageFooter from "../components/navigation/page-footer";
export default {
  components: {PageFooter, MainNavbar, TopNavbar}
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
