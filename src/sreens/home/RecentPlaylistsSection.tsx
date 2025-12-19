import React from 'react';

import AlbumSection, { AlbumItem } from '../../components/AlbumSection';
import { useLanguage } from '../../contexts/LanguageContext';

const RECENT_DATA: AlbumItem[] = [
    { id: '1', title: "Today's Top Hits", image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' },
    { id: '2', title: 'Deep Focus', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80' },
    { id: '3', title: 'Chill Lo-Fi Beats', image: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?w=500&q=80' },
    { id: '4', title: 'Rock Classics', image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&q=80' },
    { id: '5', title: 'RapCaviar', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&q=80' },
    { id: '6', title: 'All Out 2010s', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80' },
];

const RecentPlaylists = () => {
    const { t } = useLanguage();
    const handlePressAlbum = (album: AlbumItem) => {
        console.log('Pressed album:', album.title);
    };

    const handlePressMore = () => {
        console.log('Pressed see more');
    };

    return (
        <AlbumSection
            title={t('recentPlaylists')}
            albums={RECENT_DATA}
            showMore={false}
            onPressAlbum={handlePressAlbum}
            onPressMore={handlePressMore}
        />
    );
};

export default RecentPlaylists;