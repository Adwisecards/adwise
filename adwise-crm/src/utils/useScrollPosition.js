import {useRef, useLayoutEffect} from 'react'
import {getScrollPosition} from './getScrollPosition'

export function useScrollPosition(effect, deps, element, useWindow, wait) {
  const position = useRef(getScrollPosition({useWindow}))

  let throttleTimeout = null

  const callBack = () => {
    const currPos = getScrollPosition({element, useWindow})
    effect({prevPos: position.current, currPos})
    position.current = currPos
    throttleTimeout = null
  }

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait)
        }
      } else {
        callBack()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, deps)
}
