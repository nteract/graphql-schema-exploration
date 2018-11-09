import { gql } from "apollo-server";
import { typeDef as Notebook } from "./notebook";

const Query = gql`
  type Query {
    cell(cellId: ID!): Cell!
    allCells: [Cell!]!
    randomOutput: Output!
    randomCell: Cell!
  }
`;

export const typeDefs = [Query, Notebook];
