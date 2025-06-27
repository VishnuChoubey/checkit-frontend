import React from "react";

const BusList = ({ buses }) => {
  return buses.length > 0 ? (
    <div className="p-6 bg-white rounded-b-3xl shadow-md mb-8">
      <h2 className="text-2xl font-semibold">Available Buses</h2>
      <ul>
        {buses.map((bus, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded-xl shadow-md">
            <h3 className="font-bold">{bus.route}</h3>
            <p>Time: {bus.time}</p>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p className="text-center text-lg text-gray-600">No buses found.</p>
  );
};

export default BusList;
