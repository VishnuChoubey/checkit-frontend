import React from 'react';
import './StaffTable.css';

const StaffTable = () => {
  const staffMembers = [
    { id: 1, name: 'Priya Sharma', role: 'Conductor', status: 'active' },
    { id: 2, name: 'Rahul Verma', role: 'Ticket Collector', status: 'inactive' },
    { id: 3, name: 'Neha Patel', role: 'Supervisor', status: 'active' },
  ];

  const allStaff = Array(4).fill(staffMembers).flat();

  return (
    <div className="recentStaff">
      <div className="cardHeader">
        <h2>Staff</h2>
        <a href="#" className="btn">View All</a>
      </div>

      <table>
        <thead>
          <tr>
            <td>Photo</td>
            <td>Name</td>
            <td>Role</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {allStaff.map((staff, index) => (
            <tr key={index}>
              <td width="60px">
                <div className="imgBx">
                  <img src="user.png" alt={staff.name} />
                </div>
              </td>
              <td>
                <h4>{staff.name}</h4>
              </td>
              <td>{staff.role}</td>
              <td>
                <span className={`status${staff.status}`}>
                  {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;