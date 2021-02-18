<i18n lang="yaml">
  fr:
    ended: "Inscription terminée"
    message: "Notre équipe se charge de vérifier l'authenticité et la validité des documents avant de valider votre inscription, ce processus prend généralement deux jours. Après validation du compte, vous aurez accès à toutes les fonctionnalités de notre plateforme"

  en:
    ended: "Your account has been registered"
    message: "Our team will verify the authenticity and the validity of your documents. This process usually takes 2 days. After the validation, you will have the full access to our platform"
</i18n>

<template>
  <div class="flex flex-col justify-center min-h-screen">

    <div class="rounded-lg border border-green-200 p-6 w-2/3 mx-auto text-gray-700">
      <h1 class="font-bold">{{ $t('ended') }}</h1>
      <div class="my-4" />
      <p class="bg-green-200 rounded-lg p-6">
        {{ $t('message') }}
      </p>
    </div>

  </div>
</template>

<script>
export default {
  head: () => ({
    title: "Inscription terminée"
  }),
  layout: "guest",
}
</script>
