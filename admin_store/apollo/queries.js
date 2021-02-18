import gql from "graphql-tag";

export const GET_CATEGORIES = gql`{ getCategories(start: 0, count: 20) { id, name } }`;
