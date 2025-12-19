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

export interface PlaylistHistoryItem {
    playlist_id: number;
    id: number;
    listened_at: string;
    user_id: number;
    created_at: string;
    playlist: PlayListResponse;
}

export interface LikedPlaylistResponse {
    playlist_id: number;
    id: number;
    user_id: number;
    created_at: string;
    playlist: PlayListResponse;
}

export interface PlaylistCreateRequest {
    name: string;
    user_id?: number | null;
    playlist_type?: string;
    avatar_url?: string | null;
    is_public?: boolean;
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
    async getHistoryPlaylists(): Promise<{ success: boolean, data: PlaylistHistoryItem[], error: any | null }> {
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

    // Lấy danh sách playlist của người dùng tạo
    async getUserPlaylists(): Promise<{ success: boolean, data: PlayListResponse[], error: any | null }> {
        try {
            const response = await api.get('/playlist/me');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Tim playlist
    async createLikedPlaylist(request: HistoryPlaylistRequest): Promise<{ success: boolean, data: PlayListResponse | null, error: any | null }> {
        try {
            const response = await api.post(`/liked-playlist/`, request);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error };
        }
    }

    // Tạo playlist mới
    async createUserPlaylist(request: PlaylistCreateRequest): Promise<{ success: boolean, data: PlayListResponse | null, error: any | null }> {
        try {
            const response = await api.post('/playlist/', request);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error };
        }
    }

    // Lấy danh sách playlist liked
    async getLikedPlaylists(): Promise<{ success: boolean, data: LikedPlaylistResponse[], error: any | null }> {
        try {
            const response = await api.get('/liked-playlist/');
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    // Xóa playlist liked
    async deleteLikedPlaylist(request: HistoryPlaylistRequest): Promise<{ success: boolean, data: PlayListResponse | null, error: any | null }> {
        try {
            const response = await api.delete(`/liked-playlist/${request.playlist_id}`);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error };
        }
    }

    // Lấy trạng thái yêu thích
    async getLikedPlaylistStatus(request: HistoryPlaylistRequest): Promise<{ success: boolean, data: { is_liked: boolean, id: number, created_at: string } | null, error: any | null }> {
        try {
            const response = await api.get(`/liked-playlist/${request.playlist_id}/status`);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error }; // Updated fallback
        }
    }
}

export default new PlaylistService();