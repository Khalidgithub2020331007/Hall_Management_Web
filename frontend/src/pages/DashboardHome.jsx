import React from 'react';

const DashboardHome = () => {
    return (
        <div>
            <p>Dashboard for {localStorage.getItem("userName")} Who is in role of {localStorage.getItem("userRole")}</p>
        </div>
    );
};

export default DashboardHome;