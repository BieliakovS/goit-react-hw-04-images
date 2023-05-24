import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import css from './App.module.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34987662-26e97d4e150e3c854c752264a';
const PER_PAGE = 12;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (searchQuery === '') return;
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${BASE_URL}?q=${searchQuery}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`
        );
        const data = await response.json();

        if (data.total === 0) {
          alert('No images found');
          return;
        }

        setImages(prevImages => [...prevImages, ...data.hits]);
        setTotalImages(data.total);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, currentPage]);

  const handleSubmit = newSearchQuery => {
    if (searchQuery === newSearchQuery) {
      alert(`You already searched for "${newSearchQuery}"`);
      return;
    }
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
    setImages([]);
    setTotalImages(0);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleImageClick = image => {
    setShowModal(true);
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleSubmit} />
      {images.length > 0 && (
        <ImageGallery>
          {images.map(image => (
            <ImageGalleryItem
              key={image.id}
              image={image}
              onImageClick={handleImageClick}
            />
          ))}
        </ImageGallery>
      )}

      {isLoading && <Loader />}

      {images.length > 0 && !isLoading && <Button onClick={handleLoadMore} />}

      {showModal && <Modal image={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
