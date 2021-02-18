<template>
  <div v-if="$apollo.loading">
    <span class="animation-spin"></span>
  </div>
  <div v-else>
    <h1 :class="$theme.titles.h1 + ' my-3'">Stock</h1>
    <hr />

    <div class="my-3">
      <div :class="$theme.inputs.text">
        <client-only><i class="fas fa-search mr-2"></i></client-only>
        <input type="search" v-model="search" class="flex-1 py-1 px-2" placeholder="Rechercher un produit" />
      </div>
    </div>

    <div>
      <t-table
        :headers="['Produit', 'Couleur', 'Poids', 'Q. réelle', 'Q. estimée', 'Quantité', 'Stock', 'Stock prévu']"
        :data="getProducts"
      >
        <template slot="tbody" slot-scope="props">
          <tbody :class="props.tbodyClass">
            <fragment
              v-for="(p, i) in getProducts"
              :key="i"
            >
              <tr
                v-for="(o, id) in p.options"
                :key="id"
                :class="props.trClass"
                v-show="p.name.toLowerCase().includes(search.toLowerCase())"
              >
                <td :class="props.tdClass">{{ p.name }}</td>
                <td :class="props.tdClass">
                  <div class="w-6 h-6 rounded-full border" :style="`background-color: ${o.color}`"></div>
                </td>
                <td><span :class="$theme.tag">{{ o.weight }} g</span></td>
                <td>{{ o.realQuantity }}</td>
                <td>{{ o.estimatedQuantity }}</td>
                <td>{{ o.quantity }}</td>
                <td>
                  <div class="w-12 bg-green-500 text-white border border-green-500 text-center rounded" v-if="getPercentage(o.estimatedQuantity, o.total) >= 50">{{ getPercentage(o.estimatedQuantity, o.total) }}%</div>
                  <div class="w-12 bg-red-500 text-white border border-red-500 text-center rounded" v-else>{{ getPercentage(o.estimatedQuantity, o.total) }}%</div>
                </td>
                <td>
                  <div class="w-12 bg-green-500 text-white border border-green-500 text-center rounded" v-if="getPercentage(o.quantity, o.total) >= 50">{{ getPercentage(o.quantity, o.total) }}%</div>
                  <div class="w-12 bg-red-500 text-white border border-red-500 text-center rounded" v-else>{{ getPercentage(o.quantity, o.total) }}%</div>
                </td>
              </tr>
            </fragment>
          </tbody>
        </template>
      </t-table>
    </div>

  </div>
</template>

<script>
import { Fragment } from "vue-fragment";
import gql from "graphql-tag";

// [Dependency: update.vue]
const GET_PRODUCTS = gql`
{
    getProducts(start: 0, count: 50) {
        id, name,
        options {
            id, color, weight,
            total, quantity, estimatedQuantity, realQuantity
        }
    }
}
`;

export default {
  head: () => ({
    title: "Stock"
  }),
  data: () => ({
    error: null,
    search: ""
  }),
  components: { Fragment },
  apollo: {
    getProducts: {
      query: GET_PRODUCTS,
      pollInterval: 1000 * 10,
      error(err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    }
  },
  methods: {
    getPercentage(value, total) {
      if(!total) return 0;
      return parseInt((value * 100) / total);
    }
  }
}
</script>
