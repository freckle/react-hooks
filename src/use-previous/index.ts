import * as React from 'react'

export const usePrevious = <T>(value: T): T | undefined | null => {
  const ref = React.useRef()

  React.useEffect(() => {
    ref.current = value
  })

  return ref.current
}
