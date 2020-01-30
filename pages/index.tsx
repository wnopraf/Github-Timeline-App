import { useState, useEffect, useRef } from 'react'
import { GraphQLClient } from 'graphql-request'
import UserInput from '../components/UserInput'
import RepoData from '../components/RepoData'
import getConfig from 'next/config'
import UserInfo from '../components/UserInfo'

interface GithubApi {
  search: Nodes<User>
}
interface Nodes<T> {
  nodes: [T]
}
interface User {
  id: string
  email: string
  avatarUrl: string
  name: string
  repositories: Repositories
}
interface Repository {
  name: string
  createdAt: string
}
interface Repositories {
  nodes: Nodes<Repository>
  pageInfo: PageInfo
  totalCount: number
  edges: Array<{ cursor: string }>
}
interface PageInfo {
  endCursor: string
  hasNextPage: boolean
  hasPreviousPage: boolean
}
export default () => {
  const actualState = useRef<{
    repoData: GithubApi | { search? }
    userName: string
  }>()

  useEffect(() => {
    actualState.current = { repoData, userName }
  })

  function scrollHandler() {
    console.log(actualState, 'repodata from scroll event')
    const {
      repoData: { search }
    }: { repoData: GithubApi | { search? } } = actualState.current

    if (!search) return
    const {
      repoData: {
        search: {
          nodes: [
            {
              repositories: { pageInfo }
            }
          ]
        }
      },
      userName
    } = actualState.current

    scrollPagination(userName, pageInfo, setRepoData)
  }
  const [userName, setUserName] = useState('')
  console.log(getConfig(), 'getconf')

  const [repoData, setRepoData] = useState<GithubApi | { search? }>({})

  const repoSearchOnClick = async click => {
    const data = await requestUserRepoData({ userName })
    console.log(data, 'graph data')
    setRepoData(data)
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  if (!repoData.search)
    return (
      <div>
        <UserInput click={repoSearchOnClick} setUserName={setUserName} />
      </div>
    )
  const {
    search: { nodes }
  } = repoData
  return (
    <div>
      <UserInput click={repoSearchOnClick} setUserName={setUserName} />
      {nodes.length ? (
        <div>
          <UserInfo name={nodes[0].name} avatarUrl={nodes[0].avatarUrl} />
          <RepoData repositories={nodes[0].repositories} />
        </div>
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
  endCursor?: string
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
                    avatarUrl(size: 10)
                  }
                }
              }
        }`

  return await queryFactory.request(query, variables)
}

async function scrollPagination(
  userName,
  pageInfo: { hasNextPage: boolean; endCursor: string },
  setRepoData
) {
  const { hasNextPage, endCursor } = pageInfo
  const scrollLimit = document.scrollingElement.scrollHeight
  console.log('hasNextPage:prev scroll', hasNextPage)

  if (hasNextPage && window.scrollY + window.innerHeight >= scrollLimit) {
    console.log('hasNextPage:after scroll', hasNextPage)
    let newState = await requestUserRepoData({ userName, endCursor })
    console.log(newState, 'new state:scroll')
    setRepoData(prevState => {
      newState.search.nodes[0].repositories.nodes = [
        ...prevState.search.nodes[0].repositories.nodes,
        ...newState.search.nodes[0].repositories.nodes
      ]
      return newState
    })
  }
}
