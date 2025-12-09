import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    colors: typeof Colors.light;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    setTheme: () => { },
    colors: Colors.light,
    isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState<ThemeType>('system');

    useEffect(() => {
        // Load persisted theme
        AsyncStorage.getItem('user_theme').then((saved: string | null) => {
            if (saved) setTheme(saved as ThemeType);
        });
    }, []);

    const saveTheme = (newTheme: ThemeType) => {
        setTheme(newTheme);
        AsyncStorage.setItem('user_theme', newTheme);
    };

    const activeScheme = theme === 'system' ? systemScheme : theme;
    const isDark = activeScheme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ theme, setTheme: saveTheme, colors, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
