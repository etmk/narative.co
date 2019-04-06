module.exports = () => ({
  routerProps: { location },
  prevRouterProps,
  getSavedScrollPosition,
}) => {
  const currentPosition = getSavedScrollPosition(location)

  if (location.action === 'POP') {
    window.scrollTo(...(currentPosition || [0, 0]))
  } else {
    window.scrollTo(0, 0)
  }

  // Set previousPath for "back" functionality
  if (prevRouterProps) {
    window.localStorage.setItem(
      'previousPath',
      prevRouterProps.location.pathname
    )
  }
  return false
}
