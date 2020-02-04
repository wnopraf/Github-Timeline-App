import UserInfo from './UserInfo'
import TotalReposByDate from './TotalReposByDate'
import RepoData from './RepoData'
import { GithubApi } from '../types'

export default ({
  repoData,
  userName,
  isRepoSearching,
  isRepoPaginateSearching,
  isRepoFilterSearch,
  setIsRepoFilterSearch
}: {
  repoData: GithubApi
  userName: string
  isRepoSearching: boolean
  isRepoPaginateSearching: boolean
  isRepoFilterSearch: boolean
  setIsRepoFilterSearch: (boolean) => void
}) => {
  if (!repoData.search) {
    return null
  }
  const { search } = repoData
  const { nodes: users } = search
  if (!users.length) {
    return (
      <p className="user-error">
        This user does not exist or yout have typed it incorrectly
      </p>
    )
  }
  const [{ avatarUrl, name }] = users
  const [{ repositories }] = users
  const { totalCount } = repositories

  if (isRepoSearching) {
    return <p>Loading ...</p>
  }

  return (
    <div>
      <UserInfo name={name} avatarUrl={avatarUrl} />
      <TotalReposByDate
        userName={userName}
        totalRepos={totalCount}
        isRepoFilterSearch={isRepoFilterSearch}
        setIsRepoFilterSearch={setIsRepoFilterSearch}
      />
      <RepoData repositories={repositories} />
      {isRepoPaginateSearching && <p>Loading ...</p>}
    </div>
  )
}
