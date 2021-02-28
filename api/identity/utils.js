const { UserInputError } = require("apollo-server");
const i18n = require("./internationalization");
const bcrypt = require("bcrypt");

exports.isValidPassword = (pass) => pass && pass.length >= 8;

exports.isValidEmail = email => {
    return email && (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)
};

exports.verifyCustomerWithAddress = (args, lang) => {
    const $t = i18n(lang);

    if(!args.email) throw new UserInputError($t.incorrectEmail);
    if(args.firstName.length < 2) throw new UserInputError($t.incorrectFirstName);
    if(args.lastName.length < 2) throw new UserInputError($t.incorrectLastName);
    if(args.postalCode.length < 5) throw new UserInputError($t.incorrectPostalCode);
    if(args.city.trim().length < 2) throw new UserInputError($t.incorrectCity);
    if(args.country.trim().length < 2) throw new UserInputError($t.incorrectCountry);
    if(args.address.trim().length < 5) throw new UserInputError($t.incorrectAddress);

    args.email = args.email.trim();
    args.postalCode = args.postalCode.trim();
    args.city = args.city.trim();
    args.country = args.country.trim();
    args.address = args.address.trim();

    return args;
};

exports.makeCustomer = cus => {
    let c = {};

    if(cus.cus_id) c.id = cus.cus_id;
    if(cus.cus_email) c.email = cus.cus_email;
    if(cus.cus_first_name) c.firstName = cus.cus_first_name;
    if(cus.cus_last_name) c.lastName = cus.cus_last_name;
    if(cus.cus_inserted_at) c.insertedAt = cus.cus_inserted_at;
    if(cus.cus_updated_at) c.updatedAt = cus.cus_updated_at;

    return c;
};

exports.makeCustomerAddress = addr => {
  let a = {};

  if(addr.cad_id) a.id = addr.cad_id;
  if(addr.cad_address) a.address = addr.cad_address;
  if(addr.cad_postal_code) a.postalCode = addr.cad_postal_code;
  if(addr.cad_city) a.city = addr.cad_city;
  if(addr.cad_country) a.country = addr.cad_country;
  if(addr.cad_inserted_at) a.insertedAt = addr.cad_inserted_at;
  if(addr.cad_updated_at) a.updatedAt = addr.cad_updated_at;

  return a;
};

exports.makeMember = mem => {
    let m = {};

    if(mem.mem_id) m.id = mem.mem_id;
    if(mem.mem_full_name) m.fullName = mem.mem_full_name;
    if(mem.mem_role) m.role = mem.mem_role;
    if(mem.mem_email) m.email = mem.mem_email;
    if(mem.mem_inserted_at) m.insertedAt = mem.mem_inserted_at;
    if(mem.mem_updated_at) m.updatedAt = mem.mem_updated_at;

    return m;
};

exports.makeMlmMember = mem => {
    let m = { address: null, favoritesCount: 0 };

    if(mem.mid_id) m.id = mem.mid_id;
    if(mem.mid_email) m.email = mem.mid_email;
    if(mem.mid_first_name) m.firstName = mem.mid_first_name;
    if(mem.mid_last_name) m.lastName = mem.mid_last_name;
    if(mem.mid_status) m.status = mem.mid_status;
    if(mem.mid_inserted_at) m.insertedAt = mem.mid_inserted_at;
    if(mem.mid_updated_at) m.updatedAt = mem.mid_updated_at;
    if(mem.mid_access_code) m.accessCode = mem.mid_access_code;
    if(mem.mid_avatar) m.avatar = mem.mid_avatar;
    if(mem.mid_avatar_url) m.avatarUrl = mem.mid_avatar_url;
    if(mem.mid_favorites_count) m.favoritesCount = mem.mid_favorites_count;

    const address = makeAddress(mem);
    if(address)
        m.address = address;
    return m;
}

const makeAddress = addr => {
    let a = { street: {}, mainAddress: false };

    if(addr.mia_id) a.id = addr.mia_id;
    if(addr.mia_street_name) a.street.name = addr.mia_street_name;
    if(addr.mia_street_number) a.street.number = addr.mia_street_number;
    if(addr.mia_postal_code) a.postalCode = addr.mia_postal_code;
    if(addr.mia_city) a.city = addr.mia_city;
    if(addr.mia_country) a.country = addr.mia_country;
    if(addr.mia_main_address) a.mainAddress = true;
    if(addr.mia_inserted_at) a.insertedAt = addr.mia_inserted_at;
    if(addr.mia_updated_at) a.updatedAt = addr.mia_updated_at;

    return a;
}

exports.hashPassword = password => bcrypt.hashSync(password, 15);

exports.comparePassword = (pass, hash) => bcrypt.compareSync(pass, hash);

exports.makeAddress = makeAddress;
