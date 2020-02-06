export const USER_REPO_QUERY = `query SearchUser($endCursor: String = null, $userName: String!){
    search(query: $userName, type: USER, first:1) {

        nodes {
          ... on User {
            id
            email
            repositories(first: 10, after:$endCursor, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                name
                createdAt
              }
              edges {
                cursor
              }
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
              }
              totalCount
            }
            name
            avatarUrl
          }
        }
      }
}`

export const TOTAL_REPO_BY_DATE_QUERY = `query SearchUser($totalRepos: Int!, $userName: String!, $endCursor: String = null){
    search(query: $userName, type: USER, first:1) {

        nodes {
          ... on User {
            repositories(first: $totalRepos, orderBy: {field: CREATED_AT, direction: DESC}, after:$endCursor) {
              nodes {
                name
                createdAt
              } 
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
              }         
              totalCount
            }
            
          }
        }
      }
}`
