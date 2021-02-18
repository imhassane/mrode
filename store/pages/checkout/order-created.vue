<i18n lang="yaml">
  fr:
    thanks: "Nous vous remercions!"
    message: "Notre équipe va commencer à préparer votre commande afin de vous l'expédiez le plus vite possible, vous recevrez un mail de confirmation de votre commande avec un lien qui vous permettra de suivre son évolution"

  en:
    thanks: "We thank you!"
    message: "Our team is going to start preparing your order in order to deliver it as soon as possible, you will receive a confirmation mail with a link that will help you track your order"
</i18n>

<template>
  <div class="my-20 flex flex-col justify-center items-center">
    <div class="md:w-1/2 mx-auto">
      <h1 class="font-bold text-3xl">{{ $t('thanks') }}</h1>
      <p class="my-4 text-sm leading-relaxed">{{ $t('message') }}</p>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const ORDER_RESUME = "";

export default {
  asyncData(ctx) {
    if(!ctx.query.id || !ctx.query.num)
      ctx.redirect("/");

    return {
      id: ctx.query.id,
      num: ctx.query.num,
    }
  }
}
</script>
