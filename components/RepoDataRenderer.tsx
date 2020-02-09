import UserInfo from './UserInfo'
import TotalReposByDate from './TotalReposByDate'
import RepoData from './RepoData'
import { GithubApi } from '../types'
import Loader from './Loader'

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
  if (!users.length || !users[0].id) {
    return (
      <p className="user-error text-2xl text-center">
        This user does not exist or you have typed it incorrectly
      </p>
    )
  }
  const [{ avatarUrl, name }] = users
  const [{ repositories }] = users
  const { totalCount } = repositories

  if (isRepoSearching) {
    return <Loader />
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
      {isRepoPaginateSearching && <Loader />}
    </div>
  )
}
