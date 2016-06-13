describe('Territory-list tag', () => {
  it('checks the tag loads with script attributes', () => {
    const script = document.querySelector('#script')
    expect(script.children[0].attributes.src).toBeDefined
  })
  it('checks the tag loads with territory attributes', () => {
    const territory = document.querySelector('#territory')
    expect(territory.dataset.udataTerritory).toBe('fr-town-35238')
  })
  // TODO: find a way to check that datasets are actually loaded.
})
