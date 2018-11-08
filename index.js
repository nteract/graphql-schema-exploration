const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  scalar JSON

  type Notebook {
    cells: [Cell!]!
    language: String
    metadata: JSON!
  }

  type MarkdownCell {
    id: ID!
    source: String!
    metadata: JSON!
  }

  type CodeCell {
    id: ID!
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
const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
  playground: {
    tabs: [
      {
        query: `
# Hit command-enter or ctrl-enter a few times

query randCell {
  randomCell {
    cellType:__typename
    ...codeCell
    ...markdownCell
  }
}

fragment codeCell on CodeCell {
  source
  metadata
  outputs {
    ...stream
    ...displayData
  }
}

fragment markdownCell on MarkdownCell {
  source
  metadata
}


fragment stream on StreamOutput {
  name
  text
}

fragment displayData on DisplayData {
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
