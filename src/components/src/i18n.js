import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// --- CONSOLIDATED TRANSLATION RESOURCES ---
const resources = {
  en: {
    translation: {
      // General/Shared UI (From LoginRoleSelection)
      select_role_header: 'Select your role to login',
      new_user_prompt: 'New user?',
      signup_button: 'Sign up',
      select_blood: 'Select blood group',
      
      // Patient Form UI (From PatientLogin)
      back: '← Back',
      reg_title: 'Patient Registration',
      subtitle: 'Please fill in all required fields marked with *',
      address_heading: 'Address',
      additional_info: 'Additional Information (Optional)',
      submit_button: 'Create Account',
      signin_prompt: 'Already have an account?',
      signin_button: 'Sign in',

      // Health Records UI (From HealthRecords)
      records_header: 'Health Records',
      records_subtitle: 'Manage your medical information securely',
      date: 'Date',
      treatment: 'Treatment',
      notes: 'Notes',
      dosage: 'Dosage',
      frequency: 'Frequency',
      prescribedBy: 'Prescribed by',
      refillsRemaining: 'Refills remaining',
      dateAdministered: 'Date administered',
      nextDue: 'Next due',
      time: 'Time',
      location: 'Location',
      
      // Category and Role Names
      roles: {
        patient: 'Patient',
        asha: 'Asha Didi',
        doctor: 'Doctor',
        pharmacist: 'Pharmacist',
      },
      category: {
        MedicalHistory: 'Medical History',
        LabResult: 'Lab Result',
        Prescription: 'Prescription',
        Vaccination: 'Vaccination',
        Appointment: 'Appointment',
      },
      
      // Form Labels/Placeholders/Errors
      abhaid: 'ABHA ID',
      name: 'Full Name',
      age: 'Age',
      dob: 'Date of Birth',
      phone: 'Phone Number',
      village: 'Village',
      block: 'Block',
      city: 'City',
      blood: 'Blood Group',
      email: 'Email',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      
      ph_abhaid: 'Enter your ABHA ID',
      ph_name: 'Enter your full name',
      ph_age: 'Enter your age',
      ph_phone: 'Enter your 10-digit phone number',
      // ... (Include all other placeholders here)
      ph_village: 'Enter your village name',
      ph_block: 'Enter your block name',
      ph_city: 'Enter your city name',
      ph_email: 'Enter your email (optional)',
      ph_height: 'Enter your height in cm',
      ph_weight: 'Enter your weight in kg',


      // Validation Errors
      err_abhaid: 'ABHA ID is required',
      err_name: 'Name is required',
      err_age: 'Please enter valid age',
      err_phone: 'Phone number is required',
      err_dob: 'Date of birth is required',
      err_village: 'Village is required',
      err_block: 'Block is required',
      err_city: 'City is required',
    }
  },
  hi: {
    translation: {
      // General/Shared UI
      select_role_header: 'लॉगिन करने के लिए अपनी भूमिका चुनें',
      new_user_prompt: 'नया उपयोगकर्ता?',
      signup_button: 'साइन अप करें',
      select_blood: 'रक्त समूह चुनें',

      // Patient Form UI
      back: '← वापस',
      reg_title: 'रोगी पंजीकरण',
      subtitle: 'कृपया * से चिह्नित सभी आवश्यक फ़ील्ड भरें',
      address_heading: 'पता',
      additional_info: 'अतिरिक्त जानकारी (वैकल्पिक)',
      submit_button: 'खाता बनाएं',
      signin_prompt: 'पहले से ही एक खाता है?',
      signin_button: 'साइन इन करें',
      
      // Health Records UI
      records_header: 'स्वास्थ्य रिकॉर्ड',
      records_subtitle: 'अपनी चिकित्सा जानकारी को सुरक्षित रूप से प्रबंधित करें',
      date: 'तिथि',
      treatment: 'उपचार',
      notes: 'टिप्पणियाँ',
      dosage: 'खुराक',
      frequency: 'आवृत्ति',
      prescribedBy: 'दवा लिखने वाला',
      refillsRemaining: 'शेष रीफिल',
      dateAdministered: 'दवा देने की तिथि',
      nextDue: 'अगली देय तिथि',
      time: 'समय',
      location: 'स्थान',

      // Category and Role Names
      roles: {
        patient: 'रोगी',
        asha: 'आशा दीदी',
        doctor: 'डॉक्टर',
        pharmacist: 'फार्मासिस्ट',
      },
      category: {
        MedicalHistory: 'चिकित्सा इतिहास',
        LabResult: 'प्रयोगशाला परिणाम',
        Prescription: 'नुस्खा',
        Vaccination: 'टीकाकरण',
        Appointment: 'नियुक्ति',
      },

      // Form Labels/Placeholders/Errors
      abhaid: 'आभा आईडी',
      name: 'पूरा नाम',
      age: 'आयु',
      dob: 'जन्मतिथि',
      phone: 'फ़ोन नंबर',
      village: 'गाँव',
      block: 'ब्लॉक',
      city: 'शहर',
      blood: 'रक्त समूह',
      email: 'ईमेल',
      height: 'ऊंचाई (सेमी)',
      weight: 'वजन (किग्रा)',

      ph_abhaid: 'अपनी आभा आईडी दर्ज करें',
      ph_name: 'अपना पूरा नाम दर्ज करें',
      ph_age: 'अपनी आयु दर्ज करें',
      ph_phone: 'अपना 10 अंकों का फ़ोन नंबर दर्ज करें',
      // ... (Include all other placeholders here)
      ph_village: 'अपने गाँव का नाम दर्ज करें',
      ph_block: 'अपना ब्लॉक नाम दर्ज करें',
      ph_city: 'अपना शहर नाम दर्ज करें',
      ph_email: 'अपना ईमेल दर्ज करें (वैकल्पिक)',
      ph_height: 'अपनी ऊंचाई सेमी में दर्ज करें',
      ph_weight: 'अपना वजन किलोग्राम में दर्ज करें',

      // Validation Errors
      err_abhaid: 'आधार आईडी आवश्यक है',
      err_name: 'नाम आवश्यक है',
      err_age: 'कृपया वैध आयु दर्ज करें',
      err_phone: 'फ़ोन नंबर आवश्यक है',
      err_dob: 'जन्मतिथि आवश्यक है',
      err_village: 'गाँव आवश्यक है',
      err_block: 'ब्लॉक आवश्यक है',
      err_city: 'शहर आवश्यक है',
    }
  },
  // Add 'pa' (Punjabi) resource here if needed...
};


i18n
  .use(initReactI18next) // passes i18n instance to react-i18next
  .init({
    resources,
    // CRUCIAL: Reads the language saved by the previous component
    lng: localStorage.getItem('appLanguage') || 'en', 
    fallbackLng: 'en', // use en if selected lng is not available

    interpolation: {
      escapeValue: false // react already handles escaping
    }
  });

export default i18n;