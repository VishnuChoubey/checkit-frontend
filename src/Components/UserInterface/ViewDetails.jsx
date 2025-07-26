import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FaBus, FaTicketAlt, FaInfoCircle, FaClock, FaMapMarkerAlt, FaTachometerAlt, FaCompass, FaRoute } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const stompClientRef = React.createRef();

const SIDEBAR_WIDTH = 220;

const ViewDetails = () => {
  // State management
  const [stops, setStops] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    source: "",
    destination: ""
  });
  const [filteredSuggestions, setFilteredSuggestions] = useState({
    source: [],
    destination: []
  });
  const [selectedStopIds, setSelectedStopIds] = useState({
    source: null,
    destination: null
  });
  const [commonRoutes, setCommonRoutes] = useState([]);
  const [busData, setBusData] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    isSearching: false,
    isLoading: false,
    isConnected: false
  });
  const [connectionStatus, setConnectionStatus] = useState({
    attempts: 0,
    hasWebSocketData: false
  });

  // Store previous bus positions for speed/direction calculation
  const prevBusPositions = useRef({});

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch stops from public/stopNames.json on mount
    const fetchStops = async () => {
      try {
        const response = await fetch('/stopNames.json');
        const data = await response.json();
        setStops(data || []);
      } catch (error) {
        console.error("Error fetching stops:", error);
        setStops([]);
      }
    };
    fetchStops();
  }, []);

  // WebSocket connection
  const connectWebSocket = useCallback((routes) => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    const socket = new SockJS(`${process.env.REACT_APP_API_BASE}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setLoadingStates(prev => ({ ...prev, isConnected: true }));
        stompClient.subscribe('/topic/init', (message) => {
          const data = JSON.parse(message.body);
          setBusData(prev => [...prev, data]);
        });
        stompClient.publish({
          destination: '/app/subscribe',
          body: JSON.stringify({ routes }),
          headers: { 'content-type': 'application/json' }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onDisconnect: () => {
        setLoadingStates(prev => ({ ...prev, isConnected: false }));
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  }, []);

  // Find common routes when both source and destination are selected
  const handleFindBuses = useCallback(async () => {
    setBusData([]); // Clear busData
    setCommonRoutes([]);
    setLoadingStates(prev => ({ ...prev, isSearching: true }));

    try {
   const response = await axios.get(
  `${process.env.REACT_APP_API_BASE}/api/vehicle/stopTimes/routes`, {
    params: {
      sourceStop: searchQueries.source,
      destinationStop: searchQueries.destination,
    },
    withCredentials: true
  }
);
      const routes = response.data || [];
      setCommonRoutes(routes);
      setConnectionStatus(prev => ({ ...prev, hasWebSocketData: routes.length > 0 }));
      // Connect to WebSocket with new routes
      connectWebSocket(routes);
    } catch (error) {
      console.error("Error fetching common routes:", error);
      setCommonRoutes([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, isSearching: false }));
    }
  }, [searchQueries.source, searchQueries.destination, connectWebSocket]);

  // Debounced search input handler
  const handleSearchChange = useCallback(
    debounce((value, field) => {
      setSearchQueries(prev => ({ ...prev, [field]: value }));
      setFilteredSuggestions(prev => ({
        ...prev,
        [field]: value.trim()
          ? stops
              .filter(stop => stop.toLowerCase().includes(value.toLowerCase()))
              .map(stop => stop)
          : [],
      }));
    }, 300),
    [stops]
  );

  // Handle stop selection
  const handleStopSelect = useCallback((value, field) => {
    setSearchQueries(prev => ({ ...prev, [field]: value }));
    setFilteredSuggestions(prev => ({ ...prev, [field]: [] }));
    setConnectionStatus(prev => ({ ...prev, hasWebSocketData: false }));

    const selectedStop = stops.find(stop => stop.stopName === value);
    if (selectedStop) {
      setSelectedStopIds(prev => ({
        ...prev,
        [field]: selectedStop.stopId
      }));
    }
  }, [stops]);

  // Handle bus card click
  const handleBusCardClick = useCallback((bus) => {
    navigate("/busTracker", {
      state: {
        routeId: bus.routeId,
        sourceStopId: selectedStopIds.source,
        destStopId: selectedStopIds.destination,
        busData: bus
      }
    });
  }, [navigate, selectedStopIds]);

  // Get latest bus data (deduplicated by vehicleId)
  const latestBusData = useMemo(() => {
    const busMap = new Map();
    busData.forEach(bus => {
      const existing = busMap.get(bus.vehicleId);
      if (!existing || bus.timestamp > existing.timestamp) {
        busMap.set(bus.vehicleId, bus);
      }
    });
    return Array.from(busMap.values());
  }, [busData]);

  // --- Calculate speed and direction for each bus ---

  // Loading state conditions
  const showLoading = useMemo(() => {
    return loadingStates.isSearching || busData.length === 0;
  }, [loadingStates.isSearching, busData.length]);

  return (
    <>
      <style>{`
        .viewdetails-layout {
          display: flex;
          min-height: 100vh;
          background: #f3f4f6;
        }
        .viewdetails-main {
         
          flex: 1;
      
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem 1.5rem 1rem;
          max-width: 1050px;
          width: 100%;
        }
        .viewdetails-card-separator {
        
          position: absolute;
          left: 50%;
          top: -18px;
          transform: translateX(-50%);
          width: 60px;
          height: 7px;
          background: #4ade80;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(22,163,74,0.15);
          border: 1.5px solid #16a34a;
          z-index: 10;
          
        }
        .viewdetails-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #16a34a;
          letter-spacing: 0.04em;
          text-align: center;
          margin-bottom: 0.5rem;
          
        }
        .viewdetails-desc {
          text-align: center;
          color: #4b5563;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 1050px) {
          .viewdetails-main {
            margin-left: 0;
            padding: 1rem 0.2rem;
          }
          .viewdetails-card-separator {
            width: 40px;
            height: 6px;
            top: -12px;
          }
        }
        .home-card {
          
          border-radius: 2rem;             /* Tailwind: rounded-2xl = 1rem (16px) */
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Tailwind: shadow-2xl */
          padding: 1.5rem;                 /* Tailwind: p-6 = 1.5rem */

          /* Margin overrides from inline style */
          margin-top: 0.2rem;
          margin-bottom: 1rem;
          margin-left: 8px;
          margin-right: 0.4rem;
          background: linear-gradient(90deg, #f0fdf4 60%, #bbf7d0 100%);
        }
      `}</style>
     
        {/* Sidebar/Navbar */}
        
        {/* Main Content */}
      
       
            {/* Card separation bar */}
            {/* <div className="viewdetails-card-separator"></div> */}
            <div className="home-card">
              <div className="viewdetails-title">
                Delhi Bus Route Tracker
              </div>
              <div className="viewdetails-desc">
                Plan your journey, check live bus locations, and manage your travel with ease. <br />
                Enter your source and destination to find available buses in real time.
              </div>
              <SearchSection
                queries={searchQueries}
                filteredSuggestions={filteredSuggestions}
                handleChange={handleSearchChange}
                handleSelect={handleStopSelect}
                onFindBuses={handleFindBuses}
              />
              <ActionButtons />
          {showLoading ? (
  <LoadingState
    isSearching={loadingStates.isSearching}
    queries={searchQueries}
  />
) : latestBusData.length > 0 ? (
  <BusCardsContainer
    buses={latestBusData}
    onBusClick={handleBusCardClick}
  />
) : (
  <NoBusesAvailable
    destinationSelected={!!selectedStopIds.destination}
  />
)}
            </div>
    
    </>
  );
};

// Extracted Components

const SearchSection = React.memo(({
  queries,
  filteredSuggestions,
  handleChange,
  handleSelect,
  onFindBuses
}) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-2 mb-4">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <SearchInput
        value={queries.source}
        onChange={(e) => handleChange(e.target.value, "source")}
        suggestions={filteredSuggestions.source}
        onSelect={(value) => handleSelect(value, "source")}
        placeholder="Source"
      />

      <SearchInput
        value={queries.destination}
        onChange={(e) => handleChange(e.target.value, "destination")}
        suggestions={filteredSuggestions.destination}
        onSelect={(value) => handleSelect(value, "destination")}
        placeholder="Destination"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full md:w-auto font-medium"
        onClick={onFindBuses}
      >
        Find Buses
      </button>
    </div>
  </div>
));

const SearchInput = React.memo(({
  value,
  onChange,
  suggestions,
  onSelect,
  placeholder
}) => (
  <div className="relative w-full md:w-1/3">
    <input
      type="text"
      className="border p-3 rounded-lg w-full"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {suggestions.length > 0 && (
      <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-60 overflow-y-auto">
        {suggestions.map((suggestion, i) => (
          <li
            key={i}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    )}
  </div>
));

const BusCardsContainer = React.memo(({ buses, onBusClick }) => (
  <div className="space-y-4 mt-6">
    {buses.map(bus => (
      <BusCard
        key={bus.vehicleId}
        bus={bus}
        onClick={() => onBusClick(bus)}
      />
    ))}
  </div>
));

const BusCard = React.memo(({ bus, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200"
    onClick={onClick}
  >
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaBus className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Bus {bus.vehicleId}</h3>
            <div className="flex items-center mt-1 space-x-4">
              <span className="text-base text-gray-600 flex items-center">
                <FaRoute className="mr-1 text-gray-400" />
                Route {bus.routeId}
              </span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                bus.speed > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {bus.speed > 0 ? "Moving" : "Idle"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Last updated</p>
          <p className="text-base font-semibold text-gray-700">
            {bus.timestamp ? new Date(bus.timestamp).toLocaleTimeString() : "--:--"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatItem
          icon={<FaTachometerAlt className="text-green-500 text-lg" />}
          label="Speed"
          value={`${bus.speed ? bus.speed.toFixed(2) : 0} km/h`}
        />
        <StatItem
          icon={<FaCompass className="text-blue-500 text-lg" />}
          label="Direction"
          value={bus.direction || "N/A"}
        />
        <StatItem
          icon={<FaMapMarkerAlt className="text-red-500 text-lg" />}
          label="Next StopId"
          value={`No. ${bus.nextStopId}` || "N/A"}
          truncate
        />
        <StatItem
          icon={<FaClock className="text-purple-500 text-lg" />}
          label="ETA"
          value={bus.eta !== undefined ? `${bus.eta} min` : "N/A"}
        />
      </div>

 {bus.nextStopName&& (
  <div className="bg-blue-100 rounded-md px-4 py-2 flex items-center justify-between">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
      <span className="text-base font-semibold text-blue-800">
        Next Stop:
      </span>
      <span className="text-lg font-bold text-blue-700">
        {bus.nextStopName}
      </span>
    </div>
  </div>
)}
    </div>
  </motion.div>
));

const StatItem = React.memo(({ icon, label, value, truncate = false }) => (
  <div className="bg-gray-100 rounded-md p-3">
    <div className="flex items-center space-x-2 text-gray-600 mb-1">
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </div>
    <p className={`text-base font-bold text-gray-800 ${truncate ? 'truncate' : ''}`}>
      {value}
    </p>
  </div>
));

const LoadingState = React.memo(({ isSearching, queries }) => (
  <div className="flex flex-col items-center justify-center py-8 md:py-12">
    <ClipLoader color="#3B82F6" size={50} />
    <p className="mt-4 text-gray-600 text-center">
      {isSearching
        ? `Finding routes between ${queries.source} and ${queries.destination}...`
        : `Loading real-time bus data...`}
    </p>
  </div>
));

const NoBusesAvailable = React.memo(({ destinationSelected }) => (
  <div className="text-center py-8">
    <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
      <FaBus className="text-blue-600 text-4xl" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      {destinationSelected
        ? "No buses currently available"
        : "Select source and destination stops"}
    </h3>
    <p className="text-gray-600">
      {destinationSelected
        ? "There are no buses currently operating on this route."
        : "Choose your stops to see available buses."}
    </p>
  </div>
));

const ActionButtons = React.memo(() => (
  <div className="mt-4 md:mt-6 grid grid-cols-3 gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg shadow-md">
    <button className="flex flex-col items-center justify-center gap-1 text-sm md:text-base font-medium bg-blue-50 text-blue-700 px-2 py-2 md:px-4 md:py-3 rounded-lg hover:bg-blue-100 transition-colors">
      <FaBus className="text-lg md:text-xl" />
      <span>Nearby Buses</span>
    </button>
    <button className="flex flex-col items-center justify-center gap-1 text-sm md:text-base font-medium bg-green-50 text-green-700 px-2 py-2 md:px-4 md:py-3 rounded-lg hover:bg-green-100 transition-colors">
      <FaTicketAlt className="text-lg md:text-xl" />
     <Link to="/booking">
      <span>Book Ticket</span>
    </Link>
    </button>
    <button className="flex flex-col items-center justify-center gap-1 text-sm md:text-base font-medium bg-purple-50 text-purple-700 px-2 py-2 md:px-4 md:py-3 rounded-lg hover:bg-purple-100 transition-colors">
      <Link
  to="/routeinfo"
  className="flex flex-col items-center justify-center gap-1 text-sm md:text-base font-medium bg-purple-50 text-purple-700 px-2 py-2 md:px-4 md:py-3 rounded-lg hover:bg-purple-100 transition-colors"
>
  <FaInfoCircle className="text-lg md:text-xl" />
  <span>Route Info</span>
</Link>
    </button>
  </div>
));

export default React.memo(ViewDetails);