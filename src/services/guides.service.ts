import api from './api';
import type { ApiResponse, Guide, GuideListParams, Review, ReviewListParams } from '../types/api.types';

/**
 * Guide service for API operations
 */
export const guidesService = {
	/**
	 * Get all guides with optional filters
	 */
	async getAll(params?: GuideListParams): Promise<ApiResponse<Guide[]>> {
		const response = await api.get<ApiResponse<Guide[]>>('/guides', { params });
		return response.data;
	},

	/**
	 * Get a single guide by ID
	 */
	async getById(id: string): Promise<Guide> {
		const response = await api.get<{ data: Guide }>(`/guides/${id}`);
		return response.data.data;
	},

	/**
	 * Get reviews for a guide
	 */
	async getReviews(params: ReviewListParams): Promise<ApiResponse<Review[]>> {
		const response = await api.get<ApiResponse<Review[]>>(
			`/guides/${params.listingId}/reviews`,
			{ params: { page: params.page, limit: params.limit } }
		);
		return response.data;
	},

	/**
	 * Get featured guides for homepage
	 */
	async getFeatured(): Promise<Guide[]> {
		const response = await api.get<ApiResponse<Guide[]>>('/guides', {
			params: { featured: true, limit: 4 }
		});
		return response.data.data;
	},
};
