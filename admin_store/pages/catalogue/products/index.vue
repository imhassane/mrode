<template>
  <as-loading v-if="$apollo.loading || loading" />
  <div v-else>
    <div class="mt-3">
      <h1 :class="$theme.titles.h1 + ' mb-3'">Produits</h1>
    </div>

    <div class="my-4" v-if="error">
      <t-alert variant="danger" :show="error !== null">
        {{ error }}
      </t-alert>
    </div>

    <div class="my-3">
      <div :class="$theme.inputs.text">
        <client-only><i class="fas fa-search mr-2"></i></client-only>
        <input type="search" v-model="search" placeholder="Chercher un produit" class="px-2 py-1 flex-1" />
      </div>
    </div>

    <div class="mt-5">
      <div class="flex items-center text-sm py-2 border border-green-500 bg-green-500 text-white px-3 rounded-t">
        <div class="w-16">
          <t-checkbox />
        </div>
        <div class="w-2/12">Nom</div>
        <div class="w-1/12">Couleurs</div>
        <div class="w-1/12">Poids</div>
        <div class="w-1/12">Prix</div>
        <div class="w-1/12">Marge</div>
        <div class="w-1/12">Référence</div>
        <div class="w-1/12">Disponible</div>
        <div class="w-1/12">Ajouté le</div>
        <div class="flex-1"></div>
      </div>
      <div>
        <div
          class="flex py-2 border-b"
          v-for="(item, id) in getProducts"
          :key="id"
        >
          <div class="w-16"><t-checkbox /></div>
          <div class="w-2/12">{{ item.name }}</div>
          <div class="w-1/12 flex flex-col">
            <div
              v-for="(option, _id) in item.options"
              :key="_id"
              class="w-4 h-4 border rounded-full mb-2" :style="`background-color: ${option.color}`"
            ></div>
          </div>
          <div class="w-1/12 flex flex-col">
            <div
              v-for="(option, _id) in item.options"
              :key="_id"
              :class="$theme.tag + ' w-12 text-center mb-1 text-sm'"
            >{{ option.weight }}</div>
          </div>
          <div class="w-1/12"><span class="text-sm">{{ item.price }}€</span></div>
          <div class="w-1/12"><span class="text-sm">{{ item.margin }}%</span></div>
          <div class="w-1/12"><span :class="$theme.tag + ' text-sm'">{{ item.reference }}</span></div>
          <div class="w-1/12">
            <div class="flex">
              <t-toggle
                variant="success" :checked="item.status === 'AVAILABLE'"
                @click="() => setProductStatus(item.id, item.status)"
              />
            </div>
            <div class="my-2">
              <p class="text-sm">{{ renderStatus(item.status) }}</p>
            </div>
          </div>
          <div class="w-1/12"><span :class="$theme.tag + ' text-sm'">{{ new Date(item.insertedAt).toLocaleDateString() }}</span></div>
          <div class="flex-1 flex flex-col text-center">
            <nuxt-link :class="$theme.buttons.primary + ' mx-auto w-1/2'" :to="`/catalogue/products/edit?product=${item.id}`">
              <client-only><i class="fas fa-edit mr-2"></i></client-only>
              Editer
            </nuxt-link>
            <nuxt-link :class="$theme.buttons.primary + ' mt-2 mx-auto w-1/2'" :to="`/catalogue/products/covers?product=${item.id}`">
              <client-only><i class="fas fa-photo-video mr-2"></i></client-only>
              Images
            </nuxt-link>
            <nuxt-link :class="$theme.buttons.primary + ' mt-2 mx-auto w-1/2'" :to="`/catalogue/products/status?product=${item.id}`">
              <client-only><i class="fas fa-unlock-alt mr-2"></i></client-only>
              Statut
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import AsLoading from "@/components/as-loading";

const GET_PRODUCTS = gql`
    query ($start: Int!, $count: Int!){
        getProducts(start: $start, count: $count) {
            id, name, reference, price, margin, insertedAt, status,
            options { id, color, weight }
        }
    }
`;

const UPDATE_PRODUCT_STATUS = gql`
    mutation ($productId: ID!, $status: ProductStatus!) {
        updateProductStatus(id: $productId, status: $status) { id }
    }
`;

export default {
  components: {AsLoading},
  head: () => ({
    title: "Produits"
  }),
  data: () => ({
    search: "",
    error: null,
    loading: false,
  }),
  methods: {
    async setProductStatus(productId, status) {
      this.loading = true;
      if(status === 'UNAVAILABLE')
        status = 'AVAILABLE';
      else
        status = 'UNAVAILABLE';

      const variables = { productId, status };
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_STATUS,
          variables,
          update(store) {
            const data = store.readQuery({ query: GET_PRODUCTS, variables: { start: 0, count: 20 } });
            data.getProducts = data.getProducts.map(p => {
              if(p.id === productId)
                p.status = status;
              return p;
            });
            store.writeQuery({ query: GET_PRODUCTS, variables: { start: 0, count: 20}, data });
          }
        })
      } catch (err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    renderStatus(status) {
      let s = "Indisponible";
      switch(status) {
        case "AVAILABLE": s = "Disponible"; break;
        case "PRE_ORDER": s = "Précommande"; break;
        case "OUT_OF_STOCK": s = "Rupture de stock"; break;
        case "COMING_SOON": s = "Disponible bientôt"; break;
        default: break;
      };

      return s;
    }
  },
  apollo: {
    getProducts: {
      query: GET_PRODUCTS,
      variables() {
        return {
          start: 0,
          count: 20
        };
      },
      error(err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    }
  }
}
</script>
