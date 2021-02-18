<template>
  <as-loading v-if="$apollo.loading" />
  <div v-else>

    <div class="my-4" v-if="error">
      <t-alert variant="danger" show>{{ error }}</t-alert>
    </div>

    <t-table
      v-if="getNonClosedOrders"
      :headers="['', 'id', 'Numéro', 'Nom & prénom', 'Prix', 'Statut', '']"
    >
      <template slot="tbody" slot-scope="props">
        <tbody :class="props.tbodyClass">
        <tr
          :class="props.trClass"
          v-for="(item, id) in getNonClosedOrders"
        >
          <td :class="props.tdClass"><t-checkbox /></td>
          <td :class="props.tdClass">{{ item.id }}</td>
          <td :class="props.tdClass">{{ item.num }}</td>
          <td :class="props.tdClass">{{ item.firstName }} {{ item.lastName.toUpperCase() }}</td>
          <td :class="props.tdClass">{{ item.price }} €</td>
          <td :class="props.tdClass">
            <t-tag tag-name="button" :variant="getVariant(item.status)">{{ $utils.renderStatus(item.status) }}</t-tag>
          </td>
          <td :class="props.tdClass">
            <t-tag tag-name="button" :variant="'warning'">{{ $utils.getDateDiff(new Date(), new Date(item.insertedAt)) }}h</t-tag>
          </td>
        </tr>
        </tbody>
      </template>
    </t-table>

  </div>
</template>

<script>
import gql from "graphql-tag";
import AsLoading from "@/components/as-loading";


const ORDERS = gql`
    query ($count: Int!){
        getNonClosedOrders(count: $count) {
            id, num, price, firstName, lastName,
            status, insertedAt
        }
    }
`;

const UPDATE_ORDER = gql`
    mutation ($id: ID!, $status: OrderStatus!) {
        updateOrderStatus(id: $id, status: $status) {
            id
        }
    }
`;

export default {
  components: {AsLoading},
  head: () => ({
    title: "Commandes"
  }),
  data: () => ({
    count: 50,
    error: null,
  }),
  methods: {
    getVariant(st) {
      if(st === 'PREPARATION') return 'danger';
      else if(st === 'PREPARATION_DONE') return 'warning';
      else if(st === 'DISPATCHED') return 'success';
      else return 'successOutline';
    }
  },
  apollo: {
    getNonClosedOrders: {
      query: ORDERS,
      pollInterval: 1000 * 10,
      variables() {
        return { count: this.count }
      },
    }
  }
}
</script>
