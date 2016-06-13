describe('Side-nav tag', () => {
  it('checks the tag loads with map-nav', () => {
    const mapNav = document.querySelector('#map-nav')
    expect(mapNav.textContent).toBe('Leaflet')
  })
  it('checks the geolocate button is present', () => {
    const geolocate = document.querySelector('#geolocate')
    expect(geolocate).toBeDefined
  })
  it('checks the login button is present by default', () => {
    const settingsMenu = document.querySelector('.menu ul')
    expect(settingsMenu.children.length).toBe(1)
  })
})
