import { Save, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import userPNG from '../../../../public/user.png';
import UserDetailsInfo from '../hooks/useUserDeailsInfo';
import EditAvatarModal from './EditAvatarModal';
import { toast } from 'react-toastify';
import SettignsField from './SettignsField';

function PersonalData({ data }) {
  const userDetailsInfo = new UserDetailsInfo();

  const [form, setForm] = useState({
    firstName: data.name || '',
    lastName: data.surname || '',
    city: data.city || '',
  });

  const [avatar, setAvatar] = useState(data.avatarUrl || userPNG);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({
      firstName: data.name || '',
      lastName: data.surname || '',
      city: data.city || '',
    });
    setAvatar(data.image || userPNG);
  }, [data]);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await userDetailsInfo.updateUserNameSurnameCity(
      form.city,
      form.firstName,
      form.lastName
    );
  };

  const handleAvatarSaved = async (previewUrl, file) => {
    setAvatar(previewUrl || userPNG);

    if (file) {
      try {
        setUploading(true);
        const email = data.email || '';
        const res = await userDetailsInfo.uploadProfileImage(file, email);
        if (res?.url) {
          setAvatar(res.url);
        }
      } catch (e) {
        toast.error('Błąd przesyłania zdjęcia', e);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="border-b border-gray-300 p-3">
      <div className="font-semibold items-center grid gap-3 p-2 ">
        <div className="flex">
          <User />
          <p className="text-lg font-bold">Szczegóły użytkownika</p>
        </div>
        <p className="text-sm text-gray-600">
          Wybierz jak chcesz się prezetnować w swoim CV.
        </p>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 grid gap-2">
          <SettignsField
            label="Imię"
            value={form.firstName}
            onChange={handleChange('firstName')}
          />
          <SettignsField
            label="Nazwisko"
            value={form.lastName}
            onChange={handleChange('lastName')}
          />
          <SettignsField
            label="Miasto"
            value={form.city}
            onChange={handleChange('city')}
          />
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-bookcloth text-basewhite hover:opacity-90 disabled:opacity-60 w-1/3"
            onClick={handleSave}
          >
            <Save size={20} strokeWidth={2} />
            Zapisz
          </button>
        </div>

        <div className="w-full md:w-1/4 h-auto flex flex-col justify-center items-center gap-4 mt-4 md:mt-0">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-ivorymedium border">
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOpenAvatarModal(true)}
              className={`px-3 py-2 rounded-2xl ${
                uploading ? 'bg-gray-300' : 'bg-bookcloth text-basewhite'
              }`}
              disabled={uploading}
            >
              {uploading ? 'Wysyłam...' : 'Zmień zdjęcie'}
            </button>
            <button
              onClick={() => {
                setAvatar(userPNG);
              }}
              className="px-3 py-2 rounded-2xl bg-manilla text-slatedark"
            >
              Usuń
            </button>
          </div>
          <p className="text-xs text-cloudmedium text-center">
            Twoje zdjęcie to twoja wizytówka - wybierz dobrze ;p
          </p>
        </div>
      </div>

      <EditAvatarModal
        open={openAvatarModal}
        onClose={() => setOpenAvatarModal(false)}
        currentAvatar={avatar}
        onSaved={handleAvatarSaved}
      />
    </div>
  );
}

export default PersonalData;
