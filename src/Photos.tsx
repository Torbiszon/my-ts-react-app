import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Photos.css';

interface Photo {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  url: string;
}

const Photos: React.FC = () => {
  const { albumId } = useParams<{ albumId?: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchPhotoId, setSearchPhotoId] = useState<string>('');
  const [searchAlbumId, setSearchAlbumId] = useState<string>('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        let url = 'https://jsonplaceholder.typicode.com/photos';
        if (albumId) {
          url += `?albumId=${albumId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }

        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, [albumId]);

  const handleEnlargePhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const filteredPhotos = photos.filter((photo) => {
    const matchesPhotoId = searchPhotoId ? photo.id.toString().includes(searchPhotoId) : true;
    const matchesAlbumId = searchAlbumId ? photo.albumId.toString().includes(searchAlbumId) : true;

    return matchesPhotoId && matchesAlbumId;
  });

  return (
    <div className="photos-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Photo ID"
          value={searchPhotoId}
          onChange={(e) => setSearchPhotoId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Album ID"
          value={searchAlbumId}
          onChange={(e) => setSearchAlbumId(e.target.value)}
        />
      </div>

      <ul className="photos-list">
        {filteredPhotos.map((photo) => (
          <li key={photo.id} className="photo-item">
            <img
              src={photo.thumbnailUrl}
              alt={`Thumbnail ${photo.id}`}
              onClick={() => handleEnlargePhoto(photo)}
            />
          </li>
        ))}
      </ul>
      {selectedPhoto && (
        <div className={`photo-modal ${selectedPhoto && 'active'}`} onClick={handleClosePhoto}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.url} alt={`Enlarged ${selectedPhoto.id}`} />
            <button onClick={handleClosePhoto}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
