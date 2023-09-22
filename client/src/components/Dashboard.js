import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <div class="fixed-action-btn">
        <Link
          to='/surveys/new'
          className="btn-floating btn-large red"
        >
          <i class="large material-icons">add</i>
        </Link>
      </div>
    </>
  );
}

export default Dashboard;