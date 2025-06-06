// src/services/user.js

import endpoint from "./api";

const api = endpoint('users')

export const user = {
  // GET /users/{userId}
  getProfile: async (userId) => {
    // endpoint('users') makes baseURL = “…/users”, so this hits “…/users/{userId}”
    const response = await api.get(`/${userId}`)
    return response.data
  },

  // PUT /users/{userId}
  updateProfile: async (userId, data) => {
    const response = await api.put(`/${userId}`, data)
    return response.data
  },

  // POST /users/{userId}/upload-image
  uploadProfileImage: async (userId, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await api.post(
      `/${userId}/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  // DELETE /users/{userId}
  deleteUser: async (userId) => {
    const response = await api.delete(`/${userId}`)
    return response.data
  },

  // GET /users/all
  getAllUsers: async () => {
    const response = await api.get('/all')
    return response.data
  },

  // GET /users/search?q={query}&role={role}
  searchUsers: async (query = '', role = '') => {
    const params = {}
    if (query) params.q = query
    if (role) params.role = role

    // This will hit “…/users/search?q=…&role=…”
    const response = await api.get('/search', { params })
    return response.data
  },
}
