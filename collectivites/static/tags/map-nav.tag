<map-nav>
  <div id="map-nav"></div>
  <script type="text/javascript">
    this.on('mount', () => {
      RiotControl.trigger('map:init')
    })
  </script>

  <style scoped>
    #map-nav {
      width: 370px;
      height: 400px;
    }
  </style>
</map-nav>
