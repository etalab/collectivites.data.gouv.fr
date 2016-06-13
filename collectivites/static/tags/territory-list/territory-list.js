function Territory () {
  riot.observable(this)

  let _children = {}
  let _territories = {}
  let _currentTerritory = null
  let _baseUrl = null

  this.on('territory:setBaseUrl', (baseUrl) => {
    _baseUrl = baseUrl
  })

  this.on('territory:init', (id) => {
    _currentTerritory = id
    if (_territories[id]) {
      this.trigger('territory:zoomto', _territories[id])
      return
    }
    fetch(`${_baseUrl}api/1/spatial/zone/${id}`)
      .then((response) => response.json())
      .then((feature) => {
        _territories[feature.id] = feature
        this.trigger('territory:zoomto', feature)
      })
      .catch(console.error.bind(console))
  })

  this.on('territory:set', (territory) => {
    _territories[territory.id] = territory
  })

  this.on('territory:load', (geojson) => {
    riot.mount('territory', {geojson: geojson})
  })

  this.on('territory:zoomto', (feature) => {
    function finish (geojson) {
      if (_currentTerritory !== feature.id) return // Another territory has been loaded since then.
      if (!geojson || !geojson.features.length) geojson = feature // We received an empty geojson?
      RiotControl.trigger('territory:dataready', geojson)
    }
    if (_children[feature.id] || feature.properties.level === 'fr/town') {
      finish(_children[feature.id])
      return
    }
    fetch(`${_baseUrl}api/1/spatial/zone/${feature.id}/children`)
      .then((response) => response.json())
      .then((json) => {
        _children[feature.id] = json
        finish(json)
      })
      // No children, then 404, so only display the feature itself.
      .catch(finish)
  })
}
RiotControl.addStore(new Territory())
