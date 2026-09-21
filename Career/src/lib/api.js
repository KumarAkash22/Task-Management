const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("taskAppToken");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

export const sendOTP = (email) => request("/auth/send-otp", {
    method: "POST",
    body: { email }
});

export const verifyOTP = (email, otp) => request("/auth/verify-otp", {
    method: "POST",
    body: { email, otp }
});

export const registerUser = (name, email, password) => request("/auth/register", {
    method: "POST",
    body: { name, email, password }
});

export const loginUser = (email, password) => request("/auth/login", {
    method: "POST",
    body: { email, password }
});

export const createTask = (taskData) => request("/tasks", {
    method: "POST",
    body: taskData
});

export const getTasks = (params = {}, options = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) query.set(key, value);
    });

    const queryString = query.toString();

    return request(`/tasks${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        ...options
    });
};


export const getTask = (taskId) => request(`/tasks/${taskId}`, {
    method: "GET"
});

export const updateTask = (taskId, taskData) => request(`/tasks/${taskId}`, {
    method: "PUT",
    body: taskData
});

export const deleteTask = (taskId) => request(`/tasks/${taskId}`, {
    method: "DELETE"
});
