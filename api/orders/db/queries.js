exports.GET_OPTIONS = values => `
    SELECT
        pop_plus_value, pop_id,
        pro_price, pro_margin, pop_quantity, pop_min_quantity,
        pro.pro_id
    FROM t_product_options_pop
    JOIN t_product_pro as pro USING (pro_id)
    WHERE pop_id IN (${values})
`;

exports.INSERT_ORDER = `
    INSERT INTO t_order_ord (ord_num, cus_id, ord_price, ord_first_name, ord_last_name, ord_address)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
`;

exports.INSERT_ORDER_PRODUCT = values => `
    INSERT INTO tj_order_product (ord_id, pro_id, pop_id, quantity, price)
    VALUES ${values}
    RETURNING *
`;

exports.UPDATE_PRODUCT_QUANTITY = `
    UPDATE t_product_options_pop
        SET pop_quantity = pop_quantity - $1,
            pop_updated_at = now()
    WHERE pop_id = $2
    RETURNING *
`;

exports.GET_ORDERS_WITH_STATUS = `
    SELECT
        ord_id, ord_num, ord_status, ord_price, ord_first_name, ord_last_name, ord_address,
        ord_accepted_at, ord_preparation_began_at, ord_preparation_done_at,
        ord_dispatched_at, ord_inserted_at, ord_updated_at,
        ord_accepted_by, ord_preparation_done_by, ord_dispatched_by,
        ord_preparation_began_by
    FROM t_order_ord
    JOIN t_customer_cus USING (cus_id)
    WHERE ord_status = $1
    ORDER BY ord_id
    LIMIT $2
`;

exports.GET_NON_CLOSED_ORDERS = `
    SELECT
        ord_id, ord_num, ord_status, ord_price, ord_first_name, ord_last_name, ord_address,
        ord_accepted_at, ord_preparation_began_at, ord_preparation_done_at,
        ord_dispatched_at, ord_inserted_at, ord_updated_at,
        ord_accepted_by, ord_preparation_done_by, ord_dispatched_by,
        ord_preparation_began_by
    FROM t_order_ord
    JOIN t_customer_cus USING (cus_id)
    WHERE ord_status IN ('ACCEPTED', 'PREPARATION', 'PREPARATION_DONE', 'DISPATCHED')
    ORDER BY ord_id
    LIMIT $1
`;

exports.GET_USER_ID = "SELECT mem_id FROM t_member_mem WHERE mem_key = $1";

exports.GET_ORDER = `
    SELECT
        ord_id, ord_num, ord_status, ord_price, ord_first_name, ord_last_name, ord_address,
        ord_accepted_at, ord_preparation_began_at, ord_preparation_done_at,
        ord_dispatched_at, ord_inserted_at, ord_updated_at,
        ord_accepted_by, ord_preparation_done_by, ord_dispatched_by,
        ord_preparation_began_by
    FROM t_order_ord
    JOIN t_customer_cus USING (cus_id)
    WHERE ord_id = $1
`;

exports.UPDATE_ORDER_STATUS = (status, user) => {
    const updateStatus = () => {
        if(status === 'ACCEPTED')
            return 'ord_accepted_by = ' + user + ', ord_accepted_at = now() ';
        else if(status === 'PREPARATION')
            return 'ord_preparation_began_by = ' + user + ', ord_preparation_began_at = now() ';
        else if(status === 'PREPARATION_DONE')
            return 'ord_preparation_done_by = ' + user + ', ord_preparation_done_at = now() ';
        else if(status === 'DISPATCHED')
            return 'ord_dispatched_by = ' + user + ', ord_dispatched_at = now() '
    };
    let sql = `
        UPDATE t_order_ord
            SET ord_status = $2,
                ${updateStatus()}
        WHERE ord_id = $1
        RETURNING *
    `;
    return sql;
};

exports.COUNT_UNPAID_ORDERS = "SELECT COUNT(ord_id) as total FROM t_order_ord WHERE ord_status = 'UNPAID'";
exports.COUNT_WAITING_ORDERS = "SELECT COUNT(ord_id) as total FROM t_order_ord WHERE ord_status = 'WAITING'";
exports.COUNT_ACCEPTED_ORDERS = "SELECT COUNT(ord_id) as total FROM t_order_ord WHERE ord_status = 'ACCEPTED'";
exports.COUNT_PREPARATION_ORDERS = "SELECT COUNT(ord_id) as total FROM t_order_ord WHERE ord_status = 'PREPARATION'";
exports.COUNT_PREPRATION_DONE_ORDERS = "SELECT COUNT(ord_id) as total FROM t_order_ord WHERE ord_status = 'PREPARATION_DONE'";
exports.COUNT_DISPATCHED_ORDERS = "SELECT COUNT(ord_id) as total FROM t_order_ord WHERE ord_status = 'DISPATCHED'";