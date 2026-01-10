import api from './api';
import { Project } from '../types/project';

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  projectManager?: string;
  sortBy?: 'createdAt' | 'name' | 'startDate' | 'totalBudget' | 'progressPercentage' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  startDateFrom?: string;
  startDateTo?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const projectsApi = {
  /**
   * Get paginated list of projects with filters
   */
  getProjects: async (params?: ProjectQueryParams): Promise<PaginatedResponse<Project>> => {
    const response = await api.get('/projects/paginated', { params });
    return response.data;
  },

  /**
   * Get all projects (without pagination)
   */
  getAllProjects: async (filters?: Record<string, unknown>): Promise<Project[]> => {
    const response = await api.get('/projects', { params: filters });
    return response.data;
  },

  /**
   * Get a single project by ID
   */
  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create a new project
   */
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const response = await api.post('/projects', project);
    return response.data;
  },

  /**
   * Update an existing project
   */
  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}`, project);
    return response.data;
  },

  /**
   * Delete a project (soft delete)
   */
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  /**
   * Hard delete a project
   */
  hardDeleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${id}/hard`);
    return response.data;
  },

  /**
   * Restore a deleted project
   */
  restoreProject: async (id: string): Promise<Project> => {
    const response = await api.patch(`/projects/${id}/restore`);
    return response.data;
  },

  /**
   * Get projects by client ID
   */
  getProjectsByClient: async (clientId: string): Promise<Project[]> => {
    const response = await api.get(`/projects/client/${clientId}`);
    return response.data;
  },

  /**
   * Get project statistics
   */
  getStatistics: async (): Promise<Record<string, unknown>> => {
    const response = await api.get('/projects/statistics');
    return response.data;
  },
};
