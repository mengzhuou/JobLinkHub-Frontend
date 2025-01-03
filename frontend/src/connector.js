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

        // Store token in localStorage after Google login
        const { token: jwtToken } = res.data;
        if (jwtToken) {
            localStorage.setItem('token', jwtToken);
        }

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

        // Store token in localStorage after registration
        const { token } = res.data;
        if (token) {
            localStorage.setItem('token', token);
        }

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

        // Store token in localStorage after login
        const { token } = res.data;
        if (token) {
            localStorage.setItem('token', token);
        }

        return res.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// Get all records (protected route)
const getRecords = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get(`${BACKEND_URL}/records`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach token
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};

// Create a new record (protected route)
const createRecord = async (data) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.post(`${BACKEND_URL}/records`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error in createRecord:', error.response?.data || error.message);
        throw error;
    }
};


// Update an existing record (protected route)
const updateRecord = async (id, data) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.put(`${BACKEND_URL}/records/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Attach token
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const countRecord = async (id,data) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.put(`${BACKEND_URL}/records/${id}/click`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Attach token if necessary
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};
// Logout function
const logoutUser = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('userInfo'); // Remove any other user info if needed
    window.location.reload(); // Reload the page or redirect to login
};

const getProfileByUserId = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get(`${BACKEND_URL}/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const deleteRecord = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.delete(`${BACKEND_URL}/records/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach token if necessary
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const getOneRecordByRecordId = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get(`${BACKEND_URL}/records/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach token if necessary
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching record by ID:", error);
        throw error;
    }
};

const createRecordByRecordId = async (recordId) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    try {
        const res = await axios.post(
            `${BACKEND_URL}/records/duplicate/${recordId}`,
            {}, // No request body needed for this route
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Attach token for protected route
                },
            }
        );
        return res.data; // Return the response data
    } catch (error) {
        console.error('Error creating record by recordId:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};


export {
    verifyGoogleLogin,
    registerUser,
    loginUser,
    getRecords,
    createRecord,
    updateRecord,
    logoutUser,
    countRecord,
    getProfileByUserId,
    deleteRecord,
    getOneRecordByRecordId, 
    createRecordByRecordId
};
