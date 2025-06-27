import React from 'react';
import './DriversTable.css';

const DriversTable = () => {
  const drivers = [
    { id: 1, name: 'Rajesh Kumar', level: 'Beginner', status: 'busy' },
    { id: 2, name: 'Amit Sharma', level: 'Proficient', status: 'vacant' },
    { id: 3, name: 'Vikram Singh', level: 'Proficient', status: 'unavailable' },
  ];

  const allDrivers = Array(4).fill(drivers).flat();

  return (
    <div className="recentDrivers">
      <div className="cardHeader">
        <h2>Drivers</h2>
        <a href="#" className="btn">View All</a>
      </div>

      <table>
        <thead>
          <tr>
            <td>Photo</td>
            <td>Name</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {allDrivers.map((driver, index) => (
            <tr key={index}>
              <td width="60px">
                <div className="imgBx">
                  <img src="user.png" alt={driver.name} />
                </div>
              </td>
              <td>
                <h4>{driver.name}<br /><span className={driver.level.toLowerCase()}>{driver.level}</span></h4>
              </td>
              <td>
                <span className={`status${driver.status}`}>
                  {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriversTable;