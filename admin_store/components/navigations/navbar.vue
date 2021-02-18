<template>
  <nav class="md:flex justify-between px-4 border-b font-semibold">
    <ul class="flex items-center">
      <li class="mr-6">
        <h1 class="font-bold text-3xl">MRODE</h1>
      </li>
      <li
        class="mr-4 py-6"
        :class="{
           'border-b-2 border-green-500': $route.fullPath.includes('dashboard')
        }"
      >
        <nuxt-link to="/dashboard">
          <client-only><i class="fas fa-chalkboard mr-2"></i></client-only>
          Tableau de bord
        </nuxt-link>
      </li>
      <li
        class="mr-4 py-6"
        :class="{
          'border-b-2 border-green-500': $route.fullPath.includes('team')
          }"
      >
        <nuxt-link to="/team">
          <client-only><i class="fas fa-users mr-2"></i></client-only>
          Equipe
        </nuxt-link>
      </li>
      <li
        class="mr-4 py-6"
        :class="{
          'border-b-2 border-green-500': $route.fullPath.includes('catalogue')
        }"
      >
        <nuxt-link to="/catalogue"><client-only><i class="fas fa-list-alt mr-2"></i></client-only> Catalogue</nuxt-link>
      </li>
      <li
        class="mr-4 py-6"
        :class="{
          'border-b-2 border-green-500': $route.fullPath.includes('marketing')
          }"
      >
        <nuxt-link to="/marketing"><client-only><i class="fas fa-mail-bulk mr-2"></i></client-only> Marketing</nuxt-link>
      </li>
      <li
        class="mr-4 py-6"
        :class="{
          'border-b-2 border-green-500': $route.fullPath.includes('mlm')
        }"
      >
        <nuxt-link to="/mlm"><client-only><i class="fas fa-network-wired mr-2"></i></client-only> Mlm</nuxt-link>
      </li>
    </ul>
    <ul class="flex justify-end items-center">
      <li>
        <div class="">
          <client-only><span class="fas fa-bell"></span></client-only>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "navbar"
}
</script>
