// Move riot to a separate URL base, for it not to
// catch all routes (or is that a bug?).
// If we keep riot default base ('#'), riot will
// catch all link clicks and change the URL to nothing
// when the clicked link is not found on its registered
// routes. It seems to change with Riot 3.0.
riot.route.base('#!')

let _currentTag = null

function mount (tag, options) {
  _currentTag && _currentTag.unmount(true)
  riot.compile(() => {
    _currentTag = riot.mount(tag, options)[0]
  })
}

const views = {
  '/': () => mount('territory-list', {id: 'country/fr'}),
  '/territory/*/*/*': (...args) => mount('territory-list', {id: args.join('/')}),
  '/ban/upload': () => mount('ban-upload')
}
for (let name in views) {
  riot.route(name, views[name])
}

