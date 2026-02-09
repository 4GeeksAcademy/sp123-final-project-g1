import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [people, setPeople] = useState(null);
    const [token, setToken] = useState(null);

    // Función segura para parsear JSON
    const safeParse = (value) => {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    };

    // Cargar datos desde localStorage al iniciar
    useEffect(() => {
        const storedUser = safeParse(localStorage.getItem("user"));
        const storedPeople = safeParse(localStorage.getItem("people"));
        const storedToken = localStorage.getItem("token");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(storedUser);
        if (storedPeople) setPeople(storedPeople);
    }, []);

    // Guardar user cuando cambie
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    // Guardar people cuando cambie
    useEffect(() => {
        if (people) {
            localStorage.setItem("people", JSON.stringify(people));
        }
    }, [people]);

    // Login: guardar todo
    const login = (userData, tokenData, peopleData) => {
        setUser(userData);
        setToken(tokenData);
        setPeople(peopleData || null);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenData);
        localStorage.setItem("people", JSON.stringify(peopleData || null));
    };

    // Logout: limpiar todo
    const logout = () => {
        setUser(null);
        setToken(null);
        setPeople(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("people");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                people,
                token,
                login,
                logout,
                setUser,
                setPeople
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);