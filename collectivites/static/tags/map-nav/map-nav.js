function MapNav () {
  riot.observable(this)

  const defaultZoom = 5
  const defaultCenter = [47, 2]
  const tilelayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png')
  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      const territory = Territory.fromGeoJSON(feature)
      riot.route(`/territory/${territory._id}`)
    })
  }
  const layers = L.geoJson(null, {onEachFeature})

  this.on('map.init', () => {
    const map = L.map('map-nav', {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false
    })
    tilelayer.addTo(map)
    layers.addTo(map)

    RiotControl.on('territory.dataready', (territory) => {
      // Find an option not to call all this during zoomTo.
      layers.clearLayers()
      // Display children only if present, otherwise the current zone.
      let data = territory.geojson
      if (territory._children.features) {
        data = territory._children
      }
      layers.addData(data)
    })
    RiotControl.on('territory.zoomto', (territory) => {
      if (territory.geojson.properties.level === 'country') {
        map.setView(defaultCenter, defaultZoom)
      } else {
        map.flyToBounds(L.geoJson(territory.geojson).getBounds())
      }
    })
  })
}
RiotControl.addStore(new MapNav())
