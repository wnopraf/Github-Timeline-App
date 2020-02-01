import { ReactElement, useEffect, useState } from 'react'
import { requestUserRepoData } from '../lib/utils'
import { TOTAL_REPO_BY_DATE_QUERY } from '../lib/querys'
import { GithubApi, Repository, Repositories } from '../types'

export default ({
  totalRepos,
  userName,
  repoData
}: {
  totalRepos: number
  userName: string
  repoData: GithubApi
}): ReactElement => {
  const [repoCountByDate, setRepoCountByDate] = useState<
    { year: number; total: number }[]
  >([])
  useEffect(() => {
    ;(async () => {
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
  }, [repoData])

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
