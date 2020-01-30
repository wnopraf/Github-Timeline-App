export interface GithubApi {
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
