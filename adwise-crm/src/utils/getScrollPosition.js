export function getScrollPosition({element, useWindow}) {
  const target = element ? element.current : document.body
  const position = target.getBoundingClientRect()

  return useWindow ? {x: window.scrollX, y: window.scrollY} : {x: position.left, y: position.top}
}
