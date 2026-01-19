import React, { useEffect } from 'react';
import { Map as GoogleMap, AdvancedMarker, useMap, Pin } from '@vis.gl/react-google-maps';

interface MapProps {
    center: { lat: number; lng: number };
    markers: Array<{ id: string; position: { lat: number; lng: number }; title: string }>;
    bounds?: { north: number; south: number; east: number; west: number };
}

export const Map: React.FC<MapProps> = ({ center, markers, bounds }) => {
    const map = useMap();

    useEffect(() => {
        if (map && bounds) {
            const googleBounds = new google.maps.LatLngBounds(
                { lat: bounds.south, lng: bounds.west },
                { lat: bounds.north, lng: bounds.east }
            );
            map.fitBounds(googleBounds);
        }
    }, [map, bounds]);

    return (
        <GoogleMap
            style={{ width: '100%', height: '100%' }}
            defaultCenter={center}
            defaultZoom={13}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            // 'DEMO_MAP_ID'를 사용하면 Advanced Marker가 활성화됩니다.
            // 실제 배포 시에는 구글 콘솔에서 생성한 Map ID를 넣는 것이 좋습니다.
            mapId={'DEMO_MAP_ID'}
            colorScheme='LIGHT'
        >
            {markers.map((marker) => (
                <AdvancedMarker
                    key={marker.id}
                    position={marker.position}
                    title={marker.title}
                >
                    <Pin background={'#6366f1'} borderColor={'#ffffff'} glyphColor={'#ffffff'} />
                </AdvancedMarker>
            ))}
        </GoogleMap>
    );
};
