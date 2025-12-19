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

export interface HistoryPlaylistRequest {
    playlist_id: number;
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

    // Lấy danh sách playlist theo nghệ sĩ
    async getPlaylistsByArtistId(artistId: number): Promise<{ success: boolean, data: PlayListResponse[], error: any | null }> {
        try {
            const response = await api.get(`/artist/${artistId}/albums`);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Lấy danh sách playlist lịch sử nghe
    async getHistoryPlaylists(): Promise<{ success: boolean, data: PlayListResponse[], error: any | null }> {
        try {
            const response = await api.get('/history/playlist/');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Tạo lịch sử playlist nghe
    async createHistoryPlaylist(request: HistoryPlaylistRequest): Promise<{ success: boolean, data: PlayListResponse | null, error: any | null }> {
        try {
            const response = await api.post(`/history/playlist/`, request);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error };
        }
    }
}

export default new PlaylistService();