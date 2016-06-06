let territories = {}
let children = {}
let currentTerritory = null;
function Territory () {
    riot.observable(this)

    this.on('territory:init', (id) => {
        currentTerritory = id
        if (!territories[id]) {
            fetch(`${API_URLS.UDATA}api/1/spatial/zone/${id}`)
                .then((response) => {
                    return response.json()
                }).then((feature) => {
                    territories[feature.id] = feature
                    this.trigger('territory:zoomto', feature)
                }).catch(console.error.bind(console))
        } else {
            this.trigger('territory:zoomto', territories[id])
        }
    })

    this.on('territory:load', (geojson) => {
        riot.mount('territory', {geojson: geojson})
    })

    this.on('territory:zoomto', (feature) => {
        function finish (geojson) {
            if (currentTerritory !== feature.id) return  // Another territory has been loaded since then.
            if (!geojson || !geojson.features.length) geojson = feature  // We received an empty geojson?
            RiotControl.trigger('territory:dataready', geojson)
        }
        if (!children[feature.id] && feature.properties.level !== 'fr/town') {
            fetch(`${API_URLS.UDATA}api/1/spatial/zone/${feature.id}/children`)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    children[feature.id] = json
                    finish(json)
                }).catch(() => {
                    // No children, then 404, so only display the feature itself.
                    finish()
                })
        } else {
            finish(children[feature.id])
        }
    })

}
