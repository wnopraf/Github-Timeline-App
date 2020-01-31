import { useState, useEffect, useRef } from 'react'
import { GraphQLClient } from 'graphql-request'
import UserInput from '../components/UserInput'
import RepoData from '../components/RepoData'
import { requestUserRepoData } from '../lib/utils'
import UserInfo from '../components/UserInfo'
import { GithubApi } from '../types'
import { USER_REPO_QUERY } from '../lib/querys'

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

  const [repoData, setRepoData] = useState<GithubApi | { search? }>({})

  const repoSearchOnClick = async click => {
    const data = await requestUserRepoData({ userName }, USER_REPO_QUERY)
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
    let newState = await requestUserRepoData(
      { userName, endCursor },
      USER_REPO_QUERY
    )
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
