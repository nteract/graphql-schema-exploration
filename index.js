const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  scalar JSON

  type Notebook {
    cells: [Cell!]!
    language: String
    metadata: JSON!
  }

  enum CellType {
    CODE
    MARKDOWN
    RAW
  }

  interface Cell {
    id: ID!
    cellType: CellType!
    source: String!
    metadata: JSON!
  }

  type MarkdownCell implements Cell {
    id: ID!
    source: String!
    cellType: CellType!
    metadata: JSON!
  }

  type CodeCell implements Cell {
    id: ID!
    source: String!
    cellType: CellType!
    outputs: [Output!]!
    metadata: JSON!
  }

  enum OutputType {
    DISPLAY_DATA
    STREAM
  }

  type DisplayData {
    id: ID!
    # outputType: OutputType!
    data: JSON! # It would be nice to "partially" type this
    metadata: JSON!
  }

  enum StreamName {
    STDOUT
    STDERR
  }

  type StreamOutput {
    id: ID!
    # outputType: OutputType!
    name: StreamName!
    text: String!
  }

  union Output = StreamOutput | DisplayData

  type Query {
    cell(cellId: ID!): Cell!
    allCells: [Cell!]!
    randomOutput: Output!
  }

`;

const resolvers = {
  Cell: {
    __resolveType: root => {
      switch (root.cellType) {
        case "code":
          return "CodeCell";
        case "markdown":
          return "MarkdownCell";
        default:
          throw new Error("this should not happen o_____o");
      }
    }
  },
  Output: {
    __resolveType: root => {
      console.log(root);
      switch (root.outputType) {
        case "stream":
          return "StreamOutput";
        case "display_data":
          return "DisplayData";
        default:
          throw new Error("this should not happen o_____o");
      }
    }
  },
  DisplayData: {
    data: () => ({ "text/html": "<b>test</b>" })
  }
};

const mocks = {
  // By default we'll do empty objects for the JSON Scalar
  JSON: () => ({})
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers, mocks });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
