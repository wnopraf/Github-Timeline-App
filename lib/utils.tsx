import { GraphQLClient } from 'graphql-request'
import getConfig from 'next/config'

export async function requestUserRepoData(
  variables: {
    userName: string
    endCursor?: string
    totalRepos?: number
  },
  query: string
) {
  const { publicRuntimeConfig } = getConfig()
  const queryFactory = new GraphQLClient('https://api.github.com/graphql', {
    headers: { Authorization: `Bearer ${publicRuntimeConfig.API_KEY}` }
  })

  return await queryFactory.request(query, variables)
}
