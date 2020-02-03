import { useState, useEffect, useRef } from 'react'
import UserInput from '../components/UserInput'
import { requestUserRepoData } from '../lib/utils'
import { GithubApi } from '../types'
import { USER_REPO_QUERY } from '../lib/querys'
import RepoDataRenderer from '../components/RepoDataRenderer'

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

    scrollPagination(
      userName,
      pageInfo,
      setRepoData,
      setIsRepoPaginateSearching
    )
  }
  const [userName, setUserName] = useState('')
  const [isRepoSearching, setIsRepoSearching] = useState<boolean>(false)
  const [isRepoPaginateSearching, setIsRepoPaginateSearching] = useState<
    boolean
  >(false)
  const [repoData, setRepoData] = useState<GithubApi>({})
  const [isRepoFilterSearch, setIsRepoFilterSearch] = useState<boolean>(false)

  const repoSearchOnClick = async click => {
    setIsRepoSearching(true)
    const data = await requestUserRepoData({ userName }, USER_REPO_QUERY)
    setIsRepoSearching(false)
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
      <RepoDataRenderer
        repoData={repoData}
        userName={userName}
        isRepoSearching={isRepoSearching}
        isRepoPaginateSearching={isRepoPaginateSearching}
        isRepoFilterSearch={isRepoFilterSearch}
        setIsRepoFilterSearch={setIsRepoFilterSearch}
      />
    </div>
  )
}

async function scrollPagination(
  userName,
  pageInfo: { hasNextPage: boolean; endCursor: string },
  setRepoData,
  setIsRepoPaginateSearching
) {
  const { hasNextPage, endCursor } = pageInfo
  const scrollLimit = document.scrollingElement.scrollHeight
  console.log('hasNextPage:prev scroll', hasNextPage)

  if (hasNextPage && window.scrollY + window.innerHeight >= scrollLimit) {
    setIsRepoPaginateSearching(true)
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
    setIsRepoPaginateSearching(false)
  }
}
