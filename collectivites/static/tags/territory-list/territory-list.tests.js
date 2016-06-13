describe('Territory-list tag', () => {
  it('checks the tag loads with script attributes', () => {
    const script = document.querySelector('#script')
    expect(script.children[0].attributes.src).toBeDefined
  })
})
