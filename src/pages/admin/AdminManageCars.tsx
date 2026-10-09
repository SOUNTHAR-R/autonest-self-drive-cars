import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Car,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Vehicle, VehicleCategory } from '../../types';

export const AdminManageCars: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, updateCarStatus, deleteVehicle, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [publishedFilter, setPublishedFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal state
  const [deleteModalCar, setDeleteModalCar] = useState<Vehicle | null>(null);

  const categories: VehicleCategory[] = [
    'All',
    'Hatchback',
    'Sedan',
    'SUV',
    'MUV / MPV',
    'Luxury',
    'Premium',
    'Electric',
    'Other'
  ];

  // Filtering & Sorting
  const filteredCars = useMemo(() => {
    return vehicles
      .filter((car) => !car.archivedAt)
      .filter((car) => {
        if (categoryFilter !== 'All' && car.category !== categoryFilter) return false;
        if (availabilityFilter !== 'All') {
          const isAvail = car.availabilityStatus === 'Available' || car.available === true;
          if (availabilityFilter === 'Available' && !isAvail) return false;
          if (availabilityFilter === 'Unavailable' && isAvail) return false;
        }
        if (publishedFilter !== 'All') {
          const isPub = car.isPublished !== false;
          if (publishedFilter === 'Published' && !isPub) return false;
          if (publishedFilter === 'Draft' && isPub) return false;
        }
        if (search) {
          const q = search.toLowerCase();
          const matchName = car.name.toLowerCase().includes(q);
          const matchBrand = car.brand.toLowerCase().includes(q);
          const matchModel = car.model.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchModel) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return (a.dailyPrice || 0) - (b.dailyPrice || 0);
        if (sortBy === 'date') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        return a.name.localeCompare(b.name);
      });
  }, [vehicles, search, categoryFilter, availabilityFilter, publishedFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage) || 1;
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTogglePublished = async (car: Vehicle) => {
    const nextPublished = !(car.isPublished !== false);
    await updateCarStatus(car.id, { isPublished: nextPublished });
    showToast(`Vehicle ${car.name} set to ${nextPublished ? 'Published' : 'Draft'}`, 'info');
  };

  const handleToggleAvailable = async (car: Vehicle) => {
    const currentStatus = car.availabilityStatus || (car.available ? 'Available' : 'Unavailable');
    const nextStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
    await updateCarStatus(car.id, { availabilityStatus: nextStatus });
    showToast(`Vehicle ${car.name} status updated to ${nextStatus}`, 'info');
  };

  const confirmDelete = async () => {
    if (!deleteModalCar) return;
    await deleteVehicle(deleteModalCar.id);
    setDeleteModalCar(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">FLEET MANAGEMENT</span>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">MANAGE VEHICLES</h1>
          <p className="text-xs text-zinc-400">Add, edit, publish, or toggle availability for public Autonest cars</p>
        </div>

        <button
          onClick={() => navigate('/admin/cars/new')}
          className="px-5 py-3 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/30 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Vehicle
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-[#12141d] p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search brand, model..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#090a0f] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e63946]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#090a0f] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#090a0f] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
          >
            <option value="All">Availability: All</option>
            <option value="Available">Available Only</option>
            <option value="Unavailable">Unavailable Only</option>
          </select>

          {/* Publication Filter */}
          <select
            value={publishedFilter}
            onChange={(e) => {
              setPublishedFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#090a0f] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
          >
            <option value="All">Status: All</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Draft Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#090a0f] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="price">Sort: Price (Low-High)</option>
            <option value="date">Sort: Newest First</option>
          </select>

        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#12141d] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        {paginatedCars.length > 0 ? (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider bg-[#090a0f]/50">
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Transmission / Fuel</th>
                <th className="py-3.5 px-4">Daily Rate</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4">Publication</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              {paginatedCars.map((car) => {
                const isPublished = car.isPublished !== false;
                const isAvail = car.availabilityStatus === 'Available' || car.available === true;

                return (
                  <tr key={car.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* Vehicle info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images[0]}
                          alt={car.name}
                          className="w-12 h-9 object-cover rounded-lg border border-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{car.brand} {car.model}</p>
                          <p className="text-[10px] text-zinc-400">{car.variant || car.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 text-zinc-300 font-semibold border border-white/10">
                        {car.category}
                      </span>
                    </td>

                    {/* Transmission / Fuel */}
                    <td className="py-3.5 px-4 text-zinc-300">
                      {car.transmission} • {car.fuelType}
                    </td>

                    {/* Daily Rate */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      {car.dailyPrice > 0 ? `₹${car.dailyPrice.toLocaleString()} / day` : 'Price on request'}
                    </td>

                    {/* Availability toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAvailable(car)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-colors ${
                          isAvail
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isAvail ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isAvail ? 'Available' : 'Unavailable'}</span>
                      </button>
                    </td>

                    {/* Publication Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublished(car)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-colors ${
                          isPublished
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/cars/${car.id}`)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg"
                          title="View Public Card"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                          className="p-1.5 text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg"
                          title="Edit Vehicle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteModalCar(car)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Car className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No vehicles match the selected filters.</p>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {paginatedCars.map((car) => (
          <div key={car.id} className="bg-[#12141d] p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <img src={car.images[0]} alt={car.name} className="w-16 h-12 object-cover rounded-xl border border-white/10" />
              <div>
                <h4 className="text-sm font-bold text-white">{car.brand} {car.model}</h4>
                <p className="text-xs text-[#e63946] font-bold">
                  {car.dailyPrice > 0 ? `₹${car.dailyPrice.toLocaleString()} / day` : 'Price on request'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
              <span className="text-zinc-400">{car.category} • {car.transmission}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                  className="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModalCar(car)}
                  className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs text-zinc-400">
          <span>Showing {paginatedCars.length} of {filteredCars.length} cars</span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg bg-[#12141d] border border-white/10 text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg bg-[#12141d] border border-white/10 text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12141d] rounded-3xl p-6 max-w-sm w-full border border-rose-500/30 space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-xl font-black font-heading text-white">Delete Vehicle?</h3>
            <p className="text-xs text-zinc-400">
              Are you sure you want to remove <strong className="text-white">{deleteModalCar.brand} {deleteModalCar.model}</strong> from the fleet? If this car has associated bookings, it will be safely archived instead of losing record history.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteModalCar(null)}
                className="py-2.5 rounded-xl bg-[#090a0f] border border-white/10 text-zinc-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
