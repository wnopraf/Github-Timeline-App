import { ReactElement, useRef } from 'react'

export default ({
  setUserName,
  click
}: {
  setUserName: (String) => void
  click: () => void
}): ReactElement => {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div className="input-box">
      <input
        ref={input}
        type="text"
        onChange={e => setUserName(e.target.value)}
      />
      <button
        onClick={e => {
          input.current.value = ''
          click()
        }}
      >
        enviar
      </button>
    </div>
  )
}
