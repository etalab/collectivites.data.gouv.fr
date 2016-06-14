function TerritoryList () {
  riot.observable(this)

  this._territories = {}
  this._baseUrl = ''

  this.on('territory.init', (baseUrl) => {
    this._baseUrl = baseUrl
  })

  this.on('territory.zoomto', (territory) => {
    territory.fetchChildren()
    territory.fetchParent()
  })
}

const territoryList = new TerritoryList()
RiotControl.addStore(territoryList)

class Territory {
  constructor (id) {
    this._id = id
    this._children = {}
  }

  static fromGeoJSON (geojson) {
    const territory = new Territory(geojson.id)
    territory.geojson = geojson
    territoryList._territories[territory._id] = territory
    return territory
  }

  static getOrCreate (id) {
    let territory = null
    if (territoryList._territories[id]) {
      territory = territoryList._territories[id]
    } else {
      territory = new Territory(id)
    }
    return territory.fetch()
  }

  fetch () {
    if (territoryList._territories[this._id]) {
      return Promise.resolve(territoryList._territories[this._id])
    }
    return fetch(`${territoryList._baseUrl}api/1/spatial/zone/${this._id}`)
      .then((response) => response.json())
      .then((geojson) => {
        this.geojson = geojson
        territoryList._territories[this._id] = this
        return this
      })
      .catch(console.error.bind(console))
  }

  fetchChildren () {
    if (this._children.features || this.geojson.properties.level === 'fr/town') {
      RiotControl.trigger('territory.dataready', this)
      return
    }
    fetch(`${territoryList._baseUrl}api/1/spatial/zone/${this._id}/children`)
      .then((response) => response.json())
      .then((json) => {
        this._children = json
        RiotControl.trigger('territory.dataready', this)
      })
      // No children, then 404, so only display the feature itself.
      .catch(() => RiotControl.trigger('territory.dataready', this))
  }

  fetchParent () {
    // Look for the parent given the currently handled levels in udata.
    const parents = this.geojson.properties.parents
    let parentId = parents.filter((parent) => parent.search('county') >= 0)
    parentId = parentId.length ? parentId : parents.filter((parent) => parent.search('region') >= 0)
    parentId = parentId.length ? parentId : 'country/fr'
    Territory.getOrCreate(parentId).then((parent) => {
      this.parent = parent
      RiotControl.trigger('territory.updated', this)
    })
  }

  display () {
    RiotControl.trigger('territory.zoomto', this)
  }
}
