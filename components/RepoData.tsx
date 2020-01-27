export default ({
  repositories
}: {
  repositories: [{ name: string; createAt: string }]
}) => {
  return (
    <ul>
      {repositories.map((e, i) => {
        return (
          <li key={e.createAt}>
            <h3>{e.name}</h3>
            <p>
              <span>{e.createAt}</span>
            </p>
          </li>
        )
      })}
    </ul>
  )
}
