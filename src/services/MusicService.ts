import api from "./ApiService";

export interface MusicResponse {
    id: number;
    name: string;
    artists: string[];

    file_path: string;              // Static directory path
    avatar_url: string;
    created_at: string;

    duration: number | null;
}

class MusicService {
    // Lấy danh sách các bài nhạc tuần này
    async getWeeklyMusic(): Promise<{ success: boolean; data: MusicResponse[], error: any }> {
        try {
            const response = await api.get('/song/weekly');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Lấy danh sách các bài nhạc theo nghệ sĩ yêu thích
    async getMusicByLikedArtists(): Promise<{ success: boolean; data: MusicResponse[], error: any }> {
        try {
            const response = await api.get('/song/liked-artists');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Lấy danh sách các bài nhạc theo thể loại yêu thích
    async getMusicByLikedGenres(): Promise<{ success: boolean; data: MusicResponse[], error: any }> {
        try {
            const response = await api.get('/song/liked-genres');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Lấy danh sách các bài nhạc theo thể loại người dùng chưa thích
    async getMusicByNewGenres(): Promise<{ success: boolean; data: MusicResponse[], error: any }> {
        try {
            const response = await api.get('/song/new-genres');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Lấy danh sách các bài nhạc theo nghệ sĩ mới
    async getMusicByNewArtists(): Promise<{ success: boolean; data: MusicResponse[], error: any }> {
        try {
            const response = await api.get('/song/new-artists');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }
}

export default MusicService;
