import { getBusinessType } from '../config/businessTypes';
import PublicNavbar from '../components/navbar/PublicNavbar';
import { Outlet } from 'react-router-dom';

const WebpageLayout = () => {
  const businessType = getBusinessType();

  return (
    <div className="webpage-layout" style={{ marginInline:'20px'}}>
      <PublicNavbar businessType={businessType} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default WebpageLayout; 