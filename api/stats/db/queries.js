exports.GET_PRODUCTS_SELLS_BY_PERIOD = `
    select
        count(*) as total_orders,
        sum(quantity) as total_items,
        pro_name, pro_id
    from t_order_ord
    left join tj_order_product using (ord_id)
    left join t_product_pro using (pro_id)
    where ord_inserted_at between $1 and $2
    group by pro_name, pro_id
`;

exports.GET_PRODUCTS_TRENDS = `
    select
        date_trunc($1, ord_inserted_at) as period,
        count(too.ord_id) as total_orders,
        sum(top.quantity) as total_items,
        top.pro_id,
        tpp.pro_name
    from t_order_ord as too
    join tj_order_product top on too.ord_id = top.ord_id
    join t_product_pro tpp on top.pro_id = tpp.pro_id
    where ord_inserted_at between $2 and $3
    group by 1, top.pro_id, tpp.pro_name
`;

exports.GET_PRODUCT_STATS = `
    select
        date_trunc($1, ord_inserted_at) as period,
        count(too.ord_id) as total_orders,
        sum(top.quantity) as total_items,
        top.pro_id,
        tpp.pro_name
    from t_order_ord as too
    join tj_order_product top on too.ord_id = top.ord_id
    join t_product_pro tpp on top.pro_id = tpp.pro_id
    where ord_inserted_at between $2 and $3 and tpp.pro_id = $4
    group by 1, top.pro_id, tpp.pro_name
`;

exports.GET_PRODUCTS_PERCENTAGE = `
    select
        count(ord_id) as total_orders,
        sum(quantity) as total_items,
        pro_name
    from t_order_ord
    join tj_order_product using (ord_id)
    join t_product_pro using (pro_id)
    where ord_inserted_at between $1 and $2
    group by pro_name
`;