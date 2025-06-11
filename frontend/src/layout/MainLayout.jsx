// src/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import LeftNavBar from './LeftNavBar';
import TopNavBar from './TopNavBar';

const MainLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <TopNavBar />
      <div className="flex flex-grow">
        <LeftNavBar />
        <main className="flex-grow p-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
