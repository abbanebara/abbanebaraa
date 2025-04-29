"use client";

import React, { useState, ChangeEvent, DragEvent, useMemo } from 'react';
import { Eye, EyeOff, X, Search } from 'lucide-react';

// Types
type City = keyof typeof algeriaCities;
interface FilePreview {
  name: string;
  size: number;
}

interface FormErrors {
  companyName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  city?: string;
  daira?: string;
  address?: string;
  specialization?: string;
  category?: string;
}

// Data
const algeriaCities = {
  "Adrar": ["Adrar", "Aoulef", "Timimoun", "Reggane", "Tsabit", "Zaouiet Kounta", "Fenoughil", "Bordj Badji Mokhtar"],
  "Chlef": ["Chlef", "Oued Fodda", "Taougrit", "Beni Haoua", "Abou El Hassan", "Ténès", "Ouled Fares", "Zeboudja", "El Karimia"],
  "Laghouat": ["Laghouat", "Aflou", "Brida", "Ksar El Hirane", "Hassi R'Mel", "Oued Morra"],
  "Oum El Bouaghi": ["Oum El Bouaghi", "Ain Beida", "Ain M'Lila", "Ksar Sbahi", "Meskiana", "F'kirina", "Ain Babouche"],
  "Batna": ["Batna", "Barika", "Merouana", "Arris", "N'Gaous", "Ain Djasser", "Tazoult", "Timgad", "El Madher", "Ras El Aioun", "Seriana"],
  "Béjaïa": ["Béjaïa", "Akbou", "Amizour", "Adekar", "Kherrata", "Tichy", "Sidi Aich", "El Kseur", "Souk El Tenine"],
  "Biskra": ["Biskra", "Tolga", "Ourlal", "Sidi Okba", "El Kantara", "Djemorah", "Zeribet El Oued"],
  "Béchar": ["Béchar", "Kenadsa", "Taghit", "Igli", "Lahmar"],
  "Blida": ["Blida", "Boufarik", "El Affroun", "Meftah", "Mouzaia", "Oued El Alleug"],
  "Bouira": ["Bouira", "Lakhdaria", "Sour El Ghozlane", "Bechloul", "M'Chedallah", "Bordj Okhriss"],
  "Tamanrasset": ["Tamanrasset", "In Salah", "In Guezzam", "Abalessa"],
  "Tébessa": ["Tébessa", "Bir El Ater", "Cheria", "El Kouif", "Ouenza", "Morsott", "Oum Ali"],
  "Tlemcen": ["Tlemcen", "Maghnia", "Ghazaouet", "Hennaya", "Remchi", "Sebdou"],
  "Tiaret": ["Tiaret", "Frenda", "Sougueur", "Mahdia", "Ksar Chellala", "Aïn Kermes"],
  "Tizi Ouzou": ["Tizi Ouzou", "Azazga", "Bouzeguene", "Draâ El Mizan", "Ain El Hammam", "Boghni"],
  "Algiers": ["Bab El Oued", "Bir Mourad Rais", "Dar El Beïda", "Rouïba", "Zeralda", "El Harrach"],
  "Djelfa": ["Djelfa", "Messaad", "Hassi Bahbah", "Ain Oussera", "Charef"],
  "Jijel": ["Jijel", "El Milia", "Taher", "Chekfa"],
  "Sétif": ["Sétif", "El Eulma", "Ain Oulmene", "Bougaa", "Hammam Guergour"],
  "Saïda": ["Saïda", "El Hassasna", "Youb"],
  "Skikda": ["Skikda", "Collo", "Azzaba", "Tamalous"],
  "Sidi Bel Abbès": ["Sidi Bel Abbès", "Telagh", "Ras El Ma", "Ben Badis"],
  "Annaba": ["Annaba", "El Bouni", "Berrahal", "Seraïdi"],
  "Guelma": ["Guelma", "Bouchegouf", "Oued Zenati", "Hammam Debagh"],
  "Constantine": ["Constantine", "El Khroub", "Hamma Bouziane", "Didouche Mourad"],
  "Médéa": ["Médéa", "Berrouaghia", "Ksar El Boukhari", "Tablat"],
  "Mostaganem": ["Mostaganem", "Aïn Tedeles", "Sidi Ali"],
  "M'Sila": ["M'Sila", "Bou Saada", "Magra"],
  "Mascara": ["Mascara", "Tighennif", "Sig"],
  "Ouargla": ["Ouargla", "Hassi Messaoud", "Touggourt"],
  "Oran": ["Oran", "Es Sénia", "Arzew", "Bir El Djir"],
  "El Bayadh": ["El Bayadh", "Labiodh Sidi Cheikh", "Bougtob"],
  "Illizi": ["Illizi", "Djanet"],
  "Bordj Bou Arreridj": ["Bordj Bou Arréridj", "Ras El Oued", "El Achir"],
  "Boumerdès": ["Boumerdès", "Thenia", "Khemis El Khechna"],
  "El Tarf": ["El Tarf", "Besbes", "Ben Mhidi", "El Kala"],
  "Tindouf": ["Tindouf"],
  "Tissemsilt": ["Tissemsilt", "Bordj Emir Abdelkader", "Theniet El Had"],
  "El Oued": ["El Oued", "Guemar", "Mih Ouensa"],
  "Khenchela": ["Khenchela", "Kaïs", "Chechar"],
  "Souk Ahras": ["Souk Ahras", "Sedrata", "M'daourouch"],
  "Tipaza": ["Tipaza", "Cherchell", "Hadjout"],
  "Mila": ["Mila", "Chelghoum Laïd", "Ferdjioua"],
  "Aïn Defla": ["Aïn Defla", "Miliana", "Khemis Miliana"],
  "Naâma": ["Naâma", "Mécheria", "Ain Sefra"],
  "Aïn Témouchent": ["Aïn Témouchent", "El Malah", "Hammam Bou Hadjar"],
  "Ghardaïa": ["Ghardaïa", "Metlili", "El Atteuf"],
  "Relizane": ["Relizane", "Oued Rhiou", "Mazouna"],
  "Timimoun": ["Timimoun", "Charouine"],
  "Bordj Badji Mokhtar": ["Bordj Badji Mokhtar"],
  "Ouled Djellal": ["Ouled Djellal"],
  "Béni Abbès": ["Béni Abbès"],
  "In Salah": ["In Salah"],
  "In Guezzam": ["In Guezzam"],
  "Touggourt": ["Touggourt"],
  "Djanet": ["Djanet"],
  "El Meghaier": ["El Meghaier"],
  "El Menia": ["El Menia"]
} as const;

const specializations = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance"
];

// Added categories data
const categories = [
  "Consulting Services",
  "Information Technology",
  "Software Development",
  "Hardware & Networks",
  "Cloud Solutions",
  "AI & Machine Learning",
  "Cybersecurity",
  "Digital Marketing",
  "Web Development",
  "Mobile App Development",
  "E-commerce Solutions",
  "UI/UX Design",
  "Data Analytics",
  "Blockchain Technology",
  "IoT Solutions",
  "AR/VR Development",
  "Business Intelligence",
  "ERP Systems",
  "CRM Solutions",
  "IT Support & Maintenance"
];

export default function RegistrationForm() {
  // Form state
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    daira: '',
    address: '',
    specialization: '',
    category: '',
    termsAccepted: false
  });

  // Search state for category
  const [categorySearch, setCategorySearch] = useState('');

  // Error state
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return categories.filter(category => 
      category.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return '';
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field on change if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }

    // Reset daira when city changes
    if (name === 'city') {
      setFormData(prev => ({ ...prev, daira: '' }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData] as string);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension || '')) {
        setErrorMessage('Please upload PDF or Word documents only');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size should be less than 10MB');
        return;
      }

      setFilePreview({ name: file.name, size: file.size });
      setErrorMessage('');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validatePage = (pageNumber: number) => {
    const fieldsToValidate = pageNumber === 1 
      ? ['companyName', 'email', 'password', 'confirmPassword', 'city', 'daira', 'address', 'specialization']
      : ['category'];

    const newErrors: FormErrors = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNextPage = () => {
    if (validatePage(1)) {
      setCurrentPage(2);
    }
  };

  const sendFile = () => {
    if (!filePreview) {
      setErrorMessage('Please select a file first');
      return;
    }
    setErrorMessage('File uploaded successfully!');
    setUploadSuccess(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className={`flex ${currentPage === 1 ? 'flex' : 'hidden'} bg-white rounded-2xl overflow-hidden w-full max-w-5xl shadow-lg`}>
        <PlanSection />
        <div className="flex-1 p-10">
          <form className="space-y-6">
            <div>
              <label className="block text-sm mb-2">Company name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('companyName')}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.companyName ? 'border-red-500' : ''}`}
                placeholder="Enter your company name"
                required
              />
              {formErrors.companyName && <p className="text-red-500 text-sm mt-1">{formErrors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm mb-2">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.password ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm mb-2">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('city')}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.city ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Choose city</option>
                  {Object.keys(algeriaCities).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">Daira</label>
                <select
                  name="daira"
                  value={formData.daira}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('daira')}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.daira ? 'border-red-500' : ''}`}
                  disabled={!formData.city}
                  required
                >
                  <option value="">Choose Daira</option>
                  {formData.city && algeriaCities[formData.city as City].map(daira => (
                    <option key={daira} value={daira}>{daira}</option>
                  ))}
                </select>
                {formErrors.daira && <p className="text-red-500 text-sm mt-1">{formErrors.daira}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={() => handleBlur('address')}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.address ? 'border-red-500' : ''}`}
                placeholder="Enter address"
                required
              />
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                onBlur={() => handleBlur('specialization')}
                className={`w-full px-3 py-2 border rounded-lg ${formErrors.specialization ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Choose specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {formErrors.specialization && <p className="text-red-500 text-sm mt-1">{formErrors.specialization}</p>}
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
            >
              Next
            </button>
          </form>
        </div>
      </div>

      <div className={`flex ${currentPage === 2 ? 'flex' : 'hidden'} bg-white rounded-2xl overflow-hidden w-full max-w-5xl shadow-lg`}>
        <PlanSection />
        <div className="flex-1 p-10">
          <div>
            <label className="block text-sm mb-2">Category</label>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Search category..."
              />
            </div>
            
            <div className="max-h-40 overflow-y-auto mb-4 border rounded-lg">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <div 
                    key={category} 
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${formData.category === category ? 'bg-green-50 text-green-600 font-medium' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category }));
                      setFormErrors(prev => ({ ...prev, category: '' }));
                    }}
                  >
                    {category}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No categories found</div>
              )}
            </div>
            
            {formData.category && (
              <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                <span>Selected: <strong>{formData.category}</strong></span>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, category: '' }))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {formErrors.category && <p className="text-red-500 text-sm mt-1 mb-4">{formErrors.category}</p>}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 relative mt-4">
              {filePreview && (
                <button
                  type="button"
                  onClick={() => setFilePreview(null)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              )}

              <h3 className="text-lg font-medium mb-2">Put your document</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send your file to provide copy Commerciale register + copy NIF copy NIS + declaration of extance
              </p>

              {!filePreview ? (
                <div
                  className={`min-h-[100px] flex items-center justify-center border border-dashed rounded cursor-pointer
                    ${isDragOver ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <span className="text-gray-600">Drag and drop files here or click to upload</span>
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInput}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{filePreview.name}</span>
                      <span className="text-gray-600">{formatFileSize(filePreview.size)}</span>
                    </div>
                  </div>
                )}
  
                {errorMessage && (
                  <p className={`text-sm mt-2 ${uploadSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {errorMessage}
                  </p>
                )}
  
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setFilePreview(null)}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    modify
                  </button>
                  <button
                    type="button"
                    onClick={sendFile}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    send
                  </button>
                </div>
              </div>
  
              <div className="flex items-center gap-2 my-6">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                  className="rounded"
                />
                <label htmlFor="terms" className="text-sm">
                  Agree to Terms and conditions
                </label>
              </div>
  
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="px-6 py-3 border rounded hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const PlanSection = () => (
    <div className="bg-green-500 p-10 w-72">
      <h2 className="text-white text-xl font-semibold">Professional</h2>
      <p className="text-white/90 text-sm mt-1">For freelancers and startups</p>
      
      <div className="bg-white rounded-xl p-6 mt-5">
        <ul className="space-y-3">
          <Feature active>All starter features +</Feature>
          <Feature>Up to 5 user accounts</Feature>
          <Feature>Team collaboration tools</Feature>
          <Feature>Custom dashboards</Feature>
          <Feature>Multiple data export formats</Feature>
          <Feature>Basic custom integrations</Feature>
        </ul>
      </div>
    </div>
  );
  
  const Feature = ({ children, active = false }: { children: React.ReactNode; active?: boolean }) => (
    <li className="flex items-center gap-2 text-sm">
      <span className={`w-4 h-3 rounded-full border-2 flex items-center justify-center
        ${active ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
        {active && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
      </span>
      {children}
    </li> 
  );
 