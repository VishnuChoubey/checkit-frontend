import { useState, useEffect } from "react";
import axios from "axios";

const BusLogic = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [sourceCoords, setSourceCoords] = useState([28.6139, 77.2090]); // Default: Delhi
  const [destinationCoords, setDestinationCoords] = useState([28.5355, 77.3910]); // Default: Noida
  const [realTimeBuses, setRealTimeBuses] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stopTimes, setStopTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStaticData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/gtfs");
        setStops(response.data.stops);
        setRoutes(response.data.routes);
        setTrips(response.data.trips);
        setStopTimes(response.data.stopTimes);
      } catch (error) {
        setError("Failed to load static GTFS data.");
      } finally {
        setLoading(false);
      }
    };

    loadStaticData();
  }, []);

  useEffect(() => {
    const loadAllBuses = async () => {
      try {
        const response = await axios.get("/gtfs");
        setAllBuses(Array.isArray(response.data) ? response.data : response.data.buses || []);
      } catch (error) {
        setAllBuses([]);
      }
    };

    loadAllBuses();
  }, []);

  const findBuses = () => {
    if (!source || !destination) return alert("Please enter both source and destination.");

    const sourceStop = stops.find((s) => s.stopName.toLowerCase() === source.toLowerCase());
    const destinationStop = stops.find((s) => s.stopName.toLowerCase() === destination.toLowerCase());

    if (!sourceStop || !destinationStop) return alert("Invalid source or destination.");

    const validTrips = stopTimes
      .filter((s) => s.stopId === sourceStop.stopId || s.stopId === destinationStop.stopId)
      .reduce((acc, s) => {
        if (!acc[s.tripId]) acc[s.tripId] = { source: false, destination: false };
        acc[s.tripId][s.stopId === sourceStop.stopId ? "source" : "destination"] = true;
        return acc;
      }, {});

    const tripIds = Object.keys(validTrips).filter((id) => validTrips[id].source && validTrips[id].destination);
    setFilteredBuses(allBuses.filter((bus) => tripIds.includes(bus.tripId)));

    setSourceCoords([sourceStop.stopLat, sourceStop.stopLon]);
    setDestinationCoords([destinationStop.stopLat, destinationStop.stopLon]);
  };

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    setSourceSuggestions(value ? stops.filter((s) => s.stopName.toLowerCase().includes(value.toLowerCase())).map((s) => s.stopName) : []);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setDestinationSuggestions(value ? stops.filter((s) => s.stopName.toLowerCase().includes(value.toLowerCase())).map((s) => s.stopName) : []);
  };

  return {
    source,
    destination,
    filteredBuses,
    sourceCoords,
    destinationCoords,
    realTimeBuses,
    sourceSuggestions,
    destinationSuggestions,
    loading,
    error,
    findBuses,
    handleSourceChange,
    handleDestinationChange,
    setSource,
    setDestination,
    setSourceSuggestions,
    setDestinationSuggestions,
  };
};

export default BusLogic;
