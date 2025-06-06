import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, LogOut, ShoppingBag, ShieldCheck, Image as ImageIcon, Camera, Mail, Phone, Lock, Eye, EyeOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ProfilePage = () => {
  const { currentUser, logout, updateProfile, reservations, deleteReservation, updateUserPassword, setShowForgotPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '', avatarFile: null });
  const [currentPasswordForEdit, setCurrentPasswordForEdit] = useState('');
  const [showCurrentPasswordForEdit, setShowCurrentPasswordForEdit] = useState(false);
  
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  const isAdmin = currentUser?.email === 'isaacdelfamedina@gmail.com';

  useEffect(() => {
    if (currentUser) {
      setEditData({
        name: currentUser.full_name || currentUser.user_metadata?.full_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || currentUser.user_metadata?.phone || '',
        avatarFile: null,
      });
      setAvatarPreview(currentUser.avatar_url || null);
    }
  }, [currentUser]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditData(prev => ({ ...prev, avatarFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentPasswordForEdit) {
        toast({ title: "Error", description: "Por favor, introduce tu contraseña actual para guardar los cambios.", variant: "destructive" });
        return;
    }

    let avatarUrl = currentUser.avatar_url;
    if (editData.avatarFile) {
      const file = editData.avatarFile;
      const fileName = `${currentUser.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast({ title: "Error subiendo avatar", description: uploadError.message, variant: "destructive" });
        return;
      }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);
      avatarUrl = urlData.publicUrl;
    }
    
    const profileDataToUpdate = {
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      avatar_url: avatarUrl,
    };

    if (await updateProfile(profileDataToUpdate, currentPasswordForEdit)) {
      setEditMode(false);
      setCurrentPasswordForEdit('');
      toast({ title: "¡Perfil actualizado!", description: "Tus datos se han guardado correctamente." });
    } else {
       toast({ title: "Error", description: "No se pudo actualizar el perfil. Verifica tu contraseña.", variant: "destructive" });
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordChangeData.newPassword !== passwordChangeData.confirmNewPassword) {
      toast({ title: "Error", description: "Las nuevas contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    if (!passwordChangeData.currentPassword || !passwordChangeData.newPassword) {
        toast({ title: "Error", description: "Por favor, completa todos los campos de contraseña.", variant: "destructive" });
        return;
    }

    const success = await updateUserPassword(passwordChangeData.currentPassword, passwordChangeData.newPassword);
    if (success) {
      setPasswordChangeData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast({ title: "Contraseña actualizada", description: "Tu contraseña ha sido cambiada exitosamente." });
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const userReservations = reservations.filter(r => r.user_id === currentUser?.id);

  const getStatusColorClasses = (status) => {
    switch (status) {
      case 'Reserva provisional': return 'bg-red-100 text-red-800 border-red-300';
      case 'Reserva pagada': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Recibida': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10"
        >
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8 mb-8">
            <div className="relative mb-4 md:mb-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar de usuario" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200" />
              ) : (
                <User className="w-32 h-32 md:w-40 md:h-40 text-gray-300 bg-gray-100 rounded-full p-4" />
              )}
              {editMode && (
                <Label htmlFor="avatarUpload" className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors">
                  <Camera className="w-5 h-5" />
                  <Input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </Label>
              )}
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{currentUser.full_name || currentUser.user_metadata?.full_name || 'Usuario'}</h1>
              <p className="text-gray-500">{currentUser.email}</p>
              {!editMode && (
                <Button variant="outline" onClick={() => { setEditMode(true); setActiveTab('info'); }} className="mt-4">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
              {isAdmin && (
                <Button variant="outline" onClick={() => navigate('/admin-dashboard')} className="mt-4 ml-2">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              )}
            </div>
            <Button variant="ghost" onClick={() => { logout(); navigate('/'); }} className="mt-4 md:mt-0 text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          <div className="mb-8 border-b">
            <nav className="flex space-x-2 md:space-x-4">
              {['info', 'reservations', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 md:px-3 text-sm md:text-base font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {tab === 'info' && 'Información'}
                  {tab === 'reservations' && 'Mis Reservas'}
                  {tab === 'security' && 'Seguridad'}
                </button>
              ))}
            </nav>
          </div>
          
          {activeTab === 'info' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-semibold mb-6">Información de la Cuenta</h2>
              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} icon={<User className="w-4 h-4 text-gray-400"/>} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} icon={<Mail className="w-4 h-4 text-gray-400"/>}/>
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} icon={<Phone className="w-4 h-4 text-gray-400"/>}/>
                  </div>
                  <div>
                    <Label htmlFor="currentPasswordForEdit">Contraseña Actual (para guardar)</Label>
                    <div className="relative">
                    <Input 
                        id="currentPasswordForEdit" 
                        type={showCurrentPasswordForEdit ? "text" : "password"} 
                        value={currentPasswordForEdit} 
                        onChange={(e) => setCurrentPasswordForEdit(e.target.value)} 
                        icon={<Lock className="w-4 h-4 text-gray-400"/>}
                        required
                    />
                    <button type="button" onClick={() => setShowCurrentPasswordForEdit(!showCurrentPasswordForEdit)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                        {showCurrentPasswordForEdit ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button type="submit" className="bg-black hover:bg-gray-800 text-white">Guardar Cambios</Button>
                    <Button variant="outline" onClick={() => { setEditMode(false); setCurrentPasswordForEdit(''); }}>Cancelar</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <InfoItem icon={<User />} label="Nombre Completo" value={currentUser.full_name || currentUser.user_metadata?.full_name || 'No especificado'} />
                  <InfoItem icon={<Mail />} label="Email" value={currentUser.email} />
                  <InfoItem icon={<Phone />} label="Teléfono" value={currentUser.phone || currentUser.user_metadata?.phone || 'No especificado'} />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-semibold mb-6">Mis Reservas</h2>
              {userReservations.length > 0 ? (
                <div className="space-y-4">
                  {userReservations.map(reservation => (
                    <div key={reservation.id} className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center ${getStatusColorClasses(reservation.status).split(' ')[2]}`}>
                      <div className="flex-grow">
                        <p className="font-semibold text-lg">{reservation.design}</p>
                        <p className="text-sm">Talla: {reservation.size} | Cantidad: {reservation.quantity}</p>
                        <p className="text-xs">Fecha: {new Date(reservation.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end">
                        <span className={`mb-2 sm:mb-0 sm:mr-4 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClasses(reservation.status)}`}>
                          {reservation.status}
                        </span>
                        {reservation.status === 'Reserva provisional' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteReservation(reservation.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 mt-1"
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No tienes reservas activas en este momento.</p>
              )}
            </motion.div>
          )}
          
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-semibold mb-6">Cambiar Contraseña</h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                 <div>
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <div className="relative">
                    <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={passwordChangeData.currentPassword} onChange={(e) => setPasswordChangeData({...passwordChangeData, currentPassword: e.target.value})} icon={<Lock className="w-4 h-4 text-gray-400"/>} required />
                     <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                        {showCurrentPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <div className="relative">
                    <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={passwordChangeData.newPassword} onChange={(e) => setPasswordChangeData({...passwordChangeData, newPassword: e.target.value})} icon={<Lock className="w-4 h-4 text-gray-400"/>} required />
                     <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                        {showNewPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                    <div className="relative">
                    <Input id="confirmNewPassword" type={showConfirmNewPassword ? "text" : "password"} value={passwordChangeData.confirmNewPassword} onChange={(e) => setPasswordChangeData({...passwordChangeData, confirmNewPassword: e.target.value})} icon={<Lock className="w-4 h-4 text-gray-400"/>} required />
                     <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                        {showConfirmNewPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                    </div>
                  </div>
                <Button type="submit" className="bg-black hover:bg-gray-800 text-white">Actualizar Contraseña</Button>
              </form>
              <div className="mt-4">
                <Button variant="link" className="text-sm p-0 h-auto" onClick={handleForgotPasswordClick}>
                  ¿Has olvidado tu contraseña?
                </Button>
              </div>
            </motion.div>
          )}

        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start py-3 border-b border-gray-100">
    <div className="text-gray-500 mr-3 shrink-0">{React.cloneElement(icon, { className: "w-5 h-5"})}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default ProfilePage;