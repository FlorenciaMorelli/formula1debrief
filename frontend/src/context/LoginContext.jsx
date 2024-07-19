import React, { createContext, useState } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [loginMode, setLoginMode] = useState('signin');

    return (
        <LoginContext.Provider value={{ loginMode, setLoginMode }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContext;