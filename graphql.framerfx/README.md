# GraphQL Stack

This component wraps the default Stack component and repeats a connect template design component with data fetched from a GraphQL endpoint.

made by [@kall](http://twitter.com/kall), source on [github](https://github.com/karlsander/framer-x)

# How To Use

## 1. Create and connect template component

You need to expose any text fields you want to populate from GraphQL with a code friendly name (like `title`, `subTitle`).

## 2. Create a GraphQL query

This is best done in GraphiQL or GraphQL Playground.
You need to create a query that has one array type item named 'stack' somewhere. You can use GraphQL renaming to achieve this ('stack: allAlbums {').
Any string or number field of the array items, even nested ones, will be provided to the template component. Again use GraphQL renaming to match the text override names of your component ('title: albumName'). Paste the query in the GraphQL field in the sidebar. The best way to work is to always edit in GraphiQL and re-paste.

Example

```graphql
{
  genre(id: 23) {
    stack: allAlbums {
      title
      artist {
         subTitle: name
      } 
    }
  }
}
```

## 3. Provide the URL of your GraphQL endpoint in the URL field

# Additional Features:

- all options normally available on Stack
- ability to provide Error and Loading components
- ability to force error and loading state

# Roadmap:

- authorization headers
- load query from file
- image support
- date formatting support