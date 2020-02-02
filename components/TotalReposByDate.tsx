import { ReactElement, useEffect, useState } from 'react'
import { requestUserRepoData } from '../lib/utils'
import { TOTAL_REPO_BY_DATE_QUERY } from '../lib/querys'
import { GithubApi, Repository, Repositories } from '../types'

export default ({
  totalRepos,
  userName,
  isSearch
}: {
  totalRepos: number
  userName: string
  isSearch: string
}): ReactElement => {
  const [repoCountByDate, setRepoCountByDate] = useState<
    { year: number; total: number }[]
  >([])
  useEffect(() => {
    console.log(isSearch, 'useEffect-total')
    ;(async () => {
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
          console.log(repositories, 'from generator')

          let {
            pageInfo: { hasNextPage: theNextPage, endCursor: newCursor }
          } = repoExcedent
          endCursor = newCursor
          hasNextPage = theNextPage
        }
        console.log('paginated nrepos per year', repoCountPerYear(repositories))
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

      console.log('repos per year', repoCountPerYear(repositories))

      setRepoCountByDate(repoCountPerYear(repositories))
    })()
  }, [isSearch])

  return (
    <div className="repo-stats">
      <h3>repo count by year</h3>
      {repoCountByDate.length &&
        repoCountByDate.map(e => {
          return (
            <div className="repo-stats" key={e.year}>
              <span>{e.year}</span>{' '}
              <span>
                {e.total} {e.total > 1 ? 'repos' : 'repo'}
              </span>
            </div>
          )
        })}
      {!repoCountByDate.length && 'Loading ...'}
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
