<template>
  <div>
    <mlm-title title="Statistiques" />
    <div class="my-4 font-light">
      Les statistiques de vente de MRODE sont affichées afin de vous assister dans le choix des produits à acheter.

      <div class="my-4">
        <h2 class="font-bold text-xl">Top produits du mois</h2>
        <horizontal-bar :chart-data="lastProducts" />
      </div>

      <div class="my-4">
        <h2 class="font-bold text-xl">Trending</h2>
        <line-chart :chart-data="trending" />
      </div>
    </div>
  </div>
</template>

<script>
import MlmTitle from "../../components/general/mlm-title";
import HorizontalBar from "../../components/horizontal-bar";
import LineChart from "../../components/line-chart";
export default {
  components: {LineChart, HorizontalBar, MlmTitle},
  head: () => ({
    title: "Statistiques"
  }),
  data: () => ({
    lastProducts: null,
    trending: null
  }),
  methods: {
    mountLastProducts() {
      this.lastProducts = {
        labels: ["Bleu de Channel", "Coco", "Azerty", "Nefertiti", "Zeus", "Odysée", "Camelote"],
          datasets: [
            {
              label: 'Produits',
              backgroundColor: '#118092',
              data: [100, 140, 130, 120, 150, 200, 220]
            },
          ]
      };
    },
    mountTrending() {
      this.trending = {
        labels: ["Bleu de Channel", "Coco", "Azerty", "Nefertiti", "Zeus", "Odysée", "Camelote"],
        datasets: [
          {
            label: 'Bleu de channel',
            borderColor: '#f87979',
            fill: false,
            data: [400, 350, 320, 400, 350, 450]
          },
          {
            label: 'Coco',
            borderColor: '#499879',
            fill: false,
            data: [250, 270, 300, 220, 500]
          },
          {
            label: 'Azerty',
            borderColor: '#A89493',
            fill: false,
            data: [400, 350, 320, 400, 350, 450]
          },
          {
            label: 'Nefertiti',
            borderColor: '#B45035',
            fill: false,
            data: [100, 300, 400, 350, 300]
          },
          {
            label: 'Zeus',
            borderColor: '#c67593',
            fill: false,
            data: [400, 350, 320, 400, 350, 450]
          },
          {
            label: 'Odysée',
            borderColor: '#d48e29',
            fill: false,
            data: [230, 235, 300, 420, 400, 500]
          },
          {
            label: 'Camelote',
            borderColor: '#ac6e05',
            fill: false,
            data: [400, 350, 320, 400, 350, 450]
          },
        ]
      };
    }
  },
  created() {
    this.mountLastProducts();
    this.mountTrending();
  }
}
</script>
