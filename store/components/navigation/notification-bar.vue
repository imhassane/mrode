<template>
  <div class="bg-black text-white font-semibold text-sm h-10 flex flex-col justify-center">
    <p class="text-center">{{ notifications[0].message }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    notifications() {
      return [
        { id: 1, message: "Nous ouvrons bientôt" },
        { id: 2, message: "Nous vous livrons gratuitement pour plus de 50€ de commande" },
      ];
    }
  }
}
</script>
