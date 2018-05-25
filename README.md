# graphql-schema-exploration

Exploring a GraphQL schema for notebooks

## Running

```
npm i
npm run start:live # auto-reloads server on changes
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
