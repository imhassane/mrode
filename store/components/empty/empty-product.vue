<i18n lang="yaml">
  fr:
    text: "Aucun produit trouvé"

  en:
    text: "No product found"
</i18n>

<template>
  <div class="flex flex-col">
    <h1 class="text-3xl text-center">{{ $t('text') }}</h1>
    <img width="50" class="mx-auto my-6 animate-bounce" src="https://img.icons8.com/dotty/80/000000/shopping-bag.png" />
  </div>
</template>
