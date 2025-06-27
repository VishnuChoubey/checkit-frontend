import React, { useEffect, useRef } from 'react';

const HereMap = ({ route, busStops, apiKey }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.H || !apiKey) return;

    const platform = new window.H.service.Platform({
      apikey: apiKey
    });

    const defaultLayers = platform.createDefaultLayers();
    mapInstance.current = new window.H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        zoom: 13,
        center: { lat: 28.613939, lng: 77.209023 }
      }
    );

    new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance.current));
    window.H.ui.UI.createDefault(mapInstance.current, defaultLayers);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.dispose();
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapInstance.current || !busStops.length) return;

    // Clear existing objects
    mapInstance.current.getObjects().forEach(obj => mapInstance.current.removeObject(obj));

    // Add bus stop markers
    busStops.forEach(stop => {
      const marker = new window.H.map.Marker({
        lat: parseFloat(stop.lat),
        lng: parseFloat(stop.lng)
      });
      mapInstance.current.addObject(marker);
    });

    // Add route if available
    if (route?.polyline) {
      try {
        const lineString = window.H.geo.LineString.fromFlexiblePolyline(route.polyline);
        const routeLine = new window.H.map.Polyline(lineString, {
          style: { strokeColor: 'blue', lineWidth: 4 }
        });
        mapInstance.current.addObject(routeLine);
        mapInstance.current.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
      } catch (err) {
        console.error('Error rendering route:', err);
      }
    }
  }, [route, busStops]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default HereMap;