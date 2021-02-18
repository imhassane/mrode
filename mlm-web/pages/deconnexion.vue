<template>
  <div></div>
</template>

<script>
export default {
  asyncData(ctx) {
   ctx.$cookies.remove("authentication");
   ctx.store.commit('auth/setAuth', false);
  }
}
</script>
