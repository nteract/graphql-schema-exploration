import { gql } from "apollo-server";

export const typeDef = gql`
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

`;
