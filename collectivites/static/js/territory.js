let territories = {}
let children = {}
let currentTerritory = null;
function Territory () {
    riot.observable(this)

    this.on('init', (id) => {
        currentTerritory = id
        if (!territories[id]) {
            fetch(`${API_URLS.UDATA}api/1/spatial/zone/${id}`)
                .then((response) => {
                    return response.json()
                }).then((feature) => {
                    territories[feature.id] = feature
                    this.trigger('zoomto', feature)
                }).catch(console.error.bind(console))
        } else {
            this.trigger('zoomto', territories[id])
        }
    })

    this.on('load', (geojson) => {
        riot.mount('territory', {geojson: geojson})
    })

    this.on('zoomto', (feature) => {
        let ready = false
        let geojson = null
        function finish () {
            // Make sure we only run finish when both ajax and zoom are done.
            if (!ready) {
                ready = true
                return
            }
            if (currentTerritory !== feature.id) return  // Another territory has been loaded since then.
            group.clearLayers()
            group.addData(geojson)
        }
        if (!children[feature.id]) {
            fetch(`${API_URLS.UDATA}api/1/spatial/zone/${feature.id}/children`)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    geojson = json
                    children[feature.id] = json
                    finish()
                }).catch(() => {
                    // No children, then 404, so only display the feature itself.
                    geojson = feature
                    finish()
                })
        } else {
            geojson = children[feature.id]
            finish()
        }
        map.once('moveend', () => {
            finish()
        })
        if (feature.properties.level === 'country') map.setView(defaultCenter, 5)
        else map.flyToBounds(L.geoJson(feature).getBounds())
    })

}
