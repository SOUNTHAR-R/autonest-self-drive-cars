import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UploadCloud,
  Check,
  X,
  Star,
  ArrowRight,
  ArrowLeft,
  Eye,
  AlertCircle,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from '../../components/common/VehicleCard';
import { api } from '../../services/api';
import type { Vehicle, VehicleCategory, TransmissionType, FuelType, AvailabilityStatus } from '../../types';

export const AdminCarForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { vehicles, addVehicle, updateVehicle, showToast } = useApp();

  const isEditing = Boolean(id);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [category, setCategory] = useState<VehicleCategory>('Hatchback');
  const [description, setDescription] = useState('');

  // Images State
  const [images, setImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);

  // Specifications State
  const [transmission, setTransmission] = useState<TransmissionType>('Manual');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [seats, setSeats] = useState<number>(5);
  const doors = 4;
  const [engineCapacity, setEngineCapacity] = useState('1197 cc');
  const [mileageRange, setMileageRange] = useState('22 kmpl');
  const [airConditioning, setAirConditioning] = useState(true);
  const powerSteering = true;
  const infotainmentSystem = true;
  const [bluetooth, setBluetooth] = useState(true);
  const [rearCamera, setRearCamera] = useState(true);
  const parkingSensors = true;
  const [abs, setAbs] = useState(true);
  const [additionalFeatures, setAdditionalFeatures] = useState<string>('Touchscreen, Keyless Entry, Push Start');

  // Pricing State
  const [dailyPrice, setDailyPrice] = useState<number>(1800);
  const [hourlyPrice, setHourlyPrice] = useState<number>(150);
  const [weekendPrice, setWeekendPrice] = useState<number>(2200);
  const weeklyRate = 11500;
  const monthlyRate = 38000;
  const [deposit, setDeposit] = useState<number>(3000);
  const [includedKm, setIncludedKm] = useState('250 km / day');
  const [extraKmCharge, setExtraKmCharge] = useState('₹12 / km');
  const minRentalDuration = '24 Hours';

  // Availability State
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('Available');
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Load existing data if editing
  useEffect(() => {
    if (id) {
      const existing = vehicles.find((v) => v.id === id);
      if (existing) {
        setName(existing.name);
        setBrand(existing.brand);
        setModel(existing.model);
        setVariant(existing.variant || '');
        setYear(existing.year);
        setCategory(existing.category);
        setDescription(existing.description || '');
        setImages(existing.images || []);
        setTransmission(existing.transmission || 'Manual');
        setFuelType(existing.fuelType || 'Petrol');
        setSeats(existing.seats || 5);
        setDailyPrice(existing.dailyPrice || 1800);
        setHourlyPrice(existing.hourlyPrice || 150);
        setWeekendPrice(existing.weekendPrice || 2200);
        setDeposit(existing.deposit || 3000);
        setIncludedKm(existing.kilometerAllowance || '250 km / day');
        setExtraKmCharge(existing.extraKmCharge || '₹12 / km');
        setAvailabilityStatus(existing.availabilityStatus || (existing.available ? 'Available' : 'Unavailable'));
        setIsPublished(existing.isPublished !== false);
        if (existing.specifications?.additionalFeatures) {
          setAdditionalFeatures(existing.specifications.additionalFeatures.join(', '));
        }
      }
    }
  }, [id, vehicles]);

  // File Upload Handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');
    setUploading(true);

    const validFiles: File[] = [];
    const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!allowedExtensions.includes(f.type.toLowerCase())) {
        setErrorMsg(`Invalid file type: ${f.name}. Only JPG, JPEG, PNG, and WebP are allowed.`);
        setUploading(false);
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setErrorMsg(`File too large: ${f.name} exceeds 10MB.`);
        setUploading(false);
        return;
      }
      validFiles.push(f);
    }

    try {
      const uploadedUrls = await api.uploadImages(validFiles);
      setImages((prev) => [...prev, ...uploadedUrls]);
      showToast(`${validFiles.length} image(s) uploaded successfully`, 'success');
    } catch (err: any) {
      // Local object URL fallback
      const localUrls = validFiles.map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...localUrls]);
      showToast('Images added to preview', 'info');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex >= index && coverIndex > 0) setCoverIndex(coverIndex - 1);
  };

  const makeCoverImage = (index: number) => {
    setCoverIndex(index);
    const selected = images[index];
    const reordered = [selected, ...images.filter((_, i) => i !== index)];
    setImages(reordered);
    setCoverIndex(0);
    showToast('Cover image updated', 'info');
  };

  // Form Submit Handler
  const handleSubmit = async (publishState: boolean) => {
    if (!name || !brand || !model || !category) {
      setErrorMsg('Please fill in Display Name, Brand, Model, and Category.');
      setActiveStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const finalImages = images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ];

    const parsedFeatures = additionalFeatures
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const carData: Partial<Vehicle> = {
      name,
      brand,
      model,
      variant,
      year: Number(year),
      category,
      description,
      images: finalImages,
      dailyPrice: Number(dailyPrice),
      hourlyPrice: Number(hourlyPrice),
      weekendPrice: Number(weekendPrice),
      deposit: Number(deposit),
      kilometerAllowance: includedKm,
      extraKmCharge,
      seats: Number(seats),
      transmission,
      fuelType,
      features: parsedFeatures,
      location: 'Thoraipakkam, Chennai',
      available: availabilityStatus === 'Available',
      availabilityStatus,
      isPublished: publishState,
      specifications: {
        transmission,
        fuelType,
        seatingCapacity: Number(seats),
        doors: Number(doors),
        engineCapacity,
        mileageRange,
        airConditioning,
        powerSteering,
        infotainmentSystem,
        bluetooth,
        rearCamera,
        parkingSensors,
        abs,
        additionalFeatures: parsedFeatures
      },
      pricing: {
        hourlyRate: Number(hourlyPrice),
        dailyRate: Number(dailyPrice),
        weekendRate: Number(weekendPrice),
        weeklyRate: Number(weeklyRate),
        monthlyRate: Number(monthlyRate),
        securityDeposit: Number(deposit),
        includedKm,
        extraKmCharge,
        minRentalDuration
      }
    };

    try {
      if (isEditing && id) {
        await updateVehicle(id, carData);
      } else {
        await addVehicle(carData);
      }
      navigate('/admin/cars');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview Object
  const previewCar: Vehicle = {
    id: id || 'preview',
    name: name || 'Swift ZXi',
    brand: brand || 'Maruti Suzuki',
    model: model || 'Swift',
    variant: variant || 'ZXi',
    year: Number(year) || 2024,
    category: category || 'Hatchback',
    dailyPrice: Number(dailyPrice) || 0,
    hourlyPrice: Number(hourlyPrice),
    weekendPrice: Number(weekendPrice),
    deposit: Number(deposit),
    kilometerAllowance: includedKm,
    extraKmCharge,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
    seats: Number(seats) || 5,
    transmission: transmission || 'Manual',
    fuelType: fuelType || 'Petrol',
    features: additionalFeatures.split(',').map((f) => f.trim()).filter(Boolean),
    location: 'Thoraipakkam, Chennai',
    available: availabilityStatus === 'Available',
    description: description || 'Self-drive vehicle available at Autonest Chennai.'
  };

  const steps = [
    { num: 1, name: 'Basic Details' },
    { num: 2, name: 'Vehicle Images' },
    { num: 3, name: 'Specifications' },
    { num: 4, name: 'Rental Pricing' },
    { num: 5, name: 'Availability' },
    { num: 6, name: 'Review & Live Preview' }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">AUTONEST FLEET EDITOR</span>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">
            {isEditing ? 'EDIT VEHICLE' : 'ADD NEW VEHICLE'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/cars')}
            className="px-4 py-2.5 rounded-xl bg-[#12141d] border border-white/10 text-zinc-300 hover:text-white text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-[#191c28] border border-white/20 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/30 flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" /> {isEditing ? 'Update Vehicle' : 'Publish Car'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-3">
        {steps.map((step) => (
          <button
            key={step.num}
            onClick={() => setActiveStep(step.num)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeStep === step.num
                ? 'bg-[#e63946] text-white shadow-lg shadow-[#e63946]/25'
                : 'bg-[#12141d] border border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">
              {step.num}
            </span>
            <span>{step.name}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: BASIC DETAILS */}
      {activeStep === 1 && (
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-base font-black font-heading text-white uppercase">Step 1: Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Display Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Swift ZXi Dual Tone"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Car Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              >
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MUV / MPV">MUV / MPV</option>
                <option value="Luxury">Luxury</option>
                <option value="Premium">Premium</option>
                <option value="Electric">Electric</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Brand *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Maruti Suzuki, Hyundai"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Model *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Swift, Creta"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Variant</label>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="e.g. ZXi, SX (O)"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Manufacturing Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-bold block mb-1 text-xs">Short Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe vehicle features, comfort level, and ideal journey types..."
              className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="px-6 py-3 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Next: Images</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VEHICLE IMAGES UPLOAD */}
      {activeStep === 2 && (
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-base font-black font-heading text-white uppercase">Step 2: Vehicle Image Gallery</h3>

          {/* Drag & Drop Upload Container */}
          <div className="border-2 border-dashed border-white/20 hover:border-[#e63946] rounded-3xl p-8 text-center space-y-3 transition-colors bg-[#090a0f]/50 relative">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <UploadCloud className="w-12 h-12 text-[#e63946] mx-auto" />
            <div>
              <p className="text-sm font-bold text-white">Drag & Drop Vehicle Images Here</p>
              <p className="text-xs text-zinc-400 mt-1">or click to browse from device (JPG, PNG, WebP up to 10MB)</p>
            </div>
            {uploading && (
              <div className="w-full bg-white/10 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                <div className="bg-[#e63946] h-full w-2/3 animate-pulse" />
              </div>
            )}
          </div>

          {/* Image Previews Grid */}
          <div>
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Uploaded Images ({images.length})</h4>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-[#090a0f]">
                    <img src={img} alt={`Vehicle ${idx}`} className="w-full h-full object-cover" />
                    
                    {idx === coverIndex && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#e63946] text-white text-[9px] font-bold uppercase tracking-wider shadow">
                        Cover Image
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => makeCoverImage(idx)}
                        className="p-1.5 rounded-lg bg-amber-500 text-black font-bold text-[10px]"
                        title="Set as Cover Image"
                      >
                        <Star className="w-3.5 h-3.5 fill-black" />
                      </button>
                      <button
                        onClick={() => removeImage(idx)}
                        className="p-1.5 rounded-lg bg-rose-600 text-white font-bold text-[10px]"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-[#090a0f] rounded-2xl border border-white/5 text-xs text-zinc-500">
                No images uploaded yet. A fallback image will be displayed if left empty.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveStep(1)}
              className="px-6 py-3 rounded-xl bg-[#090a0f] text-zinc-300 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Next: Specifications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TECHNICAL SPECIFICATIONS */}
      {activeStep === 3 && (
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-base font-black font-heading text-white uppercase">Step 3: Technical Specifications</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Seating Capacity</label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Engine Capacity</label>
              <input
                type="text"
                value={engineCapacity}
                onChange={(e) => setEngineCapacity(e.target.value)}
                placeholder="e.g. 1197 cc"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Mileage / Range</label>
              <input
                type="text"
                value={mileageRange}
                onChange={(e) => setMileageRange(e.target.value)}
                placeholder="e.g. 22.3 kmpl"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Standard Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 bg-[#090a0f] p-3 rounded-xl border border-white/5 cursor-pointer">
                <input type="checkbox" checked={airConditioning} onChange={(e) => setAirConditioning(e.target.checked)} />
                <span className="text-white">Air Conditioning</span>
              </label>

              <label className="flex items-center gap-2 bg-[#090a0f] p-3 rounded-xl border border-white/5 cursor-pointer">
                <input type="checkbox" checked={bluetooth} onChange={(e) => setBluetooth(e.target.checked)} />
                <span className="text-white">Bluetooth System</span>
              </label>

              <label className="flex items-center gap-2 bg-[#090a0f] p-3 rounded-xl border border-white/5 cursor-pointer">
                <input type="checkbox" checked={rearCamera} onChange={(e) => setRearCamera(e.target.checked)} />
                <span className="text-white">Rear Camera</span>
              </label>

              <label className="flex items-center gap-2 bg-[#090a0f] p-3 rounded-xl border border-white/5 cursor-pointer">
                <input type="checkbox" checked={abs} onChange={(e) => setAbs(e.target.checked)} />
                <span className="text-white">ABS Safety</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-bold block mb-1 text-xs">Additional Features (comma-separated)</label>
            <input
              type="text"
              value={additionalFeatures}
              onChange={(e) => setAdditionalFeatures(e.target.value)}
              placeholder="Sunroof, Touchscreen, Cruise Control..."
              className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#e63946]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveStep(2)}
              className="px-6 py-3 rounded-xl bg-[#090a0f] text-zinc-300 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="px-6 py-3 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Next: Rental Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RENTAL PRICING */}
      {activeStep === 4 && (
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-base font-black font-heading text-white uppercase">Step 4: Rental Pricing Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Daily Rate (₹) *</label>
              <input
                type="number"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Set 0 to display "Price on request"</p>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Hourly Rate (₹)</label>
              <input
                type="number"
                value={hourlyPrice}
                onChange={(e) => setHourlyPrice(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Weekend Rate (₹)</label>
              <input
                type="number"
                value={weekendPrice}
                onChange={(e) => setWeekendPrice(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Refundable Security Deposit (₹)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Included Kilometres</label>
              <input
                type="text"
                value={includedKm}
                onChange={(e) => setIncludedKm(e.target.value)}
                placeholder="e.g. 250 km / day"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Extra KM Charge</label>
              <input
                type="text"
                value={extraKmCharge}
                onChange={(e) => setExtraKmCharge(e.target.value)}
                placeholder="e.g. ₹12 / km"
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 rounded-xl bg-[#090a0f] text-zinc-300 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setActiveStep(5)}
              className="px-6 py-3 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Next: Availability</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: AVAILABILITY & STATUS */}
      {activeStep === 5 && (
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-base font-black font-heading text-white uppercase">Step 5: Availability & Publication Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-bold block mb-1">Current Fleet Status</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              >
                <option value="Available">Available for Rent</option>
                <option value="Unavailable">Unavailable / Reserved</option>
                <option value="Maintenance">Under Maintenance</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1">Public Website Visibility</label>
              <select
                value={isPublished ? 'Published' : 'Draft'}
                onChange={(e) => setIsPublished(e.target.value === 'Published')}
                className="w-full bg-[#090a0f] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e63946]"
              >
                <option value="Published">Published (Visible on Public Website)</option>
                <option value="Draft">Draft (Admin Only)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveStep(4)}
              className="px-6 py-3 rounded-xl bg-[#090a0f] text-zinc-300 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setActiveStep(6)}
              className="px-6 py-3 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Next: Live Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: REVIEW & LIVE INTERACTIVE PREVIEW */}
      {activeStep === 6 && (
        <div className="bg-[#12141d] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black font-heading text-white uppercase">Step 6: Live Public Card Preview</h3>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Interactive Public View
            </span>
          </div>

          <div className="max-w-md mx-auto">
            <VehicleCard vehicle={previewCar} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveStep(5)}
              className="px-6 py-3 rounded-xl bg-[#090a0f] text-zinc-300 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-xl bg-[#191c28] border border-white/20 text-white text-xs font-bold"
              >
                Save Draft
              </button>

              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e63946]/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Publish Car Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
