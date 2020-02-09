import { Repositories } from '../types'

export default ({ repositories }: { repositories: Repositories }) => {
  return (
    <ul className="mt-6 px-2 py-1">
      {repositories.nodes.map((e, i) => {
        const formattedDate = new Date(e.createdAt).toLocaleDateString()
        return (
          <li
            key={i}
            className="repo-item relative px-3 py-3   border-l-4 border-blue-600"
          >
            <div className="pl-4 py-2 bg-blue-600 text-gray-100">
              <h4>{e.name}</h4>
              <p>
                <span>{formattedDate}</span>
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
