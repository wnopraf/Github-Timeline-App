export interface GithubApi {
  search?: Nodes<User>
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
export interface Repository {
  name: string
  createdAt: string
}
export interface Repositories {
  nodes: [Repository]
  pageInfo: PageInfo
  totalCount: number
  edges: Array<{ cursor: string }>
}
interface PageInfo {
  endCursor: string
  hasNextPage: boolean
  hasPreviousPage: boolean
}
