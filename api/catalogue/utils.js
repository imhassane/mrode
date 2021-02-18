const { UserInputError } = require("apollo-server");

exports.isValidCategoryName = name => name && name.length > 3;

exports.isValidCategoryDescription = desc => desc && desc.length > 20;

exports.makeCategory = cat => {
    let c = {};

    if(cat.cat_id) c.id = cat.cat_id;
    if(cat.cat_name) c.name = cat.cat_name;
    if(cat.cat_description) c.description = cat.cat_description;
    if(cat.cat_visible || cat.cat_visible === false) c.visible = cat.cat_visible;
    if(cat.cat_inserted_at) c.insertedAt = cat.cat_inserted_at;
    if(cat.cat_updated_at) c.updatedAt = cat.cat_updated_at;

    return c;
}

// Products
exports.verifyProductName = (name) => name && name.trim().length > 3;

exports.verifyProductDescription = (d) => d && d.trim().length > 30;

exports.verifyProductArticle = (a) => a && a.trim().length > 50;

exports.verifyProductReference = (r) => r && r.trim().length > 5;

exports.verifyProductPrice = p => p && p > 0;

exports.verifyProductMargin = m => m && m > 0;

exports.makeProductOptions = (weights, colors) => {
    if(!weights || !weights.length)
        throw new UserInputError("Les poids du produit doivent être définis");

    if(!colors || !colors.length)
        throw new UserInputError("Les couleurs du produit doivent être définis");

    let options = [];
    for(let w of weights) {
        for(let c of colors) {
            options.push(`${w}_${c}`);
        }
    }

    return options;
};

exports.makeProduct = (value) => {
    let p = {};

    if(value.pro_id) p.id = value.pro_id;
    if(value.pro_name) p.name = value.pro_name;
    if(value.pro_slug) p.slug = value.pro_slug;
    if(value.pro_description) p.description = value.pro_description;
    if(value.pro_reference) p.reference = value.pro_reference;
    if(value.pro_article) p.article = value.pro_article;
    if(value.pro_price) p.price = value.pro_price;
    if(value.pro_margin) p.margin = value.pro_margin;
    if(value.pro_price && value.pro_margin) p.marketPrice = (value.pro_price * value.pro_margin) / 100;
    if(value.pro_status) p.status = value.pro_status;
    if(value.pro_inserted_at) p.insertedAt = value.pro_inserted_at;
    if(value.pro_updated_at) p.updatedAt = value.pro_updated_at;
    if(value.pro_selling_start) p.sellingStartAt = value.pro_selling_start;
    if(value.pro_selling_end) p.sellingEndAt = value.pro_selling_end;

    return p;
};

exports.makeProductOption = (value) => {
    let v = {};

    if(value.pop_id)
        v.id = value.pop_id;
    if(value.pop_option) {
        v.option = value.pop_option;
        const [weight, color] = v.option.split("_");
        v.weight = weight;
        v.color = color;
    }
    if(value.pop_min_quantity || value.pop_min_quantity === 0) v.minQuantity = value.pop_min_quantity;
    v.active = value.pop_active;
    v.barCode = value.pop_bar_code;

    if(value.pop_real_quantity || value.pop_real_quantity === 0)
        v.realQuantity = value.pop_real_quantity;
    if(value.pop_estimated_quantity || value.pop_estimated_quantity === 0)
        v.estimatedQuantity = value.pop_estimated_quantity;
    if(value.pop_quantity || value.pop_quantity === 0)
        v.quantity = value.pop_quantity;
    if(value.pop_total || value.pop_total === 0)
        v.total = value.pop_total;

    if(value.pop_plus_value === 0 || value.pop_plus_value)
        v.plusValue = value.pop_plus_value;
    if(value.pop_inserted_at)
        v.insertedAt = value.pop_inserted_at;
    if(value.pop_updated_at)
        v.updatedAt = value.pop_updated_at;
    if(value.pop_visible)
        v.visible = value.pop_visible;

    if(value.pop_quantity && value.pop_min_quantity) {
        v.availableQuantity = value.pop_quantity - value.pop_min_quantity;
        if(v.availableQuantity < 0)
            v.availableQuantity = 0;
    }else
        v.availableQuantity = 0;

    if(value.pop_status)
        v.status = value.pop_status;

    return v;
};

exports.makeCover = value => {
  let cov = {};

  if(value.cov_id) cov.id = value.cov_id;
  if(value.cov_object_id) cov.objectId = value.cov_object_id;
  if(value.cov_url) cov.url = value.cov_url;
  if(value.cov_is_main || value.cov_is_main === false) cov.main = value.cov_is_main;
  if(value.cov_visible || value.cov_visible === false) cov.visible = value.cov_visible;

  return cov;
};

exports.verifyOptionColor = color => color && color.length === 7;

exports.verifyOptionWeight = w => w && !isNaN(parseInt(w));

exports.verifyOptionPrice = p => p && !isNaN(parseFloat(p));

exports.verifyOptionMargin = m => m && !isNaN(parseFloat(m));

exports.verifyOptionBarcode = b => b && b.length > 8;

// Gammes
exports.verifyGammeName = n => n && n.trim().length > 5;

exports.verifyGammeDescription = d => d && d.trim().length > 20;

exports.makeGamme = val => {
    let g = {};

    if(val.gam_id)
        g.id = val.gam_id;
    if(val.gam_name)
        g.name = val.gam_name;
    if(val.gam_slug)
        g.slug = val.gam_slug;
    if(val.gam_visible || val.gam_visible === false)
        g.visible = val.gam_visible;
    if(val.gam_description)
        g.description = val.gam_description;
    if(val.gam_inserted_at)
        g.insertedAt = val.gam_inserted_at;
    if(val.gam_updated_at)
        g.updatedAt = val.gam_updated_at;

    return g;
};
