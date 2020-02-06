import { Repositories } from '../types'

export default ({ repositories }: { repositories: Repositories }) => {
  return (
    <ul className="mt-6 px-2 py-1">
      {repositories.nodes.map((e, i) => {
        const formattedDate = new Date(e.createdAt).toLocaleDateString()
        return (
          <li key={i} className="px-3 mt-3 bg-gray-300">
            <h4>{e.name}</h4>
            <p>
              <span>{formattedDate}</span>
            </p>
          </li>
        )
      })}
    </ul>
  )
}
