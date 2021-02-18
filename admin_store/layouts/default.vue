<template>
  <div>
    <header>
      <navbar />
    </header>
    <section>
      <div class="md:flex">
        <main class="flex-1">
          <Nuxt />
        </main>
      </div>
    </section>
    <footer>

    </footer>
  </div>
</template>

<script>
import Navbar from "../components/navigations/navbar";
export default {
  components: {Navbar},
}
</script>
