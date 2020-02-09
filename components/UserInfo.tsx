import { ReactElement } from 'react'

export default ({
  name,
  avatarUrl
}: {
  name: string
  avatarUrl: string
}): ReactElement => {
  return (
    <div className="py-3 text-center">
      <figure className=" w-32 inline-block">
        <img className="max-w-full h-auto" src={avatarUrl} alt="user avatar" />
      </figure>
      <h1>{name}</h1>
    </div>
  )
}
