let territories = {}
function Territory () {
    riot.observable(this)

    this.on('init', (id) => {
        function init (feature) {
            territory.trigger('load', feature)
            territory.trigger('zoomto', feature)
        }
        if (!territories[id]) {
        fetch(`http://192.168.1.24:7000/api/1/spatial/zone/${id}`)
            .then((response) => {
                return response.json()
            }).then((feature) => {
                territories[feature.id] = feature
                init(feature)
            }).catch(console.error.bind(console))
        } else {
            init(territories[id])
        }
    })

    this.on('load', (geojson) => {
        Z.qs('main').innerHTML = ''
        const container = Z.el('div', {}, Z.qs('main'));
        container.dataset.udataTerritory = geojson.id.replace(/\//g, '-')
        const script = Z.el('script', {id: 'udata', src: 'http://192.168.1.24:7000/static/widgets.js'}, Z.qs('main'))
        Z.qs('main').style.display = 'block'
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
            group.clearLayers()
            group.addData(geojson)
        }
        fetch(`http://192.168.1.24:7000/api/1/spatial/zone/${feature.id}/children`)
            .then((response) => {
                return response.json()
            }).then((json) => {
                geojson = json
                finish()
            }).catch(() => {
                // No children, then 404, so only display the feature itself.
                geojson = feature
                finish()
            })
        map.on('zoomend', () => {
            finish()
        })
        map.flyToBounds(L.geoJson(feature).getBounds())
    })

}
