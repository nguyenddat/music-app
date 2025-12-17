import api from "./ApiService";

export interface GenreResponse {
    id: number;
    name: string;
}

// Enum các onboarding steps
export enum OnboardingStep {
    GENRE = 'genre',
    ARTIST = 'artist',
}

export interface OnboardingRequest {
    step: OnboardingStep;
    data: number[];
}

export interface OnboardingResponse {
    success: boolean;
}

class GenreService {
    // Lấy danh sách các thể loại nhạc hiện có
    async getGenres(): Promise<{ success: boolean; data: GenreResponse[], error: any }> {
        try {
            const response = await api.get('/genre/');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }
}

export default new GenreService();