import { ReactElement } from 'react'

export default ({
  setUserName,
  click
}: {
  setUserName: (String) => void
  click: () => void
}): ReactElement => {
  return (
    <div className="input-box flex justify-center py-3 mb-3">
      <input
        className=" border  border-gray-400 w-1/3 pl-4 h-12 focus:outline-none focus:shadow "
        type="text"
        onChange={e => setUserName(e.target.value)}
        onKeyUp={async e => {
          switch (e.key) {
            case 'Enter':
              await click()

              return
          }
        }}
      />
      <button
        onClick={async e => {
          await click()
        }}
        className="px-2 py-1 ml-3 rounded bg-blue-500 text-white   focus:outline-none"
      >
        Generate
      </button>
    </div>
  )
}
