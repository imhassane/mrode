exports.CREATE_CATEGORY = `
    INSERT INTO t_category_cat (cat_name, cat_slug, cat_description)
    VALUES ($1, $2, $3)
    RETURNING *
`;

exports.GET_ALL_CATEGORIES = `
    SELECT
        cat_id, cat_name, cat_description,
        cat_visible,
        cat_inserted_at, cat_updated_at 
    FROM t_category_cat
    WHERE cat_id >= $1
    LIMIT $2
`;

exports.GET_CATEGORY = `
    SELECT
        cat_id, cat_name, cat_description,
        cat_visible,
        cat_inserted_at, cat_updated_at
    FROM t_category_cat
    WHERE cat_id = $1
`;

exports.GET_ALL_CATEGORY_PRODUCTS = `
    SELECT
        pro.pro_id, pro_name, pro_slug, pro_reference,
        pro_price, pro_margin, pro_selling_start, pro_selling_end,
        pro_status, pro_article, pro_inserted_at,
        pro_updated_at, pro_description
    FROM t_product_pro as pro
    JOIN tj_category_product USING (pro_id)
    WHERE cat_id = $1
    ORDER BY pro.pro_id DESC
    OFFSET $2 LIMIT $3
`;

// Products
exports.CREATE_PRODUCT = `
    INSERT INTO t_product_pro (
        pro_name, pro_slug, pro_description, pro_article,
        pro_reference, pro_price, pro_margin, pro_selling_start,
        pro_selling_end
    ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9
    )
    RETURNING *
`;

exports.INSERT_PRODUCT_CATEGORIES = values => `
    INSERT INTO tj_category_product (cat_id, pro_id)
    VALUES ${values}
`;

exports.INSERT_PRODUCT_OPTIONS = values => `
    INSERT INTO t_product_options_pop (pop_option, pro_id)
    VALUES ${values}
`;

exports.GET_PRODUCT_CATEGORIES = `
    SELECT
        cat_id, cat_name, cat_description,
        cat_visible,
        cat_inserted_at, cat_updated_at
    FROM t_category_cat
    JOIN tj_category_product USING (cat_id)
    WHERE pro_id = $1
`;

exports.GET_PRODUCT_COLOR_AND_WEIGHT = `
    SELECT pop_option FROM t_product_options_pop WHERE pro_id = $1
`;

exports.GET_PRODUCT = `
    SELECT
        pro_id, pro_name, pro_slug, pro_reference,
        pro_price, pro_margin, pro_selling_start, pro_selling_end,
        pro_status, pro_article, pro_inserted_at,
        pro_updated_at, pro_description
    FROM t_product_pro
    WHERE pro_id = $1
`;

exports.GET_ALL_PRODUCTS = `
    SELECT
        pro_id, pro_name, pro_slug, pro_reference,
        pro_price, pro_margin, pro_selling_start, pro_selling_end,
        pro_status, pro_article, pro_inserted_at,
        pro_updated_at, pro_description
    FROM t_product_pro
    WHERE pro_id >= $1
    ORDER BY pro_id DESC
    LIMIT $2
`;

exports.GET_PRODUCTS_WITH_STATUS = `
    SELECT
        pro_id, pro_name, pro_slug, pro_reference,
        pro_price, pro_margin, pro_selling_start, pro_selling_end,
        pro_status, pro_article, pro_inserted_at,
        pro_updated_at, pro_description
    FROM t_product_pro
    WHERE pro_id >= $1 AND pro_status = $3
    ORDER BY pro_id DESC
    LIMIT $2
`;

exports.GET_MARKET_PRODUCTS = `
    SELECT
        pro_id, pro_name, pro_slug, pro_reference,
        pro_price, pro_margin, pro_selling_start, pro_selling_end,
        pro_status, pro_article, pro_inserted_at,
        pro_updated_at, pro_description
    FROM t_product_pro
    WHERE pro_id >= $1 AND pro_status IN ('AVAILABLE', 'PRE_ORDER')
    ORDER BY pro_id DESC
    LIMIT $2
`;

exports.GET_PRODUCT_MAIN_COVER = `
    SELECT
        cov_id, cov_object_id, cov_url,
        cov_visible, cov_is_main
    FROM t_cover_cov
    WHERE pro_id = $1 AND cov_is_main = true
`;

exports.GET_PRODUCT_COVERS = `
    SELECT
        cov_id, cov_object_id, cov_url,
        cov_visible, cov_is_main
    FROM t_cover_cov
    WHERE pro_id = $1
`;

exports.ADD_PRODUCT_COVER = `
    INSERT INTO t_cover_cov (pro_id, cov_url, cov_object_id)
    VALUES ($1, $2, $3)
    RETURNING *
`;

exports.REMOVE_COVER = `
    DELETE FROM t_cover_cov
        WHERE cov_id = $1
    RETURNING *
`;

exports.CHANGE_COVER_VISIBLE_STATE = "UPDATE t_cover_cov SET cov_visible = not cov_visible WHERE cov_id = $1 RETURNING *";

exports.SET_COVER_MAIN = "UPDATE t_cover_cov SET cov_is_main = true WHERE cov_id = $1 RETURNING *";

exports.SET_PRODUCT_COVER_MAIN_FALSE = "UPDATE t_cover_cov SET cov_is_main = false WHERE pro_id = $1 RETURNING *"

exports.GET_OPTIONS = `
    SELECT
        pop_id, pop_option, pop_plus_value,
        pop_active, pop_real_quantity, pop_estimated_quantity,
        pop_quantity, pop_total, pop_inserted_at,
        pop_updated_at, pop_bar_code, pop_min_quantity, pop_status
    FROM t_product_options_pop
    WHERE pro_id = $1
    ORDER BY pop_option
`;

exports.GET_AVAILABLE_OPTIONS = `
    SELECT
        pop_id, pop_option, pop_plus_value,
        pop_active, pop_real_quantity, pop_estimated_quantity,
        pop_quantity, pop_total, pop_inserted_at,
        pop_updated_at, pop_bar_code, pop_min_quantity
    FROM t_product_options_pop
    WHERE pro_id = $1 AND pop_status IN ('AVAILABLE', 'PRE_ORDER')
    ORDER BY pop_option
`;

exports.UPDATE_OPTION_QUANTITY = `
    UPDATE t_product_options_pop
        SET pop_quantity = pop_quantity + $1,
            pop_estimated_quantity = pop_estimated_quantity + $1,
            pop_real_quantity = pop_real_quantity + $1,
            pop_total = pop_total + $1
        WHERE pop_id = $2
    RETURNING *
`;

exports.INSERT_OPTION = `
    INSERT INTO t_product_options_pop (pro_id, pop_option, pop_bar_code, pop_plus_value)
    VALUES ($1, $2, $3, $4)
    RETURNING *
`;

exports.DELETE_OPTION = `
    DELETE FROM t_product_options_pop
    WHERE pop_id = $1
    RETURNING *
`;

exports.UPDATE_OPTION_VISIBILITY = `
    UPDATE t_product_options_pop SET pop_visible = !pop_visible, pop_updated_at = now() WHERE pop_id = $1 RETURNING *
`;

exports.UPDATE_OPTION = `
    UPDATE t_product_options_pop
        SET pop_bar_code = $2,
            pop_plus_value = $3,
            pop_status = $4,
            pop_updated_at = now()
    WHERE pop_id = $1
    RETURNING *
`;

exports.UPDATE_PRODUCT_STATUS = `
    UPDATE t_product_pro
        SET pro_status = $2,
            pro_updated_at = now()
    WHERE pro_id = $1
    RETURNING *
`;

// Gammes

exports.CREATE_GAMME = `
    INSERT INTO t_gamme_gam (gam_name, gam_slug, gam_description)
    VALUES ($1, $2, $3)
    RETURNING *
`;

exports.INSERT_GAMME_PRODUCTS = values => `INSERT INTO tj_gamme_product(gam_id, pro_id) VALUES ${values}`;

exports.GET_ALL_GAMMES = `
    SELECT
        gam_id, gam_name, gam_slug, gam_description,
        gam_visible, gam_inserted_at, gam_updated_at
    FROM t_gamme_gam
    WHERE gam_id >= $1
    ORDER BY gam_id DESC
    LIMIT $2
`;

exports.GET_GAMME = `
    SELECT
        gam_id, gam_name, gam_slug, gam_description,
        gam_status, gam_inserted_at, gam_updated_at
    FROM t_gamme_gam
    WHERE gam_id = $1
`;

exports.GET_ALL_GAMME_PRODUCTS = `
    SELECT
        pro.pro_id, pro_name, pro_slug, pro_reference,
        pro_price, pro_margin, pro_selling_start, pro_selling_end,
        pro_status, pro_article, pro_inserted_at,
        pro_updated_at, pro_description
    FROM t_product_pro as pro
    JOIN tj_gamme_product USING (pro_id)
    WHERE gam_id = $1
    ORDER BY pro.pro_id DESC
    OFFSET $2 LIMIT $3
`;

exports.GET_ORDER_PRODUCTS = `
    SELECT
        top.pro_id, top.quantity as order_quantity, top.price as order_price,
        pro_name, pro_slug, pro_reference, pro_price,
        pop_option, pop_bar_code, cov_url
    FROM tj_order_product as top
    JOIN t_product_pro as tpp ON top.pro_id = tpp.pro_id
    JOIN t_product_options_pop as pop ON pop.pop_id = top.pop_id
    JOIN t_cover_cov as tcc ON tcc.pro_id = top.pro_id AND cov_is_main = true
    WHERE ord_id = $1
    ORDER BY pop.pop_id
`;

exports.ADD_PRODUCT_TO_FAVORITES = `
    INSERT INTO mlm_favorites_products_mfp (pro_id, mid_id)
    VALUES ($1, $2)
    RETURNING *
`;

exports.ADD_MLM_USER_PRODUCT_COUNT = `
    UPDATE mlm_identity_mid
        SET mid_favorites_count = mid_favorites_count + 1
    WHERE mid_id = $1
`;

exports.SUB_MLM_USER_PRODUCT_COUNT = `
    UPDATE mlm_identity_mid
        SET mid_favorites_count = mid_favorites_count - 1
    WHERE mid_id = $1
`;

exports.REMOVE_PRODUCT_FROM_FAVORITES = `
    DELETE FROM mlm_favorites_products_mfp
    WHERE pro_id = $1 AND mid_id = $2
    RETURNING *
`;

exports.GET_FAVORITE_PRODUCTS = `
    SELECT
        tpp.pro_id, pro_name, pro_slug, pro_reference,
        pro_price, pro_margin, pro_selling_start, pro_selling_end,
        pro_status, pro_article, pro_inserted_at,
        pro_updated_at, pro_description
    FROM mlm_favorites_products_mfp
    JOIN t_product_pro AS tpp USING (pro_id)
    WHERE mid_id = $1
`;