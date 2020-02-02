import { Repositories } from '../types'

export default ({ repositories }: { repositories: Repositories }) => {
  return (
    <ul>
      {repositories.nodes.map((e, i) => {
        const formattedDate = new Date(e.createdAt).toLocaleDateString()
        return (
          <li key={i}>
            <h3>{e.name}</h3>
            <p>
              <span>{formattedDate}</span>
            </p>
          </li>
        )
      })}
    </ul>
  )
}
