import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminDashboardPage = () => {
  const [reservations, setReservations] = useState([]);
  const [allProfiles, setAllProfiles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone');

      if (profilesError) throw profilesError;
      
      const profilesMap = profilesData.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
      setAllProfiles(profilesMap);

      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (reservationsError) throw reservationsError;
      setReservations(reservationsData);

    } catch (error) {
      toast({ title: "Error cargando datos", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleUpdateStatus = async (reservationId, status) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', reservationId);

      if (error) throw error;

      toast({ title: "Estado actualizado", description: "La reserva ha sido actualizada." });
      setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: status } : r));
      setEditingReservationId(null);
      setNewStatus('');
    } catch (error) {
      toast({ title: "Error actualizando estado", description: error.message, variant: "destructive" });
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const userProfile = allProfiles[reservation.user_id];
    if (!userProfile) return false;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      userProfile.full_name?.toLowerCase().includes(searchTermLower) ||
      userProfile.email?.toLowerCase().includes(searchTermLower) ||
      userProfile.phone?.toLowerCase().includes(searchTermLower) ||
      reservation.design?.toLowerCase().includes(searchTermLower) ||
      reservation.status?.toLowerCase().includes(searchTermLower)
    );
  });

  const getStatusColorClasses = (status) => {
    switch (status) {
      case 'Reserva provisional': return 'bg-red-100 text-red-800 border-red-300';
      case 'Reserva pagada': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Recibida': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusOptions = ['Reserva provisional', 'Reserva pagada', 'Recibida'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando panel de administrador...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-6 md:p-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Panel de Administrador</h1>
          
          <div className="mb-6">
            <Input 
              type="text"
              placeholder="Buscar por nombre, email, teléfono, diseño o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400" />}
              className="max-w-lg"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 font-semibold text-gray-600 border-b">Cliente</th>
                  <th className="p-3 font-semibold text-gray-600 border-b">Contacto</th>
                  <th className="p-3 font-semibold text-gray-600 border-b">Diseño</th>
                  <th className="p-3 font-semibold text-gray-600 border-b">Talla</th>
                  <th className="p-3 font-semibold text-gray-600 border-b">Cantidad</th>
                  <th className="p-3 font-semibold text-gray-600 border-b">Estado</th>
                  <th className="p-3 font-semibold text-gray-600 border-b">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map(reservation => {
                  const user = allProfiles[reservation.user_id];
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50 border-b">
                      <td className="p-3">
                        <p className="font-medium">{user?.full_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'N/A'}</p>
                      </td>
                      <td className="p-3">{user?.phone || 'N/A'}</td>
                      <td className="p-3">{reservation.design}</td>
                      <td className="p-3">{reservation.size}</td>
                      <td className="p-3">{reservation.quantity}</td>
                      <td className="p-3">
                        {editingReservationId === reservation.id ? (
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className={`w-full text-xs ${getStatusColorClasses(newStatus)}`}>
                              <SelectValue placeholder="Cambiar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(opt => (
                                <SelectItem key={opt} value={opt} className={`text-xs ${getStatusColorClasses(opt)}`}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClasses(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {editingReservationId === reservation.id ? (
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleUpdateStatus(reservation.id, newStatus)} className="bg-green-500 hover:bg-green-600 text-white text-xs">Guardar</Button>
                            <Button size="sm" variant="outline" onClick={() => {setEditingReservationId(null); setNewStatus('');}} className="text-xs">Cancelar</Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingReservationId(reservation.id);
                              setNewStatus(reservation.status);
                            }}
                            className="text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" /> Cambiar Estado
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredReservations.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8">No se encontraron reservas con los criterios de búsqueda.</p>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;