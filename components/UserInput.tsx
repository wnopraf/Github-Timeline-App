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
    <div className="input-box flex justify-center py-3 mb-3">
      <input
        className=" border  border-gray-400 w-1/3 "
        ref={input}
        type="text"
        onChange={e => setUserName(e.target.value)}
        onKeyUp={e => {
          switch (e.key) {
            case 'Enter':
              ;(e.target as HTMLInputElement).value = ''
              click()
              return
          }
        }}
      />
      <button
        onClick={e => {
          input.current.value = ''
          click()
        }}
        className="px-2 py-1 ml-2 rounded-lg bg-blue-500 text-white"
      >
        Generate
      </button>
    </div>
  )
}
