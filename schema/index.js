const { gql } = require("apollo-server");
const { Notebook } = require("./notebook");

const Query = `
type Query {
  cell(cellId: ID!): Cell!
  allCells: [Cell!]!
  randomOutput: Output!
  randomCell: Cell!
}
`;

const typeDefs = [Query, Notebook];

module.exports = {
  typeDefs
};
