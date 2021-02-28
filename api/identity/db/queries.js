exports.CREATE_MEMBER = `
    INSERT INTO t_member_mem (mem_key, mem_full_name, mem_access_code, mem_access_pwd, mem_email, mem_role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
`;

exports.AUTHENTICATE_MEMBER = `
    SELECT
        mem_access_code, mem_access_pwd, mem_key
    FROM t_member_mem
    WHERE mem_access_code = $1
`;

exports.GET_MEMBER_BY_ID = `
    SELECT
        mem_id,
        mem_full_name, mem_role,
        mem_email, mem_inserted_at,
        mem_updated_at
    FROM t_member_mem
    WHERE mem_id = $1
`;

exports.GET_ORDER_ACCEPTED_BY = `
    SELECT
        mem_id, mem_full_name, mem_role,
        mem_email, mem_inserted_at, mem_updated_at
    FROM t_order_ord
    JOIN t_member_mem ON mem_id = ord_accepted_by
    WHERE ord_id = $1
`;

exports.GET_PREPARATION_BY = `
    SELECT
        mem_id, mem_full_name, mem_role,
        mem_email, mem_inserted_at, mem_updated_at
    FROM t_order_ord
    JOIN t_member_mem ON mem_id = ord_preparation_began_by
    WHERE ord_id = $1
`;

exports.GET_PREPARATION_DONE_BY = `
    SELECT
        mem_id, mem_full_name, mem_role,
        mem_email, mem_inserted_at, mem_updated_at
    FROM t_order_ord
    JOIN t_member_mem ON mem_id = ord_preparation_done_by
    WHERE ord_id = $1
`;

exports.GET_DISPATCHED_BY = `
    SELECT
        mem_id, mem_full_name, mem_role,
        mem_email, mem_inserted_at, mem_updated_at
    FROM t_order_ord
    JOIN t_member_mem ON mem_id = ord_dispatched_by
    WHERE ord_id = $1
`;

exports.CREATE_IDENTITY = ``;

exports.CREATE_IDENTITY_PROFILE = ``;

exports.GET_CUSTOMER_WITH_EMAIL = `
    SELECT cus_id, cus_email, cus_first_name, cus_last_name, cus_active
    FROM t_customer_cus
    WHERE cus_email = $1
`;

exports.GET_CUSTOMER_WITH_ID = `
    SELECT cus_id, cus_email, cus_first_name, cus_last_name, cus_active
    FROM t_customer_cus
    WHERE cus_id = $1
`;

exports.GET_CUSTOMER_LAST_ADDRESS = `
    SELECT cad_id, cad_address, cad_city, cad_postal_code,
            cad_country, cad_inserted_at, cad_updated_at
    FROM t_customer_address_cad
    WHERE cus_id = $1
    ORDER BY cad_id DESC
    LIMIT 1
`;

exports.GET_CUSTOMER_ADDRESSES = `
    SELECT cad_id, cad_address, cad_city, cad_postal_code,
            cad_country, cad_inserted_at, cad_updated_at
    FROM t_customer_address_cad
    WHERE cus_id = $1
    ORDER BY cad_id DESC
`;

exports.INSERT_CUSTOMER = `
    INSERT INTO t_customer_cus (cus_email, cus_first_name, cus_last_name)
    VALUES ($1, $2, $3)
    RETURNING *
`;

exports.INSERT_CUSTOMER_ADDRESS = `
    INSERT INTO t_customer_address_cad (
        cus_id, cad_address, cad_postal_code,
        cad_city, cad_country
    ) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
`;

exports.INVITE_MLM_MEMBER = `
    INSERT INTO mlm_invitations (email, access_code)
    VALUES ($1, $2)
    RETURNING access_code
`;

exports.INVITE_MLM_MEMBER_WITH_MEMBER = `
    INSERT INTO mlm_invitations (email, access_code, added_by)
    VALUES ($1, $2, $3)
    RETURNING access_code
`;

exports.VERIFY_MLM_ACCESS_CODE = `
    SELECT
        access_code, added_by, active, email
    FROM mlm_invitations
    WHERE access_code = $1
`;

exports.GET_MLM_HIERARCHY = `
    SELECT
        mid_hierarchy, added_by
    FROM mlm_identity_mid
    WHERE mid_id = $1
`;

exports.INSERT_MLM_MEMBER = `
    INSERT INTO mlm_identity_mid (
        mid_email, mid_first_name, mid_last_name, mid_hash,
        mid_hierarchy, mid_access_code, mid_avatar, mid_avatar_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
`;

exports.INSERT_MLM_MEMBER_WITH_ADDED = `
    INSERT INTO mlm_identity_mid (
        mid_email, mid_first_name, mid_last_name, mid_hash,
        mid_hierarchy, mid_access_code, mid_avatar, mid_avatar_url,
                                  added_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
`;

exports.INSERT_MLM_DOCUMENTS = `
    INSERT INTO mlm_identity_documents (mid_id, siret) VALUES ($1, $2) RETURNING *
`;

exports.DESACTIVATE_MLM_INVITATION = `
    UPDATE mlm_invitations
        SET active = false
    WHERE access_code = $1
`;

exports.GET_MLM_MEMBER_CREDENTIALS = `
    SELECT mid_hash, mid_status, mid_id
    FROM mlm_identity_mid
    WHERE mid_access_code = $1
`;

exports.GET_MLM_MEMBER = `
    SELECT
        mid.mid_id, mid_first_name, mid_last_name, mid_email,
        mid_status, mid_inserted_at, mid_updated_at,
        mid_access_code, mid_avatar, mid_avatar_url,
        mid_favorites_count,
        mia.mia_id, mia_street_name, mia_street_number, mia_country,
        mia_inserted_at, mia_updated_at, mia_postal_code, mia_city
    FROM mlm_identity_mid as mid
    JOIN mlm_identity_documents USING (mid_id)
    LEFT JOIN mlm_identity_address_mia as mia USING (mia_id)
    WHERE mid.mid_id = $1
`;

exports.GET_MLM_ADDRESSES = `
    SELECT
        mia_id, mia_street_name, mia_street_number, mia_country,
        mia_inserted_at, mia_updated_at, mia_postal_code, mia_city,
        mia_main_address
    FROM mlm_identity_address_mia
    WHERE mid_id = $1
`;

exports.GET_MLM_MEMBER_HIERARCHY= `
    SELECT
        mid_id, mid_first_name, mid_last_name, mid_email,
        mid_status, mid_inserted_at, mid_updated_at,
        mid_access_code, mid_avatar, mid_avatar_url,
        mid_favorites_count
    FROM mlm_identity_mid
    JOIN mlm_identity_documents USING (mid_id)
    WHERE added_by = $1
`;

exports.INSERT_ADDRESS = `
    INSERT INTO mlm_identity_address_mia (mia_street_name, mia_postal_code, mia_country, mia_street_number, mia_city, mid_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
`;

exports.DELETE_ADDRESS = `
    DELETE FROM mlm_identity_address_mia
    WHERE mia_id = $1 AND mid_id = $2
    RETURNING *
`;