import { useState } from 'react'
import dotenv from 'dotenv'
import { GraphQLClient } from 'graphql-request'
import UserInput from '../components/UserInput'

dotenv.config()

export default () => {
  const [userName, setUserName] = useState('')
  const [invalidUser] = useState(false)
  const [repoData] = useState({})
  return (
    <div>
      <UserInput requestUser={requestUser} setUserName={setUserName} />
      {invalidUser && (
        <p className="user-error">
          This user does not exist or yout have typed it incorrectly
        </p>
      )}
    </div>
  )
}
async function requestUser(variables: { userName: string; endCursor: string }) {
  const queryFactory = new GraphQLClient('https://api.github.com/graphql', {
    headers: { Authorization: `bearer ${process.env.GITHUB_APY_KEY}` }
  })
  const query = `query SearchUser($endCursor: String, $userName){
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
                  }
                }
              }
        }`

  return await queryFactory.request(query, variables)
}
