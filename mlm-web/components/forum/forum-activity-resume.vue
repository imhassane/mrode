<template>
  <div class="activity-grid bg-white border p-2">
    <div class="border-r">
      <p>Questions posées</p>
      <p>120</p>
    </div>
    <div>
      <p>Réponses</p>
      <p>2000</p>
    </div>
    <div class="border-r border-t">
      <p>Aujourd'hui</p>
      <p>7</p>
    </div>
    <div class="border-t">
      <p>Réponses validées</p>
      <p>50</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "forum-activity-resume",
}
</script>

<style scoped>
  .activity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .activity-grid > div {
    text-align: center;
  }

  .activity-grid > div > p:first-child {
    font-weight: bold;
    margin: 5px 0;
  }
</style>
