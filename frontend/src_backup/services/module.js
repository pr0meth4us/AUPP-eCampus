import endpoint from "./api";

const createModuleApi = (courseId) => endpoint(`course/${courseId}/modules`);

export const moduleApi = {
    // ===== MODULE CRUD OPERATIONS =====

    // Create a new module
    createModule: async (courseId, moduleData) => {
        const api = createModuleApi(courseId);
        const response = await api.post('', moduleData);
        return response.data;
    },

    // Get all modules for a course
    getCourseModules: async (courseId) => {
        const api = createModuleApi(courseId);
        const response = await api.get('');
        return response.data;
    },

    // Get single module with its contents
    getModule: async (courseId, moduleId) => {
        const api = createModuleApi(courseId);
        const response = await api.get(`/${moduleId}`);
        return response.data;
    },

    // Update module (full replacement)
    updateModule: async (courseId, moduleId, moduleData) => {
        const api = createModuleApi(courseId);
        const response = await api.put(`/${moduleId}`, moduleData);
        return response.data;
    },

    // Edit module (partial update)
    editModule: async (courseId, moduleId, moduleData) => {
        const api = createModuleApi(courseId);
        const response = await api.patch(`/${moduleId}`, moduleData);
        return response.data;
    },

    // Delete module
    deleteModule: async (courseId, moduleId) => {
        const api = createModuleApi(courseId);
        const response = await api.delete(`/${moduleId}`);
        return response.data;
    },

    // Publish/unpublish module
    publishModule: async (courseId, moduleId, published = true) => {
        const api = createModuleApi(courseId);
        const response = await api.put(`/${moduleId}/publish`, { published });
        return response.data;
    },

    // ===== MODULE CONTENT OPERATIONS =====

    // Add content to a module (supports file uploads)
    addModuleContent: async (courseId, moduleId, contentData) => {
        const api = createModuleApi(courseId);
        const response = await api.post(`/${moduleId}/content`, contentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Update module content
    updateModuleContent: async (courseId, moduleId, contentId, contentData) => {
        const api = createModuleApi(courseId);
        const response = await api.put(`/${moduleId}/content/${contentId}`, contentData);
        return response.data;
    },

    // Partially update module content
    editModuleContent: async (courseId, moduleId, contentId, contentData) => {
        const api = createModuleApi(courseId);
        const response = await api.patch(`/${moduleId}/content/${contentId}`, contentData);
        return response.data;
    },

    // Delete module content
    deleteModuleContent: async (courseId, moduleId, contentId) => {
        const api = createModuleApi(courseId);
        const response = await api.delete(`/${moduleId}/content/${contentId}`);
        return response.data;
    },

    // Reorder content within a module
    reorderModuleContent: async (courseId, moduleId, contentOrder) => {
        const api = createModuleApi(courseId);
        const response = await api.patch(`/${moduleId}/content/order`, { order: contentOrder });
        return response.data;
    },

    // ===== HELPER METHODS =====

    // Create text content
    addTextContent: async (courseId, moduleId, title, content, order = 0) => {
        const contentData = {
            title,
            content_type: 'text',
            content,
            order
        };
        return await moduleApi.addModuleContent(courseId, moduleId, contentData);
    },

    // Create video content
    addVideoContent: async (courseId, moduleId, title, videoUrl, order = 0) => {
        const contentData = {
            title,
            content_type: 'video',
            content: videoUrl,
            order
        };
        return await moduleApi.addModuleContent(courseId, moduleId, contentData);
    },

    // Upload file content
    addFileContent: async (courseId, moduleId, title, file, order = 0) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content_type', 'file');
        formData.append('file', file);
        formData.append('order', order.toString());

        return await moduleApi.addModuleContent(courseId, moduleId, formData);
    },

    // Bulk upload multiple files
    addMultipleFiles: async (courseId, moduleId, files, titles = []) => {
        const results = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const title = titles[i] || file.name;
            try {
                const result = await moduleApi.addFileContent(courseId, moduleId, title, file, i);
                results.push({ success: true, file: file.name, result });
            } catch (error) {
                results.push({ success: false, file: file.name, error: error.message });
            }
        }
        return results;
    },

    // Toggle module publish status
    toggleModulePublish: async (courseId, moduleId) => {
        try {
            // First get current module status
            const module = await moduleApi.getModule(courseId, moduleId);
            const currentlyPublished = module.is_published || false;

            // Toggle the status
            return await moduleApi.publishModule(courseId, moduleId, !currentlyPublished);
        } catch (error) {
            throw new Error(`Failed to toggle module publish status: ${error.message}`);
        }
    },

    // Get module content count
    getModuleContentCount: async (courseId, moduleId) => {
        try {
            const module = await moduleApi.getModule(courseId, moduleId);
            return module.contents ? module.contents.length : 0;
        } catch (error) {
            throw new Error(`Failed to get module content count: ${error.message}`);
        }
    },

    // Check if module is empty
    isModuleEmpty: async (courseId, moduleId) => {
        const count = await moduleApi.getModuleContentCount(courseId, moduleId);
        return count === 0;
    }
};