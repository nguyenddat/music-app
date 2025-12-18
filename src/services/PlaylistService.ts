import api from "./ApiService";

export interface PlayListResponse {
    id: number;
    user_id: number | null;
    name: string;
    avatar_url: string | null;
    is_public: boolean;
    playlist_type: string;
    created_at: string;
}

class PlaylistService {
    // Lấy danh sách recommended playlists hoặc albums
    async getRecommendedPlaylists(type?: 'playlist' | 'album'): Promise<{ success: boolean, data: PlayListResponse[], error: any | null }> {
        try {
            const params = type ? { type } : {};
            const response = await api.get('/playlist/recommended', { params });
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Lấy danh sách playlist lịch sử nghe
    async getHistoryPlaylists(): Promise<{ success: boolean, data: PlayListResponse[], error: any | null }> {
        try {
            const response = await api.get('/playlist/history');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Lấy danh sách playlists theo tên
    async getPlaylistsByName(name: string, type?: 'playlist' | 'album'): Promise<{ success: boolean, data: PlayListResponse[], error: any | null }> {
        try {
            const params = type ? { type } : {};
            const response = await api.get(`/playlist/name/${name}`, { params });
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }
}

export default new PlaylistService();