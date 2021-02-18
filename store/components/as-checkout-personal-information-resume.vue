<i18n lang="yaml">
  fr:
    contact: "Adresse email"
    change: "Changer"
    address: "Adresse"
    fullName: "Nom complet"

  en:
    contact: "Email address"
    change: "Change"
    address: "Address"
    fullName: "Full name"
</i18n>

<template>
  <div class="border rounded mb-6 py-1 px-3 divide-y text-xs text-gray-800">
    <div class="flex gap-x-3 py-3">
      <p class="w-24">{{ $t('fullName') }}</p>
      <p class="flex-1">{{ `${firstName} ${lastName.toString().toUpperCase()}` }}</p>
      <p class="w-32 text-right cursor-pointer" @click="onUpdate">{{ $t('change') }}</p>
    </div>
    <div class="flex gap-x-3 py-3">
      <p class="w-24">{{ $t('contact') }}</p>
      <p class="flex-1">{{ email }}</p>
      <p class="w-32 text-right cursor-pointer" @click="onUpdate">{{ $t('change') }}</p>
    </div>
    <div class="flex gap-x-3 py-3">
      <p class="w-24">{{ $t('address') }}</p>
      <p class="flex-1">{{ `${address.address}, ${address.postalCode}, ${address.city}, ${address.country}` }}</p>
      <p class="w-32 text-right cursor-pointer" @click="onUpdate">{{ $t('change') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["email", "firstName", "lastName", "address", "onUpdate"],
}
</script>
