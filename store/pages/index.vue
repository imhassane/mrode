<template>
  <as-loading v-if="$apollo.loading" />
  <div class="w-full p-10" v-else>
    <empty-product v-if="!getStoreProducts.length" />
    <div v-else>
      <div
        class="flex flex-wrap"
      >
        <as-product-resume
          v-for="(item, id) in getStoreProducts"
          :key="id"
          :cover-url="item.mainCover.url" :slug="item.slug" :status="item.status"
          :id="item.id" :name="item.name" :market-price="item.marketPrice"
          :colors="item.colors"
        />
      </div>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";
import EmptyProduct from "../components/empty/empty-product";
import AsEmpty from "../components/as-empty";
import AsProductResume from "../components/catalogue/as-product-resume";
import AsLoading from "../components/as-loading";

const PRODUCTS = gql`
    {
        getStoreProducts(start: 0, count: 20) {
            id, name, marketPrice, slug,
            mainCover { url },
            status, colors
        }
    }
`;

export default {
  components: {AsLoading, AsProductResume, AsEmpty, EmptyProduct},
  data: () => ({
    error: null
  }),
  apollo: {
    getStoreProducts: {
      query: PRODUCTS,
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

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
