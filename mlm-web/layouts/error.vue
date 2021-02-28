<i18n lang="yaml">
  fr:

    internalError:
      title: "Oups!"
      message: "Une erreur interne s'est produite, notre équipe fait de son mieux pour résoudre ce problème. Désolé!"

  en:
    internalError:
      title: "Oups!"
      message: "An internal error occurred, our team is doing its best to solve it as soon as possible. Sorry!"
</i18n>

<template>
  <div>
    <h1>{{ $t('internalError.title') }}</h1>
    <p class="mt-3">{{ $t('internalError.message') }}</p>
  </div>
</template>
