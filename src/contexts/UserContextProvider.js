// Didnt use 
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create Contexts
const UserStateContext = createContext();
const UserDispatchContext = createContext();

// Reducer to manage user state
const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
        case 'UPDATE_USER':
            return { ...state, ...action.payload };
        case 'LOGOUT':
            return initialState;
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

// Initial state for the user
const initialState = {
    username: '',
    email: '',
    profilePic:'',
    bio: '',
    aboutAuthor:'',
    posts: [],
    followers: [],
    followings: [],
};

// Get initial state from localStorage
const getInitialState = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : initialState;
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, getInitialState());

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state));
    }, [state]);

    return (
        <UserDispatchContext.Provider value={dispatch}>
            <UserStateContext.Provider value={state}>
                {children}
            </UserStateContext.Provider>
        </UserDispatchContext.Provider>
    );
};

// Custom hooks for accessing the context
export const useUser = () => useContext(UserStateContext);
export const useDispatchUser = () => useContext(UserDispatchContext);
