const { ApolloError } = require("apollo-server");

const i18n = require("./internalization");

exports.makeOrder = ord => {
    let o = {};

    if(ord.ord_id) o.id = ord.ord_id;
    if(ord.ord_num) o.num = ord.ord_num;
    if(ord.ord_status) o.status = ord.ord_status;
    if(ord.ord_price) o.price = ord.ord_price;
    if(ord.ord_first_name) o.firstName = ord.ord_first_name;
    if(ord.ord_last_name) o.lastName = ord.ord_last_name;
    if(ord.ord_address) o.address = ord.ord_address;
    if(ord.ord_accepted_at) o.acceptedAt = ord.ord_accepted_at;
    if(ord.ord_preparation_began_at) o.preprationBeganAt = ord.ord_preparation_began_at;
    if(ord.ord_prepartion_done_at) o.preparationDoneAt = ord.ord_prepartion_done_at;
    if(ord.ord_dispatched_at) o.dispatchedAt = ord.ord_dispatched_at;
    if(ord.ord_inserted_at) o.insertedAt = ord.ord_inserted_at;
    if(ord.ord_updated_at) o.updatedAt = ord.ord_updated_at;

    return o;
};

exports.isOrderValid = (args, lang) => {
    const $t = i18n(lang);
    if(!args.products || !args.products.length)
        throw new ApolloError($t.invalidOrderProducts);
    if(!args.firstName || args.firstName.length < 2)
        throw new ApolloError($t.invalidOrderFirstName);
    if(!args.lastName || args.lastName.length < 2)
        throw new ApolloError($t.invalidOrderLastName);
    if(!args.address || args.address.length < 8)
        throw new ApolloError($t.invalidOrderAddress);

    args.firstName = args.firstName.trim();
    args.lastName = args.lastName.trim();
    args.address = args.address.trim();
    return args;
}