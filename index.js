const { ApolloServer, gql } = require("apollo-server");

const notebooks = {
  "4567": {
    cellOrder: ["cell-123", "cell-345"],
    language: "python"
  }
};

const cells = [
  {
    id: "cell-123",
    cellType: "code",
    source: "import vdom",
    outputs: [],
    metadata: { a: 1 }
  },
  {
    id: "cell-345",
    cellType: "code",
    source: "import pandas as pd",
    outputs: [],
    metadata: {}
  }
];

const typeDefs = gql`
  scalar JSON

  # type Notebook {
  #   cells: [Cell!]!
  #   language: String
  #   metadata: JSON!
  # }

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

  # type DisplayData {
  #   data: JSON # It would be nice to "partially" type this
  #   metadata: JSON
  # }

  enum StreamName {
    STDOUT
    STDERR
  }

  type StreamOutput {
    outputType: String
    name: StreamName
    text: String
  }

  union Output = StreamOutput # | DisplayData
  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    cell(cellId: ID!): Cell
  }

`;

const resolvers = {
  Query: {
    cell: (root, { cellId }) => {
      return cells.find(cell => cell.id === cellId);
    }
  },
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
      switch (root.outputType) {
        case "stream":
          return "StreamOutput";
        default:
          throw new Error("this should not happen o_____o");
      }
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers, mocks: true });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
