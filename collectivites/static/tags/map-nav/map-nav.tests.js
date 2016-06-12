describe('Map-nav tag', () => {
  it('checks the tag loads with leaflet', () => {
    const tag = document.querySelector('#map-nav')
    expect(tag.textContent).to.be('Leaflet')
    expect(tag.classList[0]).to.be('leaflet-container')
  })
})
