<side-nav>

<section><a href="#"><h1>Territoires</h1></a></section>
<h3>Chercher un territoire</h3>
<div><input type="search" placeholder="Trouver ma commune" id="search-territory" /></div>
<hr />
<div><a class="button" href="#" id="geolocate">Me localiser</a></div>
<hr />
<map-nav></map-nav>
<section class="menu">
  <ul if={ opts.fullname }>
    <li>{ opts.fullname } (<a href="{ logout_url }">Se déconnecter</a>)</li>
    <li><a href="#ban/batch">Téléverser des adresses</a></li>
    <li><a href="#ban/groups">Consulter les adresses d'une commune</a></li>
  </ul>
  <ul if={ !opts.fullname }>
    <li><a href="{ login_url }">S'identifier</a></li>
  </ul>
</section>

<script>

  this.on('mount', () => {
    riot.mount('map-nav')
    new L.PhotonBaseSearch(L.DomUtil.get('search-territory'), {
      url: `${API_URLS.GEOZONES}?`,
      placeholder: 'Chercher une commune, un département, une région',
      onSelected: (feature) => {
        riot.route(`/territoire/${feature.id}`)
      }
    })

    L.DomEvent.on(Z.qs('#geolocate'), 'click', (e) => {
      L.DomEvent.stop(e)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(`${API_URLS.GEOAPI}communes?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
          .then((response) => {
            return response.json()
          }).then((json) => {
            const codeInsee = json[0].codeInsee
            const id = `fr/town/${codeInsee}`
            riot.route(`/territoire/${id}`)
          }).catch(console.error.bind(console))
        },
        (error) => {
          console.log(error)
        }
        )
    })
  })

</script>

<style scoped>
  :scope {
    background-image: url('/static/img/logo.jpg');
    background-repeat: no-repeat;
    background-position: top 10px center;
    padding: 20px;
    padding-top: 80px;
    background-color: #fefefe;
    border-right: 1px solid #ddd;
    color: #333;
    width: 400px;
  }
  :scope a {
    color: #333;
    text-decoration: none;
    font-family: 'open_sansbold';
    font-weight: normal;
  }
  :scope section {
    align-self: center;
    display: -webkit-flex;
    display: flex;
  }
  :scope a h1 {
    font-size: 40px;
    font-family: 'open_sanslight';
    font-weight: normal;
    height: 50px;
    margin-bottom: 30px;
  }
  :scope .menu a:hover {
    text-decoration: underline;
  }
</style>

</side-nav>