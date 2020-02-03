import { useState, useEffect, useRef } from 'react'
import UserInput from '../components/UserInput'
import RepoData from '../components/RepoData'
import { requestUserRepoData } from '../lib/utils'
import UserInfo from '../components/UserInfo'
import { GithubApi } from '../types'
import { USER_REPO_QUERY } from '../lib/querys'
import TotalReposByDate from '../components/TotalReposByDate'

export default () => {
  const actualState = useRef<{
    repoData: GithubApi
    userName: string
  }>()

  useEffect(() => {
    actualState.current = { repoData, userName }
  })

  function scrollHandler() {
    console.log(actualState, 'repodata from scroll event')
    const {
      repoData: { search }
    }: { repoData: GithubApi } = actualState.current

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

  const [repoData, setRepoData] = useState<GithubApi>({})
  const [isRepoFilterSearch, setIsRepoFilterSearch] = useState<boolean>(false)

  const repoSearchOnClick = async click => {
    const data = await requestUserRepoData({ userName }, USER_REPO_QUERY)
    console.log(data, 'graph data')
    setRepoData(data)
    setIsRepoFilterSearch(true)
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  return (
    <div>
      <UserInput click={repoSearchOnClick} setUserName={setUserName} />
      {repoData.search ? (
        repoData.search.nodes.length ? (
          <div>
            <UserInfo
              name={repoData.search.nodes[0].name}
              avatarUrl={repoData.search.nodes[0].avatarUrl}
            />
            <TotalReposByDate
              userName={userName}
              totalRepos={repoData.search.nodes[0].repositories.totalCount}
              isRepoFilterSearch={isRepoFilterSearch}
              setIsRepoFilterSearch={setIsRepoFilterSearch}
            />
            <RepoData repositories={repoData.search.nodes[0].repositories} />
          </div>
        ) : (
          <p className="user-error">
            This user does not exist or yout have typed it incorrectly
          </p>
        )
      ) : (
        ''
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
