describe('Map-nav tag', () => {
  it('checks the tag loads with leaflet', () => {
    const tag = document.querySelector('#map-nav')
    expect(tag.textContent).toBe('Leaflet')
    expect(tag.classList[0]).toBe('leaflet-container')
  })
  it('checks the 27 regions are loaded', () => {
    RiotControl.on('territory.dataready', (geojson) =>
      expect(geojson.features.length).toBe(27))
  })
})
