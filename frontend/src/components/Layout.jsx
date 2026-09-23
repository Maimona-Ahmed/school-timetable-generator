import { useState } from 'react';

import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Navbar from './Navbar';


function Layout() {

    const [isOpen, setIsOpen] = useState(false);


    return (

        <div className="min-h-screen bg-gray-100">

            <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />


            <Navbar
                setIsOpen={setIsOpen}
            />


            <main className="ml-0 min-h-screen pt-16 lg:ml-64">

                <div className="p-4 sm:p-6">

                    <Outlet />

                </div>

            </main>

        </div>
    );
}


export default Layout;
