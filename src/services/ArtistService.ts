import api from "./ApiService";

interface ArtistResponse {
    id: number;
    name: string;
    avatar_url: string;
    crawl_id: string;               // crawl id (bỏ qua)
    created_at: string;             // created at (bỏ qua)
}

class ArtistService {
    // Lấy danh sách nghệ sĩ đang nổi
    async getRisingArtists(): Promise<{ success: boolean; data: ArtistResponse[] | null; error: any }> {
        try {
            const response = await api.get("/artist/rising");                          // List[ArtistResponse]
            return { "success": true, "data": response.data, "error": null }
        } catch (error) {
            return { "success": false, "data": null, "error": error };
        }
    }

    // Lấy danh sách nghệ sĩ theo sở thích thể loại
    async getArtistsByLikedGenre(): Promise<{ success: boolean; data: ArtistResponse[] | null; error: any }> {
        try {
            const response = await api.get("/artist/liked-genre");                     // List[ArtistResponse]
            return { "success": true, "data": response.data, "error": null }
        } catch (error) {
            return { "success": false, "data": null, "error": error };
        }
    }
}


export default new ArtistService();