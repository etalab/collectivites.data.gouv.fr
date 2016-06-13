function MapNav () {
  riot.observable(this)

  const defaultZoom = 5
  const defaultCenter = [47, 2]
  const tilelayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png')
  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      RiotControl.trigger('territory:set', feature)
      riot.route(`/territory/${feature.id}`)
    })
  }
  const layers = L.geoJson(null, {onEachFeature})

  this.on('map:init', (udataApiUrl) => {
    RiotControl.trigger('territory:setBaseUrl', udataApiUrl)

    const map = L.map('map-nav', {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false
    })
    tilelayer.addTo(map)
    layers.addTo(map)

    RiotControl.on('territory:dataready', (geojson) => {
      function finish () {
        layers.clearLayers()
        layers.addData(geojson)
      }
      if (map._animatingZoom) map.once('zoomend', finish)
      else finish()
    })
    RiotControl.on('territory:zoomto', (geojson) => {
      if (geojson.properties.level === 'country') {
        map.setView(defaultCenter, defaultZoom)
      } else {
        map.flyToBounds(L.geoJson(geojson).getBounds())
      }
    })
  })
}
RiotControl.addStore(new MapNav())
