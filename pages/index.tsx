import { useState } from 'react'
import { GraphQLClient } from 'graphql-request'
import UserInput from '../components/UserInput'
import RepoData from '../components/RepoData'
import getConfig from 'next/config'

export default () => {
  const [userName, setUserName] = useState('')
  console.log(getConfig(), 'getconf')

  const [repoData, setRepoData] = useState<{
    search?: {
      nodes?: [
        { repositories: { nodes: [{ name: string; createdAt: string }] } }
      ]
    }
  }>({})

  if (!repoData.search)
    return (
      <div>
        <UserInput
          requestUserRepoData={requestUserRepoData}
          setUserName={setUserName}
          userName={userName}
          setRepoData={setRepoData}
        />
      </div>
    )
  const {
    search: { nodes }
  } = repoData
  return (
    <div>
      <UserInput
        requestUserRepoData={requestUserRepoData}
        setUserName={setUserName}
        userName={userName}
        setRepoData={setRepoData}
      />
      {nodes.length ? (
        <RepoData repositories={nodes[0].repositories} />
      ) : (
        <p className="user-error">
          This user does not exist or yout have typed it incorrectly
        </p>
      )}
    </div>
  )
}
async function requestUserRepoData(variables: {
  userName: string
  endCursor: string
}) {
  const { publicRuntimeConfig } = getConfig()

  const queryFactory = new GraphQLClient('https://api.github.com/graphql', {
    headers: { Authorization: `Bearer ${publicRuntimeConfig.API_KEY}` }
  })
  const query = `query SearchUser($endCursor: String = null, $userName: String!){
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
