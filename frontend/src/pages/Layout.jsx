// components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import SponsorsSidebar from '@/components/SponsorsSidebar';

const Layout = () => {
    return (
        <div className='flex justify-between'>
            <Sidebar />
            <div >
                <Outlet />
            </div>
            {/* <SponsorsSidebar/> */}
        </div>
    );
};

export default Layout;
