
      mapboxgl.accessToken = mapboxToken;
      const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10// starting zoom
      });

      const marker1 = new mapboxgl.Marker({color : 'red'})
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(`<h4>${listing.title}</h4><h6>${listing.location}, ${listing.country}</h6><p>exact location provided after booking</p>`))
        .setLngLat(listing.geometry.coordinates) //response.body.features[0].geometry.coordinates
        .addTo(map);
