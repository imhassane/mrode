const { ApolloError, UserInputError, AuthenticationError } = require("apollo-server");
const slugify = require("slugify");

const db = require("../db");
const utils = require("../utils");

const createProduct = async (_, data) => {
    if(!utils.verifyProductName(data.name))
        throw new UserInputError("Le nom du produit est incorrect");
    if(!utils.verifyProductDescription(data.description))
        throw new UserInputError("La description du produit est incorrecte");
    if(!utils.verifyProductArticle(data.article))
        throw new UserInputError("Le contenu de l'article n'est pas correct");
    if(!utils.verifyProductReference(data.reference))
        throw new UserInputError("La référence du produit est incorrecte");
    if(!utils.verifyProductPrice(data.price))
        throw new UserInputError("Le prix n'est pas correct");
    if(!utils.verifyProductMargin(data.margin))
        throw new UserInputError("La marge appliquée au produit n'est pas correcte");

    if(!data.categories || !data.categories.length)
        throw new UserInputError("Aucune catégorie choisi pour le produit");
    const options = utils.makeProductOptions(data.weight, data.colors);
    const slug = slugify(data.name);

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        // Adding the product
        const productResult = await client.query(db.queries.CREATE_PRODUCT, [
            data.name, slug, data.description, data.article,
            data.reference, data.price, data.margin, data.sellStart,
            data.sellEnd
        ]);

        // Updating its catalogues
        const categories_product = data.categories.map(c => `(${c}, ${productResult.rows[0].pro_id})`);
        await client.query(db.queries.INSERT_PRODUCT_CATEGORIES(categories_product.join(',')));

        // Adding its options
        const options_product = options.map(o => `('${o}', ${productResult.rows[0].pro_id})`);
        await client.query(db.queries.INSERT_PRODUCT_OPTIONS(options_product.join(',')));

        await client.query('COMMIT');

        return utils.makeProduct(productResult.rows[0]);
    } catch (ex) {
        try {
            await client.query('ROLLBACK');
        } catch {}
        throw ex;
        throw new Error("Une erreur est survenue lors de l'ajout du produit");
    }
};

const getProducts = async (_, args) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_ALL_PRODUCTS, [args.start, args.count]);

        return rows.map(r => utils.makeProduct(r));
    } catch {
        throw new ApolloError("Une erreur s'est produite, impossible de récupérer les produits");
    }
};

const getStoreProducts = async (_, args) => {
    try {
        const { rows } = await db.pool.query(
            db.queries.GET_MARKET_PRODUCTS,
            [args.start, args.count]
        );
        return rows.map(r => utils.makeProduct(r));
    } catch {
        throw new ApolloError("Une erreur s'est produite, impossible de récupérer les produits");
    }
};

const getProduct = async (_, args) => {
    const { rows } = await db.pool.query(db.queries.GET_PRODUCT, [args.id]);
    if(!rows.length)
        throw new ApolloError("Le produit n'existe pas");
    return utils.makeProduct(rows[0]);
};

const getProductOptions = async (parent) => {
    const { rows } = await db.pool.query(db.queries.GET_OPTIONS, [parent.id]);
    return rows.map(r => utils.makeProductOption(r));
};

const getProductAvailableOptions = async (parent) => {
    const { rows } = await db.pool.query(db.queries.GET_AVAILABLE_OPTIONS, [parent.id]);
    return rows.map(r => utils.makeProductOption(r));
};

const updateOptionStock = async (_, args) => {
    try {
        const { rows } = await db.pool.query(db.queries.UPDATE_OPTION_QUANTITY, [args.newStock, args.id]);
        return utils.makeProductOption(rows[0]);
    } catch {
        throw new ApolloError("Une erreur s'est produite lors de la mise à jour du stock");
    }
};

const getProductCategories = async (parent) => {
    const { rows } = await db.pool.query(db.queries.GET_PRODUCT_CATEGORIES, [parent.id]);
    return rows.map(r => utils.makeCategory(r));
};

const getProductColors = async (parent) => {
    const { rows } = await db.pool.query(db.queries.GET_PRODUCT_COLOR_AND_WEIGHT, [parent.id]);
    const colors = [];
    rows.forEach(({pop_option}) => {
       const [_, color] = pop_option.split("_");
       if(!colors.includes(color))
           colors.push(color);
    });
    return colors;
};

const getProductWeights = async (parent) => {
    const { rows } = await db.pool.query(db.queries.GET_PRODUCT_COLOR_AND_WEIGHT, [parent.id]);
    const weights = [];
    rows.forEach(({pop_option}) => {
        const [weight, _] = pop_option.split("_");
        if(!weights.includes(weight))
            weights.push(weight);
    });

    return weights;
};

const createOption = async (_, args) => {
    if(!utils.verifyOptionColor(args.color))
        throw new UserInputError("La couleur n'est pas définie");
    if(!utils.verifyOptionWeight(args.weight))
        throw new UserInputError("Le poids du produit n'est pas défini");
    if(!utils.verifyOptionBarcode(args.barCode))
        throw new UserInputError("Le code barre n'est pas défini");

    if(!args.plusValue)
        args.plusValue = 0;

    const option = `${args.weight}_${args.color}`;
    try {
        const { rows } = await db.pool.query(
          db.queries.INSERT_OPTION,
            [args.productId, option, args.barCode, args.plusValue]
        );
        return utils.makeProductOption(rows[0]);
    } catch {
        throw new ApolloError("Une erreur s'est produite lors de l'ajout de l'option");
    }
};

const deleteOption = async (_, args) => {
    try {
        const { rows } = await db.pool.query(db.queries.DELETE_OPTION, [args.id]);
        return utils.makeProductOption(rows[0]);
    } catch {
        throw new ApolloError("Une erreur s'est produite lors de la suppression de l'option");
    }
};

const updateOption = async (_, args) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { rows } = await client.query(
            db.queries.UPDATE_OPTION,
            [args.optionId, args.barCode, args.plusValue, args.status]
        );
        // Si l'option est indisponible, on vérifie que le produit a des options disponibles
        // Si non, on le met en rupture de stock.
        if(['UNAVAILABLE', 'OUT_OF_STOCK'].includes(args.status)) {
            const options = await client.query(db.queries.GET_AVAILABLE_OPTIONS, [rows[0].pro_id]);
            if(options.rowCount === 0) {
                await client.query(db.queries.UPDATE_PRODUCT_STATUS, [rows[0].pro_id, 'OUT_OF_STOCK']);
            }
        }
        await client.query('COMMIT');
        return utils.makeProductOption(rows[0]);
    } catch {
        try {
            await client.query('ROLLBACK');
        } catch {}
        throw new ApolloError("Une erreur s'est produite lors la mise à jour de l'option");
    }
};

const getMainCover = async (parent) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_PRODUCT_MAIN_COVER, [parent.id]);
        if(!rows.length)
            return null;
        return utils.makeCover(rows[0]);
    } catch {
        throw new ApolloError("Une erreur s'est produite, impossible de récuperer la couverture");
    }
};

const getCovers = async (parent) => {
    try {
        const { rows } = await db.pool.query(db.queries.GET_PRODUCT_COVERS, [parent.id]);
        return rows.map(r => utils.makeCover(r));
    } catch {

        throw new ApolloError("Une erreur s'est produite, impossible de récuperer les couvertures");
    }
};

const addProductCover = async (_, args) => {
  try {
      const { rows } = await db.pool.query(db.queries.ADD_PRODUCT_COVER, [
          args.productId, args.url, args.objectId
      ]);
      return utils.makeCover(rows[0]);
  } catch {
      throw new ApolloError("Une erreur s'est produite, impossible d'ajouter la couverture");
  }
};

const removeProductCover = async (_, args) => {
    try {
        const { rows } = await db.pool.query(db.queries.REMOVE_COVER, [args.id]);
        return utils.makeCover(rows[0]);
    } catch {
        throw new ApolloError("Une erreur est survenue, impossible de supprimer l'image");
    }
};

const setCoverToMain = async (_, args) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(db.queries.SET_PRODUCT_COVER_MAIN_FALSE, [args.productId]);
        const { rows } = await client.query(db.queries.SET_COVER_MAIN, [args.id]);
        await client.query('COMMIT');
        return utils.makeCover(rows[0]);
    } catch {
        try {
            await client.query('ROLLBACK');
        } catch {}
        throw new ApolloError("Une erreur s'est produite, impossible de changer l'état de la couverture");
    }
};

const switchCoverVisibleState = async (_, args) => {
    try {
        const { rows } = await db.pool.query(db.queries.CHANGE_COVER_VISIBLE_STATE, [args.id]);
        return utils.makeCover(rows[0]);
    } catch {
        throw new ApolloError("Une erreur est survenue, impossible de changer la visibilité de l'image");
    }
};

const updateProductStatus = async (_, args) => {
    let errorMessage = null;
  try {
      if(['AVAILABLE', 'PRE_ORDER', 'COMING_SOON'].includes(args.status)) {
          // Si aucune couverture n'est mise, on n'a pas la possibilité d'afficher
          // le produit publiquement.
          const covers = await db.pool.query(db.queries.GET_PRODUCT_COVERS, [args.id]);
          if (!covers.rowCount) {
              errorMessage = "Impossible de mettre à jour le statut, aucune image n'a été attribuée";
              throw new ApolloError(errorMessage);
          }
          const [isMain] = covers.rows.filter(c => c.cov_is_main === true);
          if (!isMain) {
              errorMessage = "Impossible de mettre à jour le statut, aucune image n'a été attribuée"
              throw new ApolloError(errorMessage);
          }

          // Si le produit n'a aucune option disponible en ligne, on ne change pas le statut
          const options = await db.pool.query(db.queries.GET_OPTIONS, [args.id]);
          if(!options.rowCount) {
              errorMessage = "Impossible de mettre à jour le statut, aucune option n'est disponible";
              throw new ApolloError(errorMessage);
          }
          const available = options.rows.filter(o => ['AVAILABLE', 'PRE_ORDER', 'COMING_SOON'].includes(o.pop_status));
          if(!available.length) {
              errorMessage = "Impossible de mettre à jour le statut, aucune option n'est disponible";
              throw new ApolloError(errorMessage);
          }
      }

      const { rows } = await db.pool.query(db.queries.UPDATE_PRODUCT_STATUS, [args.id, args.status]);
      return utils.makeProduct(rows[0]);
  } catch (ex) {
      if(errorMessage)
          throw ex;

      throw new ApolloError("Une erreur est survenue, impossible de mettre à jour le statut du produit");
  }
};

const orderProducts = async (order) => {
    const { rows } = await db.pool.query(db.queries.GET_ORDER_PRODUCTS, [order.id]);
    let products = rows.map(r => {
       const product = utils.makeProduct(r);
       const cover = utils.makeCover(r);
       const option = utils.makeProductOption(r);
       return {
           product, cover, option,
           orderQuantity: r.order_quantity, orderPrice: r.order_price
       };
    });
    return products;
};

const getFavorites = async (_parent, _args, ctx) => {
    if(!ctx.mlmUser)
        throw new AuthenticationError(ctx.i18n.notAuthenticated);

    try {
        const { rows } = await db.pool.query(db.queries.GET_FAVORITE_PRODUCTS, [ctx.mlmUser]);
        return rows.map(utils.makeProduct);
    } catch {
        throw new ApolloError(ctx.i18n.internalError);
    }
}

const addProductToFavorites = async (_, { id }, ctx) => {
    if(!ctx.mlmUser)
        throw new AuthenticationError(ctx.i18n.notAuthenticated);

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { rows } = await client.query(
            db.queries.ADD_PRODUCT_TO_FAVORITES,
            [id, ctx.mlmUser]
        );

        await client.query(db.queries.ADD_MLM_USER_PRODUCT_COUNT, [ctx.mlmUser]);
        await client.query('COMMIT');
        client.release();

        return rows[0].pro_id;
    } catch {
        try {
            await client.query('ROLLBACK');
            client.release();
        } catch {}
        throw new ApolloError(ctx.i18n.internalError);
    }
};

const removeProductFromFavorites = async (_, { id }, ctx) => {
    if(!ctx.mlmUser)
        throw new AuthenticationError(ctx.i18n.notAuthenticated);

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const { rows } = await client.query(
            db.queries.REMOVE_PRODUCT_FROM_FAVORITES,
            [id, ctx.mlmUser]
        );

        await client.query(db.queries.SUB_MLM_USER_PRODUCT_COUNT, [ctx.mlmUser]);
        await client.query('COMMIT');
        client.release();

        return rows[0].pro_id;
    } catch {
        try {
            await client.query('ROLLBACK');
            client.release();
        } catch {}
        throw new ApolloError(ctx.i18n.internalError);
    }
}

module.exports = {
    Query: {
        getProducts,
        getStoreProducts,
        getProduct,
        getFavorites,
    },
    Mutation: {
        createProduct,
        updateOptionStock,
        createOption,
        deleteOption,
        updateOption,
        addProductCover,
        setCoverToMain,
        switchCoverVisibleState,
        removeProductCover,
        updateProductStatus,
        addProductToFavorites,
        removeProductFromFavorites
    },
    Product: {
        options: getProductOptions,
        availableOptions: getProductAvailableOptions,
        categories: getProductCategories,
        colors: getProductColors,
        weights: getProductWeights,
        mainCover: getMainCover,
        covers: getCovers
    },
    Order: {
        orderProducts,
    }
}