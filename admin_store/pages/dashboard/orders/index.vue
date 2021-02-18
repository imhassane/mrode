<template>
  <as-loading v-if="$apollo.loading" />
  <div v-else>

    <div class="my-4" v-if="error">
      <t-alert variant="danger" show>{{ error }}</t-alert>
    </div>

    <t-table
      v-if="getOrdersWithStatus"
      :headers="['', 'id', 'Numéro', 'Nom & prénom', 'Prix', 'Statut', 'Validation']"
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
            <span :class="$theme.tag">En attente de validation</span>
          </td>
          <td :class="props.tdClass">
            <div class="flex gap-x-3">
              <t-button variant="success" @click="() => handleUpdateStatus(item.id)">Valider</t-button>
              <t-button variant="error">Annuler</t-button>
            </div>
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
            id, num, price, firstName, lastName
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
    start: 0, count: 50,
    error: null,
  }),
  methods: {
    async handleUpdateStatus(id) {
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_ORDER,
          variables: { id, status: 'ACCEPTED' },
          update(store) {
            const data = store.readQuery({ query: ORDERS, variables: {start: 0, count: 50, status: 'WAITING'} });
            data.getOrdersWithStatus = data.getOrdersWithStatus.filter(o => o.id !== id);
            store.writeQuery({ query: ORDERS, variables: {start: 0, count: 50, status: 'WAITING'}, data });
          }
        })
        this.error = null;
      } catch (err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    }
  },
  apollo: {
    getOrdersWithStatus: {
      query: ORDERS,
      pollInterval: 1000 * 10,
      variables() {
        return { start: this.start, count: this.count, status: 'WAITING'}
      },
    }
  }
}
</script>
