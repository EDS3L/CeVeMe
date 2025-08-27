import { User, Wrench } from 'lucide-react';
import React from 'react';
import FieldWithAI from '../../user/components/ui/FieldWithAI';
import PersonalData from './PersonalData';
import PasswordDetails from './PasswordDetails';
import EmailAndPhone from './EmailAndPhone';
import UserNavBar from './UserNavBar';
import DeleteAccount from './DeleteAccount';
import Limits from './Limits';

function UserDetails() {
  return (
    <div className="min-h-dvh bg-ivorylight text-slatedark">
      <UserNavBar />
      <div className="flex w-full justify-center">
        <div className="flex flex-col w-5/6">
          <PersonalData />
          <EmailAndPhone />
          <PasswordDetails />
          <DeleteAccount />
          <Limits />
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
