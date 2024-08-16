import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector } from "react-redux";

const LeafletMap = () => {
  const mapRef = useRef(null);
  const result = useSelector((state) => state.result);
  const zipcodes = useSelector((state) => state.zipcodes);


  useEffect(()=>{
    console.log(zipcodes)
    console.log(result)
  },[zipcodes,result])

  useEffect(() => {
    // Initialize the map
    const map = L.map(mapRef.current).setView([39.103037, -94.60066], 13);

    // Add a simplified map tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Coordinates
    const coordinates = result?.coordinates;

    // Drawing paths based on the input sequences
    const paths = result?.routes;

    // Color array for paths
    const colors = [
      '#FF5733', '#FF33B5', '#33FF57', '#FF7733', '#FF3333',
      '#FF3399', '#33A1FF', '#33FF99', '#33FFBD', '#3378FF',
      '#9933FF', '#8DFF33', '#FF8A33', '#33FF77', '#33FFAA',
      '#FF338F', '#FF5733', '#FFC133', '#8A33FF', '#338FFF'
    ];

    // Define a custom icon for the warehouse (red color)
    const warehouseIcon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    const destinationIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add the warehouse marker
    L.marker(coordinates[0], { icon: warehouseIcon })
      .addTo(map)
      .bindTooltip('Warehouse', { permanent: true, direction: 'right' });

    // Add other markers with permanent tooltips
    coordinates.forEach((coord, index) => {
      if (index !== 0) {
        L.marker(coord,{icon:destinationIcon})
          .addTo(map)
          .bindTooltip(`${zipcodes[index + 1]}`, { permanent: true, direction: 'right' });
      }
    });

    // Draw lines according to the paths with colors from the array
    paths.forEach((path, index) => {
      const latlngs = path.map(coordIndex => coordinates[coordIndex]);

      // Use color based on index, cycling through the colors array if needed
      const color = colors[index % colors.length];

      L.polyline(latlngs, {
        color: color,
        weight: 3,
        opacity: 0.7
      }).addTo(map);
    });

    // Fit the map to show all markers
    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds);

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" className='shadow-md rounded-lg' ref={mapRef} style={{ height: '600px' }} />;
};

export default LeafletMap;
