import React, { useState } from "react";
import "./CSS/ProductCreate.css";

interface ProductImgProps {
  onUpload: (mainImage: File | null, detailImages: File[]) => void;
}

const ProductImg: React.FC<ProductImgProps> = ({ onUpload }) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [detailImages, setDetailImages] = useState<File[]>([]);

  // 대표 이미지
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (mainImage) {
        alert("대표 이미지는 1개만 업로드할 수 있습니다.");
        return;
      }

      setMainImage(file);
      onUpload(file, detailImages);
    }
  };

  // 상세 이미지
  const handleDetailImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
  
      const totalImages = detailImages.length + filesArray.length;
  
      if (totalImages > 5) {
        alert("상세 이미지는 최대 5개까지만 업로드할 수 있습니다.");
        return;
      }
  
      setDetailImages((prev) => [...prev, ...filesArray]);
      onUpload(mainImage, [...detailImages, ...filesArray]);
    }
  };

  const handleRemoveAllImages = () => {
    setMainImage(null);
    setDetailImages([]);
    onUpload(null, []);
  };

  return (
    <div className="img-container">
      <div className="image-upload-section">
        <h2>대표 이미지</h2>
        <label htmlFor="main-image-upload" className="image-upload-box">
          <div className="image-preview">
            {mainImage ? (
              <img src={URL.createObjectURL(mainImage)} alt="대표 이미지" />
            ) : (
              <>
                <span className="material-symbols-outlined">image</span>
                <p>필수 이미지 업로드</p>
                <span>또는 드래그 앤 드롭</span>
                <small>PNG, JPG 1개 제한</small>
              </>
            )}
          </div>
          <input
            id="main-image-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleMainImageUpload}
            hidden
          />
        </label>
      </div>

      <div className="image-upload-section">
        <h2>상세 이미지</h2>
        <label htmlFor="detail-image-upload" className="image-upload-box">
          <div className="image-preview">
            {detailImages.length > 0 ? (
              detailImages.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`상세 이미지 ${index}`} />
              ))
            ) : (
              <>
                <span className="material-symbols-outlined">image</span>
                <p>이미지 업로드</p>
                <span>또는 드래그 앤 드롭</span>
                <small>PNG, JPG 최대 5개 업로드 가능</small>
              </>
            )}
          </div>
          <input
            id="detail-image-upload"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleDetailImageUpload}
            hidden
          />
        </label>
      </div>

      <div className="button-container">
        <button type="button" className="remove-all-btn" onClick={handleRemoveAllImages}>
          모든 이미지 삭제
        </button>
        
      </div>
    </div>
  );
};

export default ProductImg;
