import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations/index.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = (path) => {
        try {
            const keys = path.split('.');
            let current = translations[language] || translations['en'];

            for (const key of keys) {
                if (!current || current[key] === undefined) {
                    console.warn(`Translation missing for key: ${path} in language: ${language}`);
                    return path;
                }
                current = current[key];
            }
            return current;
        } catch (e) {
            console.error("Translation function error:", e);
            return path;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
