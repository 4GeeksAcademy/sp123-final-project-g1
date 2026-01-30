import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [people, setPeople] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedPeople = localStorage.getItem("people");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        if (storedPeople) {
            setPeople(JSON.parse(storedPeople));
        }
    }, []);

    const login = (userData, tokenData, peopleData) => {
        setUser(userData);
        setToken(tokenData);
        setPeople(peopleData || null);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenData);
        localStorage.setItem("people", JSON.stringify(peopleData || null));
    };

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
                setUser,   // 👈 IMPORTANTE
                setPeople  // 👈 IMPORTANTE
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);