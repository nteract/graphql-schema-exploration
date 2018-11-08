# graphql-schema-exploration

Exploring a GraphQL schema for notebooks

[Live GraphQL Playground Demo](https://gql-explore.nteract.io/)

## Hacking

You need `yarn` and `node.js`.

```
yarn
yarn start:live # auto-reloads server on changes
```

Open `http://localhost:4000/`

## Example Query

```
{
  cell(cellId: "cell-123") {
    metadata
  }
}
```
