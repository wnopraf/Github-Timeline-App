import { ReactElement, useState } from 'react'
import { requestUserRepoData } from '../lib/utils'
import { TOTAL_REPO_BY_DATE_QUERY } from '../lib/querys'
import { GithubApi, Repository, Repositories } from '../types'
import Loader from './Loader'

export default ({
  totalRepos,
  userName,
  isRepoFilterSearch,
  setIsRepoFilterSearch
}: {
  totalRepos: number
  userName: string
  isRepoFilterSearch: boolean
  setIsRepoFilterSearch: (arg: boolean) => void
}): ReactElement => {
  const [repoCountByDate, setRepoCountByDate] = useState<
    { year: number; total: number }[]
  >([])
  const filterUserRepoByYear = async () => {
    if (totalRepos > 100) {
      totalRepos = 100
      let {
        search: {
          nodes: [{ repositories }]
        }
      }: GithubApi = await requestUserRepoData(
        { userName, totalRepos },
        TOTAL_REPO_BY_DATE_QUERY
      )
      let {
        pageInfo: { hasNextPage, endCursor }
      } = repositories
      while (hasNextPage) {
        const {
          search: {
            nodes: [{ repositories: repoExcedent }]
          }
        }: GithubApi = await requestUserRepoData(
          { userName, totalRepos, endCursor },
          TOTAL_REPO_BY_DATE_QUERY
        )
        repositories.nodes = repositories.nodes.concat(
          repoExcedent.nodes
        ) as Repository[]

        let {
          pageInfo: { hasNextPage: theNextPage, endCursor: newCursor }
        } = repoExcedent
        endCursor = newCursor
        hasNextPage = theNextPage
      }

      return setRepoCountByDate(repoCountPerYear(repositories))
    }
    const {
      search: {
        nodes: [{ repositories }]
      }
    }: GithubApi = await requestUserRepoData(
      { userName, totalRepos },
      TOTAL_REPO_BY_DATE_QUERY
    )

    setRepoCountByDate(repoCountPerYear(repositories))
  }
  if (isRepoFilterSearch) {
    ;(async () => {
      await filterUserRepoByYear()
      setIsRepoFilterSearch(!isRepoFilterSearch)
    })()
  }
  return (
    <div className="repo-stats">
      <h3 className="text-center capitalize mb-2">repo count by year</h3>
      <div className="stat-wrapper flex justify-center items-center flex-wrap">
        {!isRepoFilterSearch &&
          repoCountByDate.map(e => {
            return (
              <div
                className="repo-stats mr-2 mt-2 px-2 py-1 bg-yellow-500"
                key={e.year}
              >
                <span>{e.year}</span>{' '}
                <span>
                  {e.total} {e.total > 1 ? 'repos' : 'repo'}
                </span>
              </div>
            )
          })}
      </div>

      {isRepoFilterSearch && <Loader />}
    </div>
  )
}

function repoCountPerYear(repositories: Repositories) {
  const extractYear: (date: string) => number = date =>
    new Date(date).getFullYear()
  let repoDate: number = 0
  const filteredyears: { year: number; total: number }[] = []

  repositories.nodes.forEach((e: Repository, i, repo) => {
    if (repoDate !== extractYear(e.createdAt)) {
      repoDate = extractYear(e.createdAt)
      const yearFilter = repo.filter(e => repoDate === extractYear(e.createdAt))
      filteredyears.push({ year: repoDate, total: yearFilter.length })
    }
  })
  return filteredyears
}
