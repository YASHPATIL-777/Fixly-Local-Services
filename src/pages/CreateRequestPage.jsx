import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Check
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import { getTechnicianById } from '../services/technicianService';
import { createServiceRequest } from '../services/requestService';
import ImageUploader from '../components/common/ImageUploader';

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM'
];

export default function CreateRequestPage() {
  const { technicianId } = useParams();
  const navigate = useNavigate();

  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('05:00 PM');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Thane');
  const [postalCode, setPostalCode] = useState('400601');
  const [selectedImages, setSelectedImages] = useState([]);

  // Step Review state
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Review

  const todayIso = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTech = async () => {
      setLoading(true);
      try {
        const res = await getTechnicianById(technicianId);
        const techData = res.data;
        setTechnician(techData);

        if (techData.serviceIds && techData.serviceIds.length > 0) {
          const firstSvc = techData.serviceIds[0];
          setSelectedServiceId(typeof firstSvc === 'object' ? firstSvc._id : firstSvc);
        }
      } catch (err) {
        console.error('Fetch technician error:', err.message);
        setErrorMessage('Failed to load technician profile. Please try selecting professional again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, [technicianId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMessage('');
    setSubmitting(true);

    try {
      // Find valid serviceId from selected service or technician serviceIds array
      let validServiceId = selectedServiceId;
      if (!validServiceId && technician?.serviceIds && technician.serviceIds.length > 0) {
        const firstSvc = technician.serviceIds[0];
        validServiceId = typeof firstSvc === 'object' ? firstSvc._id : firstSvc;
      }

      if (!validServiceId) {
        throw new Error('Please select a valid service category for your request');
      }

      const realTechId = technician?._id || technicianId;

      if (import.meta.env.DEV) {
        console.log('[CreateRequest Payload Debug]', {
          technicianId: realTechId,
          serviceId: validServiceId,
          problemTitle: problemTitle.trim(),
          serviceDate,
          serviceTime,
          imagesCount: selectedImages.length
        });
      }

      const formData = new FormData();
      formData.append('technicianId', realTechId);
      formData.append('serviceId', validServiceId);
      formData.append('problemTitle', problemTitle.trim());
      formData.append('problemDescription', problemDescription.trim());
      formData.append('serviceDate', serviceDate);
      formData.append('serviceTime', serviceTime);
      formData.append('address', address.trim());
      formData.append('city', city.trim());
      formData.append('postalCode', postalCode.trim());

      selectedImages.forEach((file) => {
        formData.append('images', file);
      });

      const res = await createServiceRequest(formData);
      setSuccessMessage(`Service request sent successfully! ${technician?.userId?.name || technician?.name || 'Professional'} will review your request.`);

      setTimeout(() => {
        navigate('/customer/requests');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit service request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center space-x-3 text-slate-500 text-sm">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <span>Loading service request details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  const techName = technician?.userId?.name || technician?.name || 'Rahul Kumar';
  const isAvailable = technician?.availability !== false;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* Top Header */}
        <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Link to={`/technicians/${technicianId}`} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Professional Profile
            </Link>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Request Service from {techName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Describe your repair or maintenance problem and select your preferred service schedule.
            </p>
          </div>
        </div>

        {/* Form Workspace */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          
          {/* Selected Technician Card Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img 
                src={technician?.profileImage || technician?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250'} 
                alt={techName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{techName}</h3>
                <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded bg-blue-50 text-blue-700 border border-blue-100">
                  {technician?.serviceCategory || 'Service Professional'}
                </span>
                <p className="text-xs text-slate-500 font-medium">{technician?.location} • {technician?.hourlyRate || '₹800 – ₹1,200'}</p>
              </div>
            </div>

            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
              isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {isAvailable ? '🟢 Available for Requests' : '🔴 Currently Unavailable'}
            </span>
          </div>

          {/* Unavailable Notice */}
          {!isAvailable ? (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-800 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-lg font-bold">Technician Currently Unavailable</h3>
              <p className="text-xs text-amber-700">
                {techName} is not accepting new service requests at this time. Please try again later or choose another professional.
              </p>
              <Link to="/technicians" className="inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs">
                Browse Available Professionals
              </Link>
            </div>
          ) : (
            <>
              {/* Error / Success Notifications */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center space-x-2 mb-6"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span className="font-semibold">{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3 mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-xl font-bold text-emerald-900">Service Request Submitted!</h3>
                    <p className="text-xs text-emerald-700">{successMessage}</p>
                    <p className="text-xs text-slate-500">Redirecting to your requests portal...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Multi-Step Request Form */}
              {!successMessage && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  
                  {/* Step Progress Tabs */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-blue-600' : 'text-slate-400'}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                      <span>Enter Request Details</span>
                    </button>
                    <span className="text-slate-300">→</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-blue-600' : 'text-slate-400'}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                      <span>Review & Submit</span>
                    </button>
                  </div>

                  {currentStep === 1 ? (
                    <div className="space-y-5 text-xs">
                      
                      {/* Offered Service Category */}
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Select Service Category</label>
                        <select
                          value={selectedServiceId}
                          onChange={(e) => setSelectedServiceId(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                        >
                          {technician?.serviceIds && technician.serviceIds.length > 0 ? (
                            technician.serviceIds.map((s) => (
                              <option key={s._id || s.slug} value={s._id || s.slug}>
                                {s.name}
                              </option>
                            ))
                          ) : (
                            <option value="6a7b25b9f63ab23f615ffd72">{technician?.serviceCategory || 'Plumbing Service'}</option>
                          )}
                        </select>
                      </div>

                      {/* Problem Title & Description */}
                      <div className="space-y-4">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Problem Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Kitchen sink drain leakage and tap repair"
                            value={problemTitle}
                            onChange={(e) => setProblemTitle(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Detailed Problem Description</label>
                          <textarea
                            rows="3"
                            required
                            placeholder="Describe what needs repair, symptoms, any specific tools or parts required..."
                            value={problemDescription}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                          ></textarea>
                        </div>
                      </div>

                      {/* Problem Image Upload */}
                      <div className="pt-2 border-t border-slate-100">
                        <ImageUploader
                          selectedFiles={selectedImages}
                          setSelectedFiles={setSelectedImages}
                        />
                      </div>

                      {/* Date & Time Slot */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Preferred Date</label>
                          <input
                            type="date"
                            required
                            min={todayIso}
                            value={serviceDate}
                            onChange={(e) => setServiceDate(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Preferred Time Slot</label>
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.slice(0, 6).map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setServiceTime(slot)}
                                className={`py-2 rounded-lg font-bold text-[11px] transition-colors border ${
                                  serviceTime === slot
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Address, City, Postal Code */}
                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Street Address</label>
                          <input
                            type="text"
                            required
                            placeholder="Building name, flat number, street..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">City / Location</label>
                            <input
                              type="text"
                              required
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-800 mb-1">Postal Code</label>
                            <input
                              type="text"
                              required
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          disabled={!problemTitle || !problemDescription || !serviceDate || !address}
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Review Request →
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Step 2: Final Review Summary */
                    <div className="space-y-6 text-xs">
                      <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">Review Service Request Summary</h3>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 font-medium">Professional:</span>
                          <span className="font-bold text-slate-900">{techName}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 font-medium">Problem:</span>
                          <span className="font-bold text-slate-900">{problemTitle}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 font-medium">Scheduled Date & Time:</span>
                          <span className="font-bold text-slate-900">{serviceDate} at {serviceTime}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 font-medium">Service Address:</span>
                          <span className="font-bold text-slate-900">{address}, {city} ({postalCode})</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 font-medium">Attached Problem Photos:</span>
                          <span className="font-bold text-blue-600">{selectedImages.length} {selectedImages.length === 1 ? 'photo' : 'photos'} attached</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Estimated Rate Range:</span>
                          <span className="font-extrabold text-emerald-600">{technician?.hourlyRate || '₹800 – ₹1,200'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                        >
                          ← Edit Details
                        </button>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{selectedImages.length > 0 ? 'Uploading photos & submitting...' : 'Creating your service request...'}</span>
                            </>
                          ) : (
                            <>
                              <span>Send Service Request</span>
                              <Check className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </form>
              )}
            </>
          )}

        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
