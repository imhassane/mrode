<i18n lang="yaml">
  fr:
    "lastWeek": "Semaine dernière"
    "lastMonth": "Mois dernier"
    "lastThird": "3 derniers mois"

  en:
    "lastWeek": "Last week"
    "lastMonth": "Last month"
    "lastThird": "3 last months"
</i18n>

<template>
  <div>
    <mlm-title title="Statistiques" />
    <div class="my-4 font-light">
      Les statistiques de vente de MRODE sont affichées afin de vous assister dans le choix des produits à acheter.

      <div class="my-4">
        <h2 class="font-bold text-xl">Top produits du mois</h2>
        <div class="my-3 flex gap-x-4 items-center rounded">
          <button class="btn-primary" @click="() => onPeriodSelection(1, 'week', 'SELLS')">{{ $t('lastWeek') }}</button>
          <button class="btn-primary" @click="() => onPeriodSelection(1, 'month', 'SELLS')">{{ $t('lastMonth') }}</button>
          <button class="btn-primary" @click="() => onPeriodSelection(3, 'month', 'SELLS')">{{ $t('lastThird') }}</button>
        </div>
        <div class="my-3 flex gap-x-4">
          <div class="flex-1">
            <input type="date" @input="onStartChange" id="startInput" class="w-full" />
          </div>
          <div class="flex-1">
            <input type="date" @input="onEndChange" ref="endInput" class="w-full" />
          </div>
          <div class="w-auto">
            <button class="btn-primary" @click="getProductSellsByPeriod">Voir pour cette période</button>
          </div>
        </div>
        <horizontal-bar :chart-data="productsSells" />
      </div>

      <div class="my-4">
        <h2 class="font-bold text-xl">Trending</h2>
        <div class="my-3 flex gap-x-4 items-center rounded">
          <button class="btn-primary" @click="() => onPeriodSelection(1, 'week', 'TRENDS')">{{ $t('lastWeek') }}</button>
          <button class="btn-primary" @click="() => onPeriodSelection(1, 'month', 'TRENDS')">{{ $t('lastMonth') }}</button>
          <button class="btn-primary" @click="() => onPeriodSelection(3, 'month', 'TRENDS')">{{ $t('lastThird') }}</button>
        </div>
        <div class="my-3 flex gap-x-4">
          <div class="md:w-20">
            <select v-model="trends.period" class="w-full">
              <option :value="value" :key="value"
                      v-for="([value, title], id) in periodTypes">{{ title }}</option>
            </select>
          </div>
          <div class="flex-1">
            <input type="date" @input="onTrendStartChange" class="w-full" />
          </div>
          <div class="flex-1">
            <input type="date" @input="onTrendEndChange" class="w-full">
          </div>
          <div class="w-auto">
            <button class="btn-primary" @click="getTrends">Voir pour cette période</button>
          </div>
        </div>
        <line-chart :chart-data="productsTrends" />
      </div>

      <div class="my-4">
        <h2 class="font-bold text-xl">Parts</h2>
        <div class="md:flex items-center">
          <div class="flex-1">
            <donut-chart :chart-data="productsPercentage.orders" />
          </div>
          <div class="flex-1">
            <donut-chart :chart-data="productsPercentage.items" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import randomcolor from "randomcolor";

import MlmTitle from "../../components/general/mlm-title";
import HorizontalBar from "../../components/horizontal-bar";
import LineChart from "../../components/line-chart";
import moment from "moment";
import DonutChart from "../../components/charts/donut-chart";

const GET_PRODUCTS_SELLS = gql`
  query ($start: DateTime!, $end: DateTime!) { getProductSellsByPeriod(start: $start, end: $end) { labels, itemsCount, ordersCount, ids } }
`;

const GET_TRENDS = gql`
 query ($period: PeriodType!, $start: DateTime!, $end: DateTime!){
  getTrends(period: $period, start: $start, end: $end) {
    labels
    datasets {
      label
      periods
      data { ordersCount, itemsCount }
    }
  }
}
`;

const GET_PERCENTAGES = gql`
query ($start: DateTime!, $end: DateTime!){
  getProductsPercentage(start: $start, end: $end) {
    labels
    totalItems
    totalProducts
    datasets {
      itemsCount
      ordersCount
    }
  }
}
`;

export default {
  components: {DonutChart, LineChart, HorizontalBar, MlmTitle},
  head: () => ({
    title: "Statistiques"
  }),
  data() {
    return {
      start: null, end: null, trends: { period: "MONTH", start: null, end: null },
      productsSells: {},
      productsTrends: {},
      productsPercentage: { orders: {}, items: {}},
      viewItems: false,
      period: "MONTH",
    }
  },
  methods: {
    formatProductsSells(data) {
      const d = {
        labels: data.labels,
        datasets: [
          {
            label: "Commandes", backgroundColor: "#118092",
            data: data.ordersCount
          },
          {
            label: "Produits",
            data: data.itemsCount
          }
        ]
      };
      this.productsSells = d;
    },
    formatTrends(data) {
      this.productsTrends = {
        labels: data.labels,
        datasets: data.datasets.map(t => ({
          label: t.label,
          data: t.data.map((d, i) => ({
            x: t.periods[i],
            y: d.ordersCount
          })),
          fill: false,
          borderColor: randomcolor(),
        }))
      };
    },
    formatPercentages(data) {
      const backgroundColor = data.datasets.ordersCount.map(_ => randomcolor())
      this.productsPercentage.orders = {
        labels: data.labels,
        datasets: [
          {
            data: data.datasets.ordersCount,
            backgroundColor
          },
        ]
      };
      this.productsPercentage.items = {
        labels: data.labels,
        datasets: [
          { data: data.datasets.itemsCount, backgroundColor }
        ]
      }
    },
    formatDate(year, month, day) {
      return `${year}-${month}-${day}`
    },
    onStartChange(e) {
      this.start = e.target.value;
    },
    onEndChange() {
      this.end = e.target.value;
    },
    onTrendStartChange(e) {
      this.trends.start = e.target.value;
    },
    onTrendEndChange(e) {
      this.trends.end = e.target.value;
    },
    async onPeriodSelection(amount, periodType, target) {
      const m = moment(new Date).subtract(periodType + "s", amount);
      const start = m.toDate();
      const end = moment(new Date).add(periodType + "s", 1)

      if(target === "SELLS") {
        this.period = periodType;
        this.start = start;
        this.end = end;

        await this.getProductSellsByPeriod();
      } else {
        this.trends.period = periodType.toUpperCase();
        this.trends = { ...this.trends, start, end };

        await this.getTrends();
      }
    },
    async getTrends() {
      if(!this.trends.start) {
        await this.$store.dispatch('messages/handleError', new Error("Sélectionnez la période de début"));
        return;
      }
      if(!this.trends.end) this.trends.end = new Date();

      this.trends.start = new Date(this.trends.start);

      const { start, end, period } = this.trends;
      try {
        const { data } = await this.$apollo.query({
          query: GET_TRENDS,
          variables: { start, end, period }
        });
        this.formatTrends(data.getTrends);

      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    },
    async getProductSellsByPeriod() {
      if(!this.start) {
        await this.$store.dispatch('messages/handleError', new Error("Sélectionnez la période de début"));
        return;
      }
      if(!this.end) this.end = new Date();
      this.start = new Date(this.start);

      const { start, end } = this;

      try {
        const { data } = await this.$apollo.query({
          query: GET_PRODUCTS_SELLS,
          variables: { start, end }
        });
        this.formatProductsSells(data.getProductSellsByPeriod);

      } catch (ex) {
        await this.$store.dispatch('messages/handleError', ex);
      }
    },
  },
  computed: {
    periodTypes: () => ([
      ['HOUR', 'Heure'], ['DAY', 'Jour'], ['WEEK', 'Semaine'],
      ['MONTH', 'Mois'], ['YEAR', 'Année']
    ])
  },
  apollo: {
    getProductSellsByPeriod: {
      query: GET_PRODUCTS_SELLS,
      variables() {
        const start = moment(new Date).subtract({ months: 3 }).toDate();
        const end = moment(new Date).add({ months: 1 }).toDate();

        return { start, end }
      },
      update(data) {
        this.formatProductsSells(data.getProductSellsByPeriod)
        return data;
      },
      async error(err) {
        await this.$store.dispatch("messages/handleError", err);
      }
    },
    getTrends: {
      query: GET_TRENDS,
      variables() {
        const start = moment(new Date).subtract({ months: 3 }).toDate();
        const end = moment(new Date).add({ months: 1 }).toDate();

        return { start, end, period: "MONTH" }
      },
      update(data) {
        this.formatTrends(data.getTrends);
        return data;
      },
      async error(err) {
        await this.$store.dispatch("messages/handleError", err);
      }
    },
    getProductsPercentage: {
      query: GET_PERCENTAGES,
      variables() {
        const start = moment(new Date).subtract({ months: 3 }).toDate();
        const end = moment(new Date).add({ months: 1 }).toDate();

        return { start, end };
      },
      update(data) {
        this.formatPercentages(data.getProductsPercentage);
        return data;
      }
    }
  }
}
</script>
