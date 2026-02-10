import { API_BASE_URL } from './api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('cybershield_auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export interface Child {
    id: number;
    name: string;
    age: number;
    avatar: string;
    age_group: '6-9' | '10-13' | '14-17';
}

export type ChildData = Omit<Child, 'id'>;

export const getChildren = async () => {
    const response = await fetch(`${API_BASE_URL}/children`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch children');
    }

    return response.json();
};

export const addChild = async (childData: ChildData) => {
    const response = await fetch(`${API_BASE_URL}/children`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(childData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add child');
    }

    return response.json();
};

export const updateChild = async (id: number, childData: ChildData) => {
    const response = await fetch(`${API_BASE_URL}/children/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(childData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update child');
    }

    return response.json();
};

export const deleteChild = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/children/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete child');
    }

    return response.json();
};
