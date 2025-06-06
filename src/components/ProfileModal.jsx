import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2, User, Mail, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ProfileModal = () => {
  const { 
    showProfile, 
    setShowProfile, 
    currentUser, 
    logout, 
    updateProfile, 
    deleteReservation, 
    reservations 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState('reservas');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '' // For verifying identity if needed, or changing password
  });

  useEffect(() => {
    if (currentUser) {
      setEditData({
        name: currentUser.full_name || currentUser.user_metadata?.full_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || currentUser.user_metadata?.phone || '',
        currentPassword: ''
      });
    }
  }, [currentUser, showProfile]);


  const userReservations = reservations.filter(r => r.user_id === currentUser?.id);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // Pass only relevant fields for update, not currentPassword unless changing auth details
    const profileDataToUpdate = {
      name: editData.name,
      email: editData.email, // Supabase handles email change flow
      phone: editData.phone,
    };
    
    // Pass currentPassword if you implement password change or email change that requires it
    if (await updateProfile(profileDataToUpdate, editData.currentPassword)) {
      setEditMode(false);
      setEditData(prev => ({ ...prev, currentPassword: '' }));
    }
  };

  const handleClose = () => {
    setShowProfile(false);
    setEditMode(false);
    setActiveTab('reservas');
    if (currentUser) {
      setEditData({
        name: currentUser.full_name || currentUser.user_metadata?.full_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || currentUser.user_metadata?.phone || '',
        currentPassword: ''
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reserva provisional':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reserva pagada':
        return 'bg-blue-100 text-blue-800';
      case 'Recibida':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) return null;

  return (
    <AnimatePresence>
      {showProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mi Perfil</h2>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex space-x-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab('reservas')}
                className={`pb-2 px-1 ${
                  activeTab === 'reservas' 
                    ? 'border-b-2 border-black font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                Mis Reservas
              </button>
              <button
                onClick={() => setActiveTab('perfil')}
                className={`pb-2 px-1 ${
                  activeTab === 'perfil' 
                    ? 'border-b-2 border-black font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                Datos del Perfil
              </button>
            </div>

            {activeTab === 'reservas' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Mis Reservas</h3>
                {userReservations.length > 0 ? (
                  userReservations.map(reservation => (
                    <div key={reservation.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{reservation.design}</p>
                          <p className="text-sm text-gray-600">Talla: {reservation.size}</p>
                          <p className="text-sm text-gray-600">Cantidad: {reservation.quantity}</p>
                          <p className="text-sm text-gray-600">Fecha: {new Date(reservation.created_at).toLocaleDateString()}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        </div>
                        {reservation.status === 'Reserva provisional' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteReservation(reservation.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No tienes reservas aún</p>
                )}
              </div>
            )}

            {activeTab === 'perfil' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Datos del Perfil</h3>
                  {!editMode && (
                    <Button
                      variant="outline"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <User className="w-4 h-4 inline mr-2" />
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        required
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                        Guardar Cambios
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditMode(false);
                          setEditData({
                            name: currentUser.full_name || currentUser.user_metadata?.full_name || '',
                            email: currentUser.email || '',
                            phone: currentUser.phone || currentUser.user_metadata?.phone || '',
                            currentPassword: ''
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Nombre</p>
                        <p className="font-medium">{currentUser.full_name || currentUser.user_metadata?.full_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-medium">{currentUser.phone || currentUser.user_metadata?.phone || 'No especificado'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;