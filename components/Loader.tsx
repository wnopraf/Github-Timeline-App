import { useTrail, animated } from 'react-spring'
import { useState } from 'react'

export default () => {
  const [animState, setReset] = useState(false)
  const trail = useTrail(3, {
    from: { background: 'white' },
    background: '#3182ce',
    reset: true,
    onRest: () => setReset(!animState)
  })

  return (
    <div className="loader flex justify-center items-center py-6">
      {trail.map(props => {
        return (
          <animated.span
            style={props}
            className="rounded-full w-4 h-4 border mr-2"
          />
        )
      })}
    </div>
  )
}
