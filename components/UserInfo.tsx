import { ReactElement } from 'react'

export default ({
  name,
  avatarUrl
}: {
  name: string
  avatarUrl: string
}): ReactElement => {
  return (
    <div>
      <figure>
        <img src={avatarUrl} alt="user avatar" />
        <h1>{name}</h1>
      </figure>
    </div>
  )
}
