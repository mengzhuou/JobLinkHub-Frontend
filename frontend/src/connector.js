import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Verify Google Login
const verifyGoogleLogin = async (token) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/user/auth/google-login`, { token }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

// Register a new user with username and password
const registerUser = async ({ username, password, confirmPassword }) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/user/auth/register`, {
            username,
            password,
            confirmPassword
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

// Login a user with username and password
const loginUser = async ({ username, password }) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/user/auth/login`, {
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// Other existing functions
const getRecords = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/records`);
        return res.data;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};

const createRecord = async (data) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/records`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const updateRecord = async (id, data) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/records/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export {
    verifyGoogleLogin,
    registerUser,  
    loginUser,     
    getRecords,
    createRecord,
    updateRecord
};
