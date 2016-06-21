const RiotControl = {
  _stores: [],
  addStore: function (store) {
    this._stores.push(store)
  }
}
;['on', 'one', 'off', 'trigger'].forEach((api) => {
  RiotControl[api] = (...args) =>
    RiotControl._stores.forEach((el) =>
      el[api](...args)
    )
})
