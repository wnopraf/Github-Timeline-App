import { ReactElement, useEffect, useState } from 'react'
import { requestUserRepoData } from '../lib/utils'
import { TOTAL_REPO_BY_DATE_QUERY } from '../lib/querys'
import { GithubApi, Repository, Repositories } from '../types'

export default ({
  totalRepos,
  userName
}: {
  totalRepos: number
  userName: string
}): ReactElement => {
  const [repoCountByDate, setRepoCountByDate] = useState<
    { year: number; total: number }[]
  >([])
  useEffect(
    (async () => {
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
    }) as any,
    []
  )
  return (
    <div className="repo-stats">
      {repoCountByDate.length &&
        repoCountByDate.map(e => {
          return (
            <div className="repo-stats">
              <span>{e.year}</span>
              <span>{e.total}</span>
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
