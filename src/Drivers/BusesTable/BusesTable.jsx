import React from 'react';
import './BusesTable.css';

const BusesTable = () => {
  const buses = [
    { id: 'gfv348y7', number: '56', route: 'India gate to Lajpat Nagar', status: 'running' },
    { id: 'gfv348y7', number: '56', route: 'India gate to Lajpat Nagar', status: 'vacant' },
    { id: 'gfv348y7', number: '56', route: 'India gate to Lajpat Nagar', status: 'broken' },
  ];

  const allBuses = Array(5).fill(buses).flat();

  return (
    <div className="availBuses">
      <div className="cardHeader">
        <h2>Available Buses</h2>
        <a href="#" className="btn">View All</a>
      </div>
      <table>
        <thead>
          <tr>
            <td>BusID</td>
            <td>BusNumber</td>
            <td>Route</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {allBuses.map((bus, index) => (
            <tr key={index}>
              <td>{bus.id}</td>
              <td>{bus.number}</td>
              <td>{bus.route}</td>
              <td>
                <span className={`status${bus.status}`}>
                  {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusesTable;