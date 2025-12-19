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

export interface MusicMatchResponse extends MusicResponse {
    match_score: number;
    match_offset: number;
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

    // Lấy danh sách nhạc theo playlist id
    async getMusicByPlaylistId(id: number): Promise<{ success: boolean; data: MusicResponse[], error: any }> {
        try {
            const response = await api.get(`/playlist-song/playlist/${id}/songs`);
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }

    getStreamingUrl(songId: number): string {
        const baseURL = api.defaults.baseURL || '';
        return `${baseURL}/song/stream/${songId}`;
    }

    async streamSong(songId: number, rangeHeader?: string): Promise<{ success: boolean; data: any, error: any }> {
        try {
            const headers: any = {};
            if (rangeHeader) {
                headers['Range'] = rangeHeader;
            }

            const response = await api.get(`/song/stream/${songId}`, {
                headers,
                responseType: 'blob', // Nhận dữ liệu dưới dạng blob
            });

            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: null, error: error };
        }
    }



    // Lấy các bài nhạc matching với file audio/video
    async getMusicByFile(file: any): Promise<{ success: boolean; data: MusicMatchResponse[], error: any }> {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'audio/mpeg'
            } as any);

            const response = await api.post('/song/match', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 seconds timeout for large file uploads
            });
            return { success: true, data: response.data, error: null };
        } catch (error) {
            return { success: false, data: [], error: error };
        }
    }
}

export default MusicService;
