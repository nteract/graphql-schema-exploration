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
  }

  type MarkdownCell {
    id: ID!
    cellType: CellType!
    source: String!
    metadata: JSON!
  }

  type CodeCell {
    id: ID!
    cellType: CellType!
    source: String!
    outputs: [Output!]!
    metadata: JSON!
  }

  union Cell = MarkdownCell | CodeCell

  enum OutputType {
    DISPLAY_DATA
    STREAM
  }

  type DisplayData {
    # TODO: Figure out if there's a way to set a literal on a type field
    outputType: OutputType
    id: ID!
    data: JSON!
    metadata: JSON!
  }

  enum StreamName {
    STDOUT
    STDERR
  }

  type StreamOutput {
    id: ID!
    outputType: OutputType
    name: StreamName!
    text: String!
  }

  union Output = StreamOutput | DisplayData

  type Query {
    cell(cellId: ID!): Cell!
    allCells: [Cell!]!
    randomOutput: Output!
    randomCell: Cell!
  }
`;

const resolvers = {
  Cell: {
    __resolveType: root => {
      switch (root.cellType) {
        case "CODE":
          return "CodeCell";
        case "MARKDOWN":
          return "MarkdownCell";
        default:
          throw new Error("this should not happen o_____o");
      }
    }
  },
  Output: {
    __resolveType: root => {
      switch (root.outputType) {
        case "STREAM":
          return "StreamOutput";
        case "DISPLAY_DATA":
          return "DisplayData";
        default:
          throw new Error("this should not happen o_____o");
      }
    }
  }
};

const mocks = {
  // By default we'll do empty objects for the JSON Scalar
  JSON: () => ({}),
  CodeCell: () => ({
    cellType: "CODE",
    source: `import pandas as pd
df = pd.DataFrame()
display(df)`,
    outputs: [
      {
        outputType: "DISPLAY_DATA",
        data: { "text/html": "<b>table</b>" },
        metadata: {}
      }
    ]
  }),
  MarkdownCell: () => ({
    cellType: "MARKDOWN"
  })
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  mockEntireSchema: false,
  mocks,
  // Since we're playing around, enable features for introspection and playing on our current deployment
  // If this gets used in a "real" production capacity, introspection and playground should be disabled
  // based on NODE_ENV === "production"
  introspection: true,
  playground: {
    tabs: [
      {
        endpoint: "",
        query: `
# Hit command-enter or ctrl-enter a few times

query randCell {
  randomCell {
    ...codeCell
    ...markdownCell
  }
}

fragment codeCell on CodeCell {
  id
  cellType
  source
  metadata
  outputs {
    ...stream
    ...displayData
  }
}

fragment markdownCell on MarkdownCell {
  id
  cellType
  source
  metadata
}


fragment stream on StreamOutput {
  outputType
  name
  text
}

fragment displayData on DisplayData {
  outputType
  data
  metadata
}
    `
      }
    ]
  }
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
