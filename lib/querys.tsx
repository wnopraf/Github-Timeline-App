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
            avatarUrl(size: 10)
          }
        }
      }
}`

export const TOTAL_REPO_BY_DATE_QUERY = `query SearchUser($totalRepos: Int!, $userName: String!){
    search(query: $userName, type: USER, first:1) {

        nodes {
          ... on User {
            repositories(first: $totalRepos, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                name
                createdAt
              }          
              totalCount
            }
            
          }
        }
      }
}`
