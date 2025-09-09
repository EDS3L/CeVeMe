import { useState, useEffect } from 'react';
import PersonalData from './PersonalData';
import PasswordDetails from './PasswordDetails';
import EmailAndPhone from './EmailAndPhone';
import UserNavBar from './UserNavBar';
import DeleteAccount from './DeleteAccount';
import Limits from './limits/Limits';
import Payments from './Payments';

import UserDetailsInfo from '../hooks/useUserDeailsInfo';

function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [userLimits, setUserLimits] = useState(null);

  const [activeTab, setActiveTab] = useState('account'); // domyślnie Konto
  const userDatails = new UserDetailsInfo();

  useEffect(() => {
    async function fetchData() {
      const data = await userDatails.getUserDetailsInfo();
      const limits = await userDatails.getUseLimitsInfo();
      setUserData(data);
      setUserLimits(limits);
      console.log(limits);
    }
    fetchData();
  }, []);

  if (!userData) return <p className="p-6">Ładowanie danych...</p>;

  return (
    <div className="min-h-dvh bg-ivorylight text-slatedark">
      <UserNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex w-full justify-center">
        <div className="flex flex-col w-5/6">
          {activeTab === 'account' && (
            <>
              <PersonalData data={userData} />
              <EmailAndPhone data={userData} />
              <PasswordDetails />
              <DeleteAccount />
            </>
          )}

          {activeTab === 'limits' && <Limits data={userLimits} />}

          {activeTab === 'payments' && <Payments user={userData} />}
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
