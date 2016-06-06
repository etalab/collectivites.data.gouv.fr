const defaultCenter = [47, 2]
function MapNav () {
  riot.observable(this)
  const tilelayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png')
  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      territories[feature.id] = feature
      riot.route(`/territoire/${feature.id}`)
    })
  }
  const layers = L.geoJson(null, {
    onEachFeature: onEachFeature
  })

  this.on('map:init', () => {
    const map = L.map('map-nav', {center: defaultCenter, zoom: 5, zoomControl: false})
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
      if (geojson.properties.level === 'country') map.setView(defaultCenter, 5)
        else map.flyToBounds(L.geoJson(geojson).getBounds())
      })

  })

}
