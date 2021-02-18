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

    <t-alert variant="danger" :show="error !== null">
      {{ error }}
    </t-alert>

    <div class="mt-4">
      <t-table
        :headers="['Produit', 'Couleur', 'Poids', 'Nouveau stock', 'Q. réelle', 'Q. estimée', 'Quantité', 'Stock', 'Stock prévu', '']"
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
              <td :class="props.tdClass + ' w-40'">
                <t-input type="number" :min="0" :value="0" v-model="o.newStock" />
              </td>
              <td>{{ o.realQuantity + getNumber(o.newStock) }}</td>
              <td>{{ o.estimatedQuantity + getNumber(o.newStock) }}</td>
              <td>{{ o.quantity + getNumber(o.newStock) }}</td>
              <td>
                <div class="w-12 bg-green-500 text-white border border-green-500 text-center rounded"
                     v-if="getPercentage(o.estimatedQuantity + getNumber(o.newStock), o.total + getNumber(o.newStock)) >= 50">
                  {{ getPercentage(o.estimatedQuantity + getNumber(o.newStock), o.total + getNumber(o.newStock)) }}%
                </div>
                <div class="w-12 bg-red-500 text-white border border-red-500 text-center rounded" v-else>
                  {{ getPercentage(o.estimatedQuantity  + getNumber(o.newStock), o.total + getNumber(o.newStock)) }}%
                </div>
              </td>
              <td>
                <div class="w-12 bg-green-500 text-white border border-green-500 text-center rounded" v-if="getPercentage(o.quantity + getNumber(o.newStock), o.total + getNumber(o.newStock)) >= 50">{{ getPercentage(o.quantity + getNumber(o.newStock), o.total + getNumber(o.newStock)) }}%</div>
                <div class="w-12 bg-red-500 text-white border border-red-500 text-center rounded" v-else>{{ getPercentage(o.quantity + getNumber(o.newStock), o.total + getNumber(o.newStock)) }}%</div>
              </td>
              <td :class="props.tdClass">
                <t-button variant="success" @click="() => handleUpdateStock(p.id, o)">Mettre à jour</t-button>
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

const UPDATE_STOCK = gql`
    mutation ($id: ID!, $newStock: Int!) {
        updateOptionStock(id: $id, newStock: $newStock) {
            quantity, realQuantity, total, estimatedQuantity
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
    },
    getNumber(value) {
      return !value ? 0 : parseInt(value)
    },
    async handleUpdateStock(productId, option) {
      option.newStock = parseInt(option.newStock);
      try {
        if(!option.newStock)
          throw new Error("La nouvelle quantité n'est pas définie");

        await this.$apollo.mutate({
          mutation: UPDATE_STOCK,
          variables: { newStock: option.newStock, id: option.id },
          update(store, _) {
            const data = store.readQuery({ query: GET_PRODUCTS });
            if(data.getProducts) {
             data.getProducts = data.getProducts.map(p => {
               if(p.id === productId) {
                 p.options = p.options.map(o => {
                   if(o.id === option.id) {
                     o.quantity += option.newStock;
                     o.realQuantity += option.newStock;
                     o.estimatedQuantity += option.newStock;
                     o.total += option.newStock;
                   }
                   return o;
                 });
               }
               return p;
             });
            }
            store.writeQuery({ query: GET_PRODUCTS, data });
          }
        });
      } catch(ex) {
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      }
    }
  }
}
</script>
