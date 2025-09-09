import { BatteryPlus, BrainCog } from 'lucide-react';
import LimitCard from './LimitCard';
import UserService from '../../../../hooks/UserService';

function Limits({ data }) {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];
  const userService = new UserService();
  const role = userService.getRoleFromToken(token);
  console.log(role);
  return (
    <div className="border-b border-gray-300 p-3">
      <div className="font-semibold items-center grid gap-3 p-2 ">
        <div className="flex">
          <BrainCog />
          <p className="text-lg font-bold">Limity</p>
        </div>
        <p className="text-sm text-gray-600">
          Ilość użyć AI do ulepszeń tekstów oraz generowania CV pod ofertę pracy
        </p>
      </div>

      <div className="grid gap-2">
        {role === 'FREE' ? (
          <>
            <LimitCard
              title="Dzienny limit CV"
              activeCount={data.userCvDailyLimit}
              totalCount={data.cvDailyLimit}
              description={'Ilość pozostałych dziennych użyć'}
            />
            <LimitCard
              title="Dzienny limit poprawy tekstu"
              activeCount={data.userRefinementDailyLimit}
              totalCount={data.refinementDailyLimit}
            />
          </>
        ) : (
          <>
            <LimitCard
              title="Dzienny limit CV"
              activeCount={data.userCvDailyLimit}
              totalCount={data.cvDailyLimit}
              description={'Ilość pozostałych dziennych użyć'}
            />
            <LimitCard
              title="Miesięczny limit CV"
              activeCount={data.userCvMonthlyLimit}
              totalCount={data.cvMonthlyLimit}
            />
            <LimitCard
              title="Dzienny limit poprawy tekstu"
              activeCount={data.userRefinementDailyLimit}
              totalCount={data.refinementDailyLimit}
            />
            <LimitCard
              title="Dzienny limit CV"
              activeCount={data.userRefinementMonthlyLimit}
              totalCount={data.refinementMonthlyLimit}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Limits;
