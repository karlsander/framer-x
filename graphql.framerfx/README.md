# GraphQL Stack

This component wraps the default Stack component and repeats a connect template design component with data fetched from a GraphQL endpoint.

made by [@kall](http://twitter.com/kall), source on [github](https://github.com/karlsander/framer-x)

## How To Use

### 1. Create and connect template component

You need to expose any text fields you want to populate from GraphQL with a code friendly name (like `title`, `subTitle` or `image`).

### 2. Create a GraphQL query

This is best done in GraphiQL or GraphQL Playground.
You need to create a query that has one array type item named `stack` somewhere. You can use GraphQL renaming to achieve this (`stack: allAlbums {`).
Any string or number field of the array items, even nested ones, will be provided to the template component. You can use GraphQL renaming to match the text override names of your component (`title: albumName`) or just adjust your component to match the field names. Paste the query in the GraphQL field in the sidebar. The best way to work is to always edit in GraphiQL and re-paste.

The fields are passed as props to your design component, so you can do clever things if you rename a field to a prop from [the Framer API](https://www.framer.com/api/frame/), like `backgroundColor` or `image`.

Images can be provided by mapping an exposed image directly to a URL.

Example

```graphql
{
  genre(id: 23) {
    stack: allAlbums {
      title
      backgroundColor: sleeveColor
      coverImage {
        image: src
      }
      artist {
        subTitle: name
      }
    }
  }
}
```

### 3. Provide Connection Details

Put the url of your graphql endpoint into the URL field.

If your API needs authorization, you can either put a Bearer token (just the token) or a JSON object of http headers into the `Auth` field.

```json
{
  "Authorization": "Basic 32jnpivajsbdi1hb134jlrhb:ai321npjb"
}
```

## Additional Features

- all options normally available on Stack
- ability to provide Error and Loading components
- ability to force error and loading state
- date formating on all fields that have the word `date` (or `Date`) in their name

## Roadmap

- load query from file

## Changelog

### 1.3

- Date Formating
- New Example API
- Auth Headers

### 1.2

(thanks @steveruizok for the PR)

- adds default query
- adds default tempalte component that shows all props
