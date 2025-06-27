import React, { useEffect, useRef } from 'react';

const GoogleMap = ({ busStops, apiKey }) => {
  // const mapRef = useRef(null);
  // const mapInstance = useRef(null);
  // const markers = useRef([]);

  // useEffect(() => {
  //   if (!window.google || !apiKey) return;

  //   mapInstance.current = new window.google.maps.Map(mapRef.current, {
  //     zoom: 13,
  //     center: { lat: 28.613939, lng: 77.209023 } // Default to Delhi
  //   });

  //   return () => {
  //     // Cleanup if needed
  //   };
  // }, [apiKey]);

  // useEffect(() => {
  //   if (!window.google || !mapInstance.current || !busStops.length) return;

  //   // Clear existing markers
  //   markers.current.forEach(marker => marker.setMap(null));
  //   markers.current = [];

  //   // Add new markers
  //   busStops.forEach(stop => {
  //     const marker = new window.google.maps.Marker({
  //       position: { 
  //         lat: parseFloat(stop.lat), 
  //         lng: parseFloat(stop.lng) 
  //       },
  //       map: mapInstance.current,
  //       title: stop.name || 'Bus Stop'
  //     });
  //     markers.current.push(marker);
  //   });

  //   // Adjust bounds to show all markers
  //   if (busStops.length > 0) {
  //     const bounds = new window.google.maps.LatLngBounds();
  //     markers.current.forEach(marker => bounds.extend(marker.getPosition()));
  //     mapInstance.current.fitBounds(bounds);
  //   }

  // }, [busStops]);

  // return <div id="google-map-container" ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default GoogleMap;