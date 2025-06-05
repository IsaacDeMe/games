// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  Mail,
  Phone,
  LogOut,
  Edit3,
  Camera,
  AlertTriangle,
  Settings,
  Save,
  Lock,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

// Mapa de URLs para miniaturas de cada diseño
const designImagesMap = {
  'Diseño 1':
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/9c39bd9c3d8857537d607297e8645a08.png',
  'Diseño 2':
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/2f2824b7-ecd0-4c8d-aa7c-77ae22631a7c/0d0177ba98d1dbe65e47d20a1259ba43.png',
};

// ─── COMPONENTE QUE MUESTRA LOS DATOS DE PERFIL (EN MODO “VER”) ───
const ProfileInfoDisplay = ({ user, onEdit }) => {
  const labelColor = 'text-gray-600';
  const valueColor = 'text-gray-800';

  return (
    <>
      <div className="flex items-center mb-6">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Perfil"
            className="w-8 h-8 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-muted text-muted-foreground">
            <User size={24} />
          </div>
        )}
        <div>
          <p className={`text-sm ${labelColor}`}>Nombre Completo</p>
          <p className={`font-medium ${valueColor}`}>
            {user.fullName || 'No especificado'}
          </p>
        </div>
      </div>
      <div className="flex items-center mb-6">
        <Mail size={20} className="text-primary mr-4 ml-2 flex-shrink-0" />
        <div>
          <p className={`text-sm ${labelColor}`}>Correo Electrónico</p>
          <p className={`font-medium ${valueColor}`}>{user.email}</p>
        </div>
      </div>
      <div className="flex items-center mb-6">
        <Phone size={20} className="text-primary mr-4 ml-2 flex-shrink-0" />
        <div>
          <p className={`text-sm ${labelColor}`}>Número de Teléfono</p>
          <p className={`font-medium ${valueColor}`}>
            {user.phoneNumber || 'No especificado'}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full mt-4 button-outline-themed hover:text-primary"
        onClick={onEdit}
      >
        <Edit3 size={16} className="mr-2" /> Editar Perfil
      </Button>
    </>
  );
};

// ─── FORMULARIO PARA EDITAR INFORMACIÓN PERSONAL ───
const EditPersonalForm = ({ user, onSave, onCancel }) => {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    user.profileImageUrl || ''
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo Demasiado Grande',
        description: 'La imagen no debe superar los 5 MB.',
        variant: 'destructive',
      });
      return;
    }
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast({
        title: 'Contraseña Requerida',
        description: 'Debes ingresar tu contraseña actual para confirmar los cambios.',
        variant: 'destructive',
      });
      return;
    }
    if (!phoneNumber) {
      toast({
        title: 'Teléfono Requerido',
        description: 'Debes ingresar tu número de teléfono.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Reautenticar usuario
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reauthError) throw new Error('Contraseña actual incorrecta.');

      // Subir nueva imagen si existe
      let avatarUrl = user.profileImageUrl || '';
      if (profileImageFile) {
        const fileExt = profileImageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatarscamisetas')
          .upload(fileName, profileImageFile, { cacheControl: '3600', upsert: true });
        if (uploadError) throw new Error('Error subiendo imagen: ' + uploadError.message);
        const { data: publicUrlData } = supabase.storage
          .from('avatarscamisetas')
          .getPublicUrl(uploadData.path);
        avatarUrl = publicUrlData.publicUrl;
      }

      // Actualizar metadata (sin cambiar contraseña)
      const updatePayload = {
        data: { full_name: fullName, avatar_url: avatarUrl, phone_number: phoneNumber },
      };
      const { error: updateError } = await supabase.auth.updateUser(updatePayload);
      if (updateError) throw updateError;

      toast({ title: 'Perfil Actualizado', description: '¡Cambios guardados!' });
      onSave();
    } catch (err) {
      toast({ title: 'Error al Actualizar', description: err.message, variant: 'destructive' });
      setIsSaving(false);
      return;
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AVATAR */}
      <div className="flex flex-col items-center space-y-2">
        <img
          src={
            profileImagePreview ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.fullName || user.email
            )}&background=hsl(var(--primary))&color=hsl(var(--primary-foreground))&size=128`
          }
          alt="Vista previa de avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="button-outline-themed"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSaving}
        >
          <Camera size={16} className="mr-2" /> Cambiar Imagen
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageChange}
          disabled={isSaving}
        />
      </div>

      {/* NOMBRE COMPLETO */}
      <div>
        <label htmlFor="editFullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo
        </label>
        <Input
          id="editFullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-themed"
          disabled={isSaving}
        />
      </div>

      {/* CORREO (solo lectura) */}
      <div>
        <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico (no editable)
        </label>
        <Input
          id="editEmail"
          type="email"
          value={user.email}
          className="bg-muted border-border cursor-not-allowed"
          readOnly
          disabled
        />
      </div>

      {/* TELÉFONO */}
      <div>
        <label htmlFor="editPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número de Teléfono
        </label>
        <Input
          id="editPhoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input-themed"
          disabled={isSaving}
        />
      </div>

      {/* CONTRASEÑA ACTUAL */}
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña Actual
        </label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="●●●●●●●●"
          className="input-themed"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isSaving}
          required
        />
      </div>

      {/* BOTONES GUARDAR / CANCELAR */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 button-primary-themed" disabled={isSaving}>
          {isSaving ? 'Guardando...' : <><Save size={16} className="mr-2" /> Guardar Cambios</>}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 button-outline-themed" disabled={isSaving}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

// ─── FORMULARIO PARA CAMBIAR CONTRASEÑA ───
const ChangePasswordForm = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast({ title: 'Contraseña Requerida', description: 'Debes ingresar tu contraseña actual.', variant: 'destructive' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast({ title: 'Contraseña Inválida', description: 'La nueva contraseña debe tener al menos 6 caracteres.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: 'Error de Confirmación', description: 'Las contraseñas no coinciden.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      // Reautenticar
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reauthError) throw new Error('Contraseña actual incorrecta.');

      // Actualizar contraseña
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      toast({ title: 'Contraseña Actualizada', description: 'Tu contraseña ha sido cambiada.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label htmlFor="currentPasswordSec" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña Actual
        </label>
        <Input
          id="currentPasswordSec"
          type="password"
          placeholder="●●●●●●●●"
          className="input-themed"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isSaving}
          required
        />
      </div>
      <div>
        <label htmlFor="newPasswordSec" className="block text-sm font-medium text-gray-700 mb-1">
          Nueva Contraseña (mín. 6 caracteres)
        </label>
        <Input
          id="newPasswordSec"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-themed"
          disabled={isSaving}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmNewPasswordSec" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Nueva Contraseña
        </label>
        <Input
          id="confirmNewPasswordSec"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="input-themed"
          disabled={!newPassword || isSaving}
          required
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 button-primary-themed" disabled={isSaving}>
          {isSaving ? 'Actualizando...' : <><Lock size={16} className="mr-2" /> Cambiar Contraseña</>}
        </Button>
      </div>
    </form>
  );
};

// ─── PÁGINA GENERAL DE PERFIL CON TABS ─────────────────────────
const ProfilePage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('info'); // 'info' | 'reservas' | 'security'
  const [isEditing, setIsEditing] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  // Estado para reservas
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  // Función reutilizable para traer reservas
  const fetchReservations = async () => {
    if (!user) {
      setReservations([]);
      setLoadingReservations(false);
      return;
    }
    setLoadingReservations(true);
    const { data, error } = await supabase
      .from('camisetas')
      .select('*')
      .eq('email_user', user.email)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error al traer reservas:', error);
      setReservations([]);
    } else {
      setReservations(data);
    }
    setLoadingReservations(false);
  };

  // Chequear verificación de email
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!authLoading && user) {
        const { data: { session } } = await supabase.auth.getSession();
        setIsEmailVerified(!!session.user.email_confirmed_at);
      } else if (!authLoading && !user) {
        setIsEmailVerified(false);
      }
    };
    checkEmailVerification();
  }, [user, authLoading]);

  // Traer reservas al cargar el componente y cuando cambie 'user'
  useEffect(() => {
    fetchReservations();
  }, [user]);

  if (authLoading) {
    return <div className="text-center py-20">Cargando perfil...</div>;
  }
  if (!user && !authLoading) {
    navigate('/login', { replace: true });
    return <div className="text-center py-20">Redirigiendo a login...</div>;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Sesión Cerrada', description: 'Has cerrado sesión correctamente.' });
      navigate('/');
    } catch (error) {
      toast({ title: 'Error al Cerrar Sesión', description: error.message || 'No se pudo cerrar la sesión.', variant: 'destructive' });
    }
  };

  const handleSavePersonal = () => {
    setIsEditing(false);
    window.location.reload();
  };

  const handleResendVerificationEmail = async () => {
    if (!user?.email) {
      toast({ title: 'Error', description: 'No se pudo obtener tu correo.', variant: 'destructive' });
      return;
    }
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: user.email });
      if (error) throw error;
      toast({ title: 'Correo de Verificación Reenviado', description: 'Revisa tu bandeja de entrada.' });
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'No se pudo reenviar el correo.', variant: 'destructive' });
    }
  };

  // Función para eliminar reserva provisional
  const handleDeleteReservation = async (reservationId) => {
    const { error } = await supabase
      .from('camisetas')
      .delete()
      .eq('id', reservationId);
    if (error) {
      toast({ title: 'Error al Eliminar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Reserva Eliminada', description: 'Tu reserva provisional ha sido eliminada.' });
      fetchReservations();
    }
  };

  const isAdmin = user && user.role === 'admin';
const [editingId, setEditingId] = React.useState(null);
const [editablePunto, setEditablePunto] = React.useState('');
const handleSavePunto = async (id) => {
  if (!editablePunto) return;

  try {
    // Aquí actualiza en la base de datos, por ejemplo con Supabase
    const { error } = await supabase
      .from('camisetas')
      .update({ punto_recojida: editablePunto })
      .eq('id', id);

    if (error) throw error;

    // Actualiza localmente el estado de reservas para reflejar el cambio
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, punto_recojida: editablePunto } : res
      )
    );

    setEditingId(null);
    setEditablePunto('');
  } catch (error) {
    console.error('Error actualizando punto de recogida:', error.message);
    // Puedes mostrar un toast o mensaje de error aquí
  }
};

  return (
    <div className="py-12 space-y-12">
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="inline-block p-1 bg-primary/10 rounded-full mb-6 mx-auto">
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Perfil" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
              <User size={32} />
            </div>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">{user.fullName || user.email}</h1>
        <p className="text-lg text-muted-foreground">Gestiona tu información personal.</p>
      </motion.section>

      {!isEmailVerified && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-lg mx-auto">
          <Card className="bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400">
            <CardHeader>
              <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Correo no Verificado</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Por favor, verifica tu dirección de correo electrónico para acceder a todas las funcionalidades. Revisa tu bandeja de entrada (y spam).</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleResendVerificationEmail} variant="outline" className="border-yellow-600 hover:bg-yellow-500/20">Reenviar Correo de Verificación</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {isAdmin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-center">
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white futuristic-glow">
            <Link to="/admin/dashboard"><Settings size={20} className="mr-2" /> Panel de Administración</Link>
          </Button>
        </motion.div>
      )}

      {/* ─── TABS: Información, Reservas, Seguridad ───────────────── */}
      <div className="max-w-lg mx-auto border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            className={`px-3 py-2 font-medium text-sm ${
              selectedTab === 'info'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => {
              setSelectedTab('info');
              setIsEditing(false);
            }}
          >
            Mi Información
          </button>
          <button
            className={`px-3 py-2 font-medium text-sm ${
              selectedTab === 'reservas'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('reservas')}
          >
            Mis Reservas
          </button>
          <button
            className={`px-3 py-2 font-medium text-sm ${
              selectedTab === 'security'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('security')}
          >
            Seguridad
          </button>
        </nav>
      </div>

      {/* ─── CONTENIDO DE CADA PESTAÑA ──────────────────────────────── */}
      <div className="max-w-lg mx-auto">
        {/* Pestaña “Mi Información” */}
        {selectedTab === 'info' && (
          <Card className="card-themed">
            <CardHeader>
              <CardTitle className="text-2xl">Información Personal</CardTitle>
              <CardDescription className="text-muted-foreground">Tus datos de cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <EditPersonalForm
                  user={user}
                  onSave={handleSavePersonal}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <ProfileInfoDisplay user={user} onEdit={() => setIsEditing(true)} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Pestaña “Mis Reservas” */}
        {selectedTab === 'reservas' && (
          <Card className="card-themed">
            <CardHeader>
              <CardTitle className="text-2xl">Mis Reservas</CardTitle>
              <CardDescription className="text-muted-foreground">Tus reservas registradas.</CardDescription>
            </CardHeader>
         <CardContent className="space-y-4">
  {loadingReservations ? (
    <div className="text-center text-gray-500">Cargando reservas...</div>
  ) : reservations.length === 0 ? (
    <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center text-gray-500">
      No tienes reservas por el momento.
    </div>
  ) : (
    <ul className="space-y-4">
      {reservations.map((res) => {
        // Color según estado
        let estadoColor = 'text-red-600'; // reserva provisional
        if (res.estate === 'reserva pagada') estadoColor = 'text-orange-600';
        if (res.estate === 'recibida') estadoColor = 'text-green-600';

        return (
          <li
            key={res.id}
            className="flex items-center space-x-4 border border-gray-200 rounded-lg p-4"
          >
            {/* Miniatura del diseño */}
            <img
              src={designImagesMap[res.design]}
              alt={`Mini ${res.design}`}
              className="w-16 h-16 object-contain rounded"
            />

            <div className="flex-1">
              <p className="font-medium">{res.design}</p>
              <p className="text-sm text-gray-600">Talla: {res.talla}</p>
              <p className={`font-semibold ${estadoColor}`}>Estado: {res.estate}</p>
              <p className="text-xs text-gray-500">
                {new Date(res.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>

              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Punto de recogida:</label>

                {res.estate === 'reserva provisional' ? (
                  editingId === res.id ? (
                    <div className="flex items-center space-x-2 max-w-xs">
                      <select
                        className="border rounded px-2 py-1 flex-grow"
                        value={editablePunto}
                        onChange={(e) => setEditablePunto(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSavePunto(res.id);
                          }
                        }}
                        autoFocus
                      >
                        <option value="Crossfit Do-Box">Crossfit Do-Box</option>
                        <option value="Crossfit Torredembarra">Crossfit Torredembarra</option>
                        <option value="Wallapop">
                          Wallapop (soy individual, nos pondremos en contacto contigo)
                        </option>
                      </select>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        onClick={() => handleSavePunto(res.id)}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <p
                      className="cursor-pointer text-blue-600 hover:underline block"
                      onClick={() => {
                        setEditingId(res.id);
                        setEditablePunto(res.punto_recojida || '');
                      }}
                    >
                      {res.punto_recojida || 'Selecciona un punto de recogida'}
                    </p>
                  )
                ) : (
                  <p className="block">{res.punto_recojida || '-'}</p>
                )}
              </div>
            </div>

            {/* Botón Eliminar solo si está en reserva provisional */}
            {res.estate === 'reserva provisional' && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteReservation(res.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  )}
</CardContent>


           <CardFooter>
          <div className="text-sm text-gray-700 space-y-2">
            <p className="font-semibold">¿Qué significa “reserva provisional”?</p>
            <p>
              •{' '}
              <span className="font-medium text-red-600">reserva provisional:</span>{' '}
              Aún no has completado el pago. Una vez hayas pagado correctamente,
              tu reserva pasará a{' '}
              <span className="text-orange-600 font-medium">reserva pagada</span>.
            </p>
            <p>
              •{' '}
              <span className="font-medium text-orange-600">reserva pagada:</span>{' '}
              El pago ha sido recibido. Estamos preparándola para enviártela{' '}
              <span className="text-green-600 font-medium">recibida</span>.
            </p>
            <p>
              •{' '}
              <span className="font-medium text-green-600">recibida:</span>{' '}
              Ya has recibido tu camiseta
            </p>
            <p className="font-semibold mx-10">MÁS INFORMACION SOBRE EL FUNCIONAMIENTO</p>
            <p>
              •{' '}
              <Link
                to="/"
                state={{ scrollTo: 'funcionamiento' }}
                className="text-blue-600 hover:underline"
              >
                FUNCIONAMIENTO
              </Link>
            </p>
          </div>

    
        </CardFooter>

          </Card>
        )}

        {/* Pestaña “Seguridad” */}
        {selectedTab === 'security' && (
          <Card className="card-themed">
            <CardHeader>
              <CardTitle className="text-2xl">Seguridad</CardTitle>
              <CardDescription className="text-muted-foreground">Cambia tu contraseña.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm user={user} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Botón de Cerrar Sesión */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center mt-12"
      >
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="lg"
          className="button-destructive-themed futuristic-glow"
        >
          <LogOut size={18} className="mr-2" /> Cerrar Sesión
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
