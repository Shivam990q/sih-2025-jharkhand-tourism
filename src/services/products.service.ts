import api from './api';
import type { ApiResponse, Product, ProductListParams, Review, ReviewListParams } from '../types/api.types';

/**
 * Product service for API operations
 */
export const productsService = {
	/**
	 * Get all products with optional filters
	 */
	async getAll(params?: ProductListParams): Promise<ApiResponse<Product[]>> {
		const response = await api.get<ApiResponse<Product[]>>('/products', { params });
		return response.data;
	},

	/**
	 * Get a single product by ID
	 */
	async getById(id: string): Promise<Product> {
		const response = await api.get<{ data: Product }>(`/products/${id}`);
		return response.data.data;
	},

	/**
	 * Get reviews for a product
	 */
	async getReviews(params: ReviewListParams): Promise<ApiResponse<Review[]>> {
		const response = await api.get<ApiResponse<Review[]>>(
			`/products/${params.listingId}/reviews`,
			{ params: { page: params.page, limit: params.limit } }
		);
		return response.data;
	},

	/**
	 * Get featured products for homepage
	 */
	async getFeatured(): Promise<Product[]> {
		const response = await api.get<ApiResponse<Product[]>>('/products', {
			params: { featured: true, limit: 4 }
		});
		return response.data.data;
	},

	/**
	 * Get products by category
	 */
	async getByCategory(category: string, limit?: number): Promise<Product[]> {
		const response = await api.get<ApiResponse<Product[]>>('/products', {
			params: { category, limit }
		});
		return response.data.data;
	},
};
