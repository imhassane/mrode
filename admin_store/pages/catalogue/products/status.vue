<template>
  <as-loading v-if="$apollo.loading" />
  <div v-else>
    <div class="mt-3">
      <h1 :class="$theme.titles.h1 + ' mb-3'">Changer le statut du produit</h1>
      <hr />
    </div>

    <div class="my-4" v-if="(error || success)">
      <t-alert variant="danger" :show="error !== null">
        {{ error }}
      </t-alert>
      <t-alert variant="success" :show="success">
        Le statut a été mis à jour
      </t-alert>
    </div>

    <div class="my-10">
      <p><label :class="$theme.label + ' mb-4'">Statut du produit</label></p>
      <div class="flex items-center">
        <div class="w-64">
          <t-select v-model="selectedStatus" :options="{
            '': 'Choisir',
            'UNAVAILABLE': 'Indisponible',
            'AVAILABLE': 'Disponible',
            'COMING_SOON': 'A venir bientôt',
            'PRE_ORDER': 'Précommande',
            'OUT_OF_STOCK': 'Rupture de stock'
          }" />
        </div>
        <div class="w-32 ml-3">
          <t-button variant="success" @click="setProductStatus">Mettre à jour</t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsLoading from "@/components/as-loading";
import gql from "graphql-tag";

const UPDATE_PRODUCT_STATUS = gql`
    mutation ($productId: ID!, $status: ProductStatus!) {
        updateProductStatus(id: $productId, status: $status) { id }
    }
`;

const GET_PRODUCTS = gql`
    query ($start: Int!, $count: Int!){
        getProducts(start: $start, count: $count) {
            id, name, reference, price, margin, insertedAt, status,
            options { id, color, weight }
        }
    }
`;

export default {
  components: {AsLoading},
  methods: {
    async setProductStatus() {
      if(![
        'AVAILABLE', 'UNAVAILABLE',
        'COMING_SOON', 'OUT_OF_STOCK',
        'PRE_ORDER'
      ].includes(this.selectedStatus)) {
        this.error = "Veuillez choisir un statut valide";
        return;
      }
      const productId = this.$route.query.product;
      const status = this.selectedStatus;

      try {
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_STATUS,
          variables: { productId, status },
          update(store) {
            const data = store.readQuery({ query: GET_PRODUCTS, variables: { start: 0, count: 20 } });
            data.getProducts = data.getProducts.map(p => {
              if(p.id === productId)
                p.status = status;
              return p;
            });
            store.writeQuery({ query: GET_PRODUCTS, variables: { start: 0, count: 20}, data });
          }
        });

        this.error = null;
        this.success = true;
      } catch (err) {
        this.success = false;

        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    }
  },
  asyncData(ctx) {
    if(!ctx.route.query.product)
      ctx.redirect("/catalogue/products/");

    return {
      error: null,
      success: false,
      selectedStatus: ""
    };
  }
}
</script>
