// import { useEffect, useState } from "react";

// function WebsocketCheck() {
//   const [commonRoutes, setCommonRoutes] = useState(["211", "320"]);
//   const [ws, setWs] = useState(null);
//   const [buses, setBuses] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasWebSocketData, setHasWebSocketData] = useState(false);
//   const [connectionAttempts, setConnectionAttempts] = useState(0);
//   const [destinationSelected, setDestinationSelected] = useState(true); // For demonstration

//   useEffect(() => {
//     if (!commonRoutes?.length || !destinationSelected) return;

//     const setupWebSocket = () => {
//       setIsLoading(true);
//       setHasWebSocketData(false);

//       // Close existing connection if any
//       if (ws?.readyState === WebSocket.OPEN) {
//         ws.close();
//       }

//       const newWs = new WebSocket("ws://localhost:8080/ws/vehicles");
//       console.log("WebSocket connection established");

//       newWs.onopen = () => {
//         newWs.send(
//           JSON.stringify({
//             action: "subscribe",
//             routes: commonRoutes,
//           })
//         );
//       };

//       newWs.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);

//           if (Array.isArray(data)) {
//             setBuses(data);
//             setHasWebSocketData(data.length > 0);
//           } else if (data.vehicleId) {
//             setBuses((prev) => {
//               const existingIndex = prev.findIndex(
//                 (b) => b.vehicleId === data.vehicleId
//               );
//               if (existingIndex >= 0) {
//                 const updated = [...prev];
//                 updated[existingIndex] = data;
//                 return updated;
//               }
//               return [...prev, data];
//             });
//             setHasWebSocketData(true);
//           }
//         } catch (error) {
//           console.error("Error parsing WebSocket data:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       newWs.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         setIsLoading(false);
//         setTimeout(() => setConnectionAttempts((prev) => prev + 1), 3000);
//       };

//       newWs.onclose = () => {
//         setTimeout(() => setConnectionAttempts((prev) => prev + 1), 3000);
//       };

//       setWs(newWs);
//     };

//     // Only call setupWebSocket when commonRoutes is updated
//     setupWebSocket();

//     // Cleanup WebSocket connection on unmount
//     return () => {
//       if (ws?.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [commonRoutes, destinationSelected]); // Re-run when commonRoutes or destinationSelected change

//   return (
//     <div>
//       <h1>Live Bus Route Tracker</h1>
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         buses.map((bus) => (
//           <div key={bus.vehicleId}>{bus.vehicleId} - {bus.routeId}</div>
//         ))
//       )}
//     </div>
//   );
// }
// export default WebsocketCheck;
