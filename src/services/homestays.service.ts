import api from './api';
import type { ApiResponse, Homestay, HomestayListParams, Review, ReviewListParams } from '../types/api.types';

/**
 * Raw homestay from API (may have different structure)
 */
interface RawHomestay {
	id: string | number;
	title: string;
	description: string;
	location: string;
	district: string;
	price: number;
	rating: number;
	reviewCount: number;
	images: string[] | Array<{ item: string }>;
	amenities: string[] | Array<{ item: string }>;
	hostId: string;
	hostName: string;
	hostAvatar?: string;
	capacity: {
		guests: number;
		bedrooms: number;
		beds: number;
		bathrooms: number;
	};
	propertyType: 'entire' | 'private' | 'shared' | string;
	minStay: number;
	maxStay: number;
	houseRules: string[] | Array<{ item: string }>;
	coordinates?: {
		lat: number;
		lng: number;
	};
}

/**
 * Normalize raw API data to expected Homestay format
 */
function normalizeHomestay(raw: RawHomestay): Homestay {
	return {
		id: String(raw.id),
		title: raw.title,
		description: raw.description,
		location: raw.location,
		district: raw.district,
		price: raw.price,
		rating: raw.rating,
		reviewCount: raw.reviewCount,
		// Handle images as either string[] or {item: string}[]
		images: Array.isArray(raw.images)
			? raw.images.map(img => typeof img === 'string' ? img : img.item)
			: [],
		// Handle amenities as either string[] or {item: string}[]
		amenities: Array.isArray(raw.amenities)
			? raw.amenities.map(a => typeof a === 'string' ? a : a.item)
			: [],
		hostId: raw.hostId,
		hostName: raw.hostName,
		hostAvatar: raw.hostAvatar,
		capacity: raw.capacity,
		propertyType: ['entire', 'private', 'shared'].includes(raw.propertyType)
			? raw.propertyType as 'entire' | 'private' | 'shared'
			: 'entire',
		minStay: raw.minStay,
		maxStay: raw.maxStay,
		// Handle houseRules as either string[] or {item: string}[]
		houseRules: Array.isArray(raw.houseRules)
			? raw.houseRules.map(r => typeof r === 'string' ? r : r.item)
			: [],
		coordinates: raw.coordinates,
	};
}

/**
 * Homestay service for API operations
 */
export const homestaysService = {
	/**
	 * Get all homestays with optional filters
	 */
	async getAll(params?: HomestayListParams): Promise<ApiResponse<Homestay[]>> {
		const response = await api.get<RawHomestay[] | ApiResponse<RawHomestay[]>>(
			'/homestays',
			{ params }
		);

		// Handle both array response and wrapped response formats
		const rawData = Array.isArray(response.data)
			? response.data
			: response.data.data;

		const normalizedData = rawData.map(normalizeHomestay);

		// Return in ApiResponse format
		return {
			data: normalizedData,
			meta: Array.isArray(response.data)
				? { total: normalizedData.length, page: 1, limit: normalizedData.length, totalPages: 1 }
				: response.data.meta,
		};
	},

	/**
	 * Get a single homestay by ID
	 */
	async getById(id: string): Promise<Homestay> {
		const response = await api.get<RawHomestay | { data: RawHomestay }>(`/homestays/${id}`);

		// Handle both direct object and wrapped response formats
		const rawData = 'data' in response.data && response.data.data
			? response.data.data
			: response.data as RawHomestay;

		return normalizeHomestay(rawData);
	},

	/**
	 * Get reviews for a homestay
	 */
	async getReviews(params: ReviewListParams): Promise<ApiResponse<Review[]>> {
		const response = await api.get<ApiResponse<Review[]> | Review[]>(
			`/homestays/${params.listingId}/reviews`,
			{ params: { page: params.page, limit: params.limit } }
		);

		// Handle both array response and wrapped response formats
		if (Array.isArray(response.data)) {
			return {
				data: response.data,
				meta: { total: response.data.length, page: 1, limit: response.data.length, totalPages: 1 }
			};
		}
		return response.data;
	},

	/**
	 * Get featured homestays for homepage
	 */
	async getFeatured(): Promise<Homestay[]> {
		const response = await api.get<RawHomestay[] | ApiResponse<RawHomestay[]>>('/homestays', {
			params: { featured: true, limit: 4 }
		});

		// Handle both array response and wrapped response formats
		const rawData = Array.isArray(response.data)
			? response.data
			: response.data.data;

		return rawData.map(normalizeHomestay);
	},
};
