// /src/context/LanguageContext.js
export const translations = {
  en: { home: "Home", games: "Games", routine: "Routine", sos: "SOS - HELP", ... },
  as: { home: "ঘৰ", games: "খেল", routine: "ৰুটিন", sos: "বিপদ - সহায়", ... },
  bn: { home: "বাড়ি", games: "খেলা", routine: "রুটিন", sos: "জরুরি - সাহায্য", ... },
  // ... including Bodo, Garo, Hindi, Karbi, Khasi, Kokborok, Meitei, Mishing, Mizo, Nepali, Sadri
};

// /src/context/AppContext.js
// Logic for AsyncStorage persistence, streak calculation, and progress %
// (Completed / Total) * 100

// /src/components/SOSButton.js
// expo-location implementation: Location.getCurrentPositionAsync({})
// Alert: "Emergency contacts alerted! Location sent: Lat X, Long Y"