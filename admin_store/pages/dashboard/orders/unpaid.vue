<template>
  <as-loading v-if="$apollo.loading" />
  <div v-else>

    <t-table
      v-if="getOrdersWithStatus"
      :headers="['', 'id', 'Numéro', 'Nom & prénom', 'Prix', 'Statut']"
    >
      <template slot="tbody" slot-scope="props">
        <tbody :class="props.tbodyClass">
        <tr
          :class="props.trClass"
          v-for="(item, id) in getOrdersWithStatus"
        >
         <td :class="props.tdClass"><t-checkbox /></td>
         <td :class="props.tdClass">{{ item.id }}</td>
          <td :class="props.tdClass">{{ item.num }}</td>
          <td :class="props.tdClass">{{ item.firstName }} {{ item.lastName.toUpperCase() }}</td>
          <td :class="props.tdClass">{{ item.price }} €</td>
          <td :class="props.tdClass">
            <span :class="$theme.tag">Non payé</span>
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
    query ($start: Int!, $count: Int!, $status: OrderStatus!){
        getOrdersWithStatus(start: $start, count: $count, status: $status) {
            id, num, price, firstName, lastName,
        }
    }
`;

export default {
  components: {AsLoading},
  head: () => ({
    title: "Commandes"
  }),
  data: () => ({
    start: 0, count: 50
  }),
  apollo: {
    getOrdersWithStatus: {
      query: ORDERS,
      pollInterval: 1000 * 60,
      variables() {
        return { start: this.start, count: this.count, status: 'UNPAID'}
      },
    }
  }
}
</script>
