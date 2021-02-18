<template>
  <as-loading v-if="$apollo.loading || loading" />
  <div v-else>
    <h1 :class="$theme.titles.h1 + ' mb-3'">Couvertures du produit</h1>
    <hr />

    <div class="my-4 flex flex-col items-center">
      <label for="imageChooser"><img width="50" src="https://img.icons8.com/cotton/64/000000/upload-to-cloud--v1.png"/></label>
      <input type="file" accept="image/**" id="imageChooser" v-show="false" @change.prevent="onFileUpload" />

      <div class="mt-3" v-show="file !== null">
        <t-button variant="success" @click="handleUpdload">Charger l'image</t-button>
      </div>
    </div>
    <hr />

    <div class="my-4" v-if="error">
      <t-alert variant="danger" :show="error !== null">
        {{ error }}
      </t-alert>
    </div>

    <div class="mt-8" v-if="getProduct">
      <div class="flex border-b border-t divide-x font-semibold">
        <div class="w-3/12 py-2">ID Cloudinary</div>
        <div class="flex-1 p-2">Image</div>
        <div class="w-32 p-2">Visible</div>
        <div class="w-40 p-2">Image principale</div>
        <div class="w-3/12 p-2">Actions</div>
      </div>
      <as-empty v-if="!getProduct.covers.length" />
      <div
        v-else
        v-for="(item, i) in getProduct.covers"
        :key="i"
        class="flex divide-x border-b"
      >
        <div class="w-3/12 py-8 flex items-center">
          <p>{{ item.objectId }}</p>
        </div>
        <div class="flex-1 px-2 py-8">
          <img class="mx-auto w-40 h-40 object-cover" :src="item.url" />
        </div>
        <div class="w-32 py-8 flex justify-center items-center">
          <t-toggle :checked="item.visible" @click="() => switchCoverVisibleState(item.id)" />
        </div>
        <div class="w-40 py-8 flex justify-center items-center">
          <t-toggle :checked="item.main" @click="() => setCoverToMain(item.id)" />
        </div>
        <div class="w-3/12 py-8 flex flex-col justify-center px-5">
          <div class="mt-3"><t-button variant="error" @click="() => handleDeleteUpload(item.id)">Supprimer</t-button></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import gql from "graphql-tag";
import AsLoading from "~/components/as-loading";
import AsEmpty from "@/components/as-empty";

const OPTIONS = gql`
    query ($id: ID!) {
        getProduct(id: $id) {
            covers { id, objectId, url, main, visible }
        }
    }
`;

const ADD_COVER = gql`
    mutation ($productId: ID!, $url: String!, $objectId: String!) {
        addProductCover(productId: $productId, url: $url, objectId: $objectId) {
            id, objectId, url, main, visible
        }
    }
`;

const DELETE_COVER = gql`
    mutation ($id: ID!) {
        removeProductCover(id: $id) {
            id
        }
    }
`;

const SWITCH_STATE_TO_VISIBLE = gql`
  mutation ($id: ID!) {
    switchCoverVisibleState(id: $id) { id }
  }
`;

const SET_COVER_TO_MAIN = gql`
    mutation ($id: ID!, $productId: ID!) {
        setCoverToMain(id: $id, productId: $productId) { id }
    }
`;

export default {
  components: {AsEmpty, AsLoading},
  head: () => ({
    title: "Gérer les couvertures",
  }),
  apollo: {
   getProduct: {
     query: OPTIONS,
     variables() {
       return { id: this.$route.query.product }
     },
     error(err) {
       if(err.graphQLErrors && err.graphQLErrors.length)
         this.error = err.graphQLErrors[0].message;
       else
         this.error = err.message;
     }
   }
  },
  asyncData(ctx) {
    if(!ctx.route.query.product)
      ctx.redirect("/catalogue/products");
    return {
      error: null,
      file: null,
      loading: false,
    };
  },
  methods: {
    readImageData(f) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(f);
      });
    },
    async handleUpdload() {
      try {
        this.loading = true;
        const data = await this.readImageData(this.file);
         const { secure_url, public_id } = await this.$cloudinary.upload(data, { uploadPreset: "cover_upload" });

         const productId = this.$route.query.product;
         const variables = {
           url: secure_url,
           objectId: public_id,
           productId,
         };

         await this.$apollo.mutate({
           mutation: ADD_COVER,
           variables,
           update(store, { data: { addProductCover } }) {
             const data = store.readQuery({ query: OPTIONS, variables: { id: productId }});
             data.getProduct.covers.push(addProductCover);
             store.writeQuery({ query: OPTIONS, variables: { id: productId }, data });
           }
         });

         this.loading = false;
      } catch (ex) {
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      } finally {
        this.loading = false;
        this.file = null;
      }
    },
    async handleDeleteUpload(optionId) {
      try {
        this.loading = true;

        const productId = this.$route.query.product;
        await this.$apollo.mutate({
          mutation: DELETE_COVER,
          variables: { id: optionId },
          update(store) {
            const data = store.readQuery({ query: OPTIONS, variables: { id: productId } });
            data.getProduct.covers = data.getProduct.covers.filter(c => c.id !== optionId);
            store.writeQuery({ query: OPTIONS, variables: { id: productId }, data });
          }
        });
      } catch(ex) {
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      } finally {
        this.loading = false;
      }
    },
    async onFileUpload({ target: { files: [file] } }) {
      if(file) {
        this.file = file
      }
    },
    async switchCoverVisibleState(coverId) {
      try {
        const productId = this.$route.query.product;
        await this.$apollo.mutate({
          mutation: SWITCH_STATE_TO_VISIBLE,
          variables: { id: coverId },
          update(store) {
            const data = store.readQuery({ query: OPTIONS, variables: { id: productId} });
            data.getProduct.covers = data.getProduct.covers.map(c => {
              if(c.id === coverId) {
                c.visible = !c.visible;
              }
              return c;
            });
            store.writeQuery({ query: OPTIONS, variables: { id: productId }, data });
          }
        });

        this.error = null;
      } catch (ex) {
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      } finally {
        this.loading = false;
      }
    },
    async setCoverToMain(coverId) {
      try {
        this.loading = true;
        const productId = this.$route.query.product;
        await this.$apollo.mutate({
          mutation: SET_COVER_TO_MAIN,
          variables: { id: coverId, productId },
          update(store) {
            const data = store.readQuery({ query: OPTIONS, variables: { id: productId} });
            data.getProduct.covers = data.getProduct.covers.map(c => {
              if(c.id === coverId) {
                c.main = true;
              } else {
                c.main = false;
              }
              return c;
            });
            store.writeQuery({ query: OPTIONS, variables: { id: productId }, data });
          }
        });

        this.error = null;
      } catch (ex) {
        if(ex.graphQLErrors && ex.graphQLErrors.length)
          this.error = ex.graphQLErrors[0].message;
        else
          this.error = ex.message;
      } finally {
        this.loading = false;
      }
    },
  }
}
</script>
