import React, { useEffect, useRef } from 'react';
import './AddressSearch.css';

interface AddressData {
  address: string;
  zonecode: string;
  buildingName?: string;
}

interface AddressSearchProps {
  onComplete: (data: AddressData) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: AddressData) => void;
        onclose?: () => void;
      }) => {
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onComplete, onClose }) => {
  const postcodeRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    
    script.onload = () => {
      const container = document.getElementById('address-search-container');
      if (container && !postcodeRef.current) {
        postcodeRef.current = new window.daum.Postcode({
          oncomplete: (data: AddressData) => {
            onComplete({
              address: data.address,
              zonecode: data.zonecode,
              buildingName: data.buildingName
            });
            if (onClose) onClose();
          },
          onclose: onClose
        });
        postcodeRef.current.embed(container);
      }
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
      postcodeRef.current = null;
    };
  }, [onComplete, onClose]);

  return (
    <div className="address-search-modal">
      <div className="address-search-content">
        <div className="address-search-header">
          <h3>주소 검색</h3>
          {onClose && (
            <button onClick={onClose} className="close-button" aria-label="닫기">
              ✕
            </button>
          )}
        </div>
        <div id="address-search-container" className="address-search-container"></div>
      </div>
    </div>
  );
};

export default AddressSearch; 