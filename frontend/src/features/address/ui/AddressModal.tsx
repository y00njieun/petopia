import React, { useState, useEffect } from 'react';
import AddressSearch from '../../../shared/ui/AddressSearch';
import { Address, AddressFormData } from '../model/Address'
import './AddressModal.css';

interface AddressModalProps {
  onClose: () => void;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onDelete?: (addressId: string | number) => Promise<void>;
  initialData?: Address | null;
  isEditing?: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({
  onClose,
  onSubmit,
  onDelete,
  initialData,
  isEditing
}) => {
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>(
    initialData || {
      address_name: '',
      recipient_name: '',
      recipient_phone: '',
      address: '',
      detailed_address: '',
      postal_code: '',
      is_default: false
    }
  );

  useEffect(() => {
    if (initialData) {
      console.log('AddressModal 초기 데이터 수신:', {
        full: initialData,
        postal_before_set: initialData.postal_code
      });

      // formData 설정 직전 데이터 확인
      const newFormData = {
        ...initialData,
        detailed_address: initialData.detailed_address || '',
        postal_code: initialData.postal_code || ''
      };
      console.log('formData 설정 직전:', newFormData);
      
      setFormData(newFormData);
    }
  }, [initialData]);

  // formData 변경 감지
  useEffect(() => {
    console.log('formData 변경됨:', {
      postal: formData.postal_code,
      full: formData
    });
  }, [formData]);

  const handleAddressComplete = (data: { address: string; zonecode: string }) => {
    console.log('DaumPostcode 결과:', {
      address: data.address,
      zonecode: data.zonecode,
      fullData: data
    });
    setFormData(prev => ({
      ...prev,
      address: data.address,
      postal_code: data.zonecode
    }));
    setShowAddressSearch(false);
  };

  const handleDelete = async () => {
    if (initialData?.address_id && onDelete) {
      await onDelete(initialData.address_id);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('제출할 주소 데이터:', formData);
      await onSubmit({
        ...formData,
        postal_code: formData.postal_code || '',  // 우편번호가 없을 경우 빈 문자열
        detailed_address: formData.detailed_address || ''  // 상세주소가 없을 경우 빈 문자열
      });
      onClose();
    } catch (error) {
      console.error('주소 저장 실패:', error);
      alert('주소 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="address-modal-overlay">
      <div className="address-modal">
        <div className="address-modal-header">
          <h3>{isEditing ? '배송지 수정' : '새 배송지 추가'}</h3>
          <button onClick={onClose} className="close-button" aria-label="닫기">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address_name">배송지명</label>
            <input
              id="address_name"
              type="text"
              value={formData.address_name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address_name: e.target.value
              }))}
              placeholder="배송지명을 입력해주세요 (예: 집, 회사)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipient_name">받는 사람</label>
            <input
              id="recipient_name"
              type="text"
              value={formData.recipient_name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                recipient_name: e.target.value
              }))}
              placeholder="받는 사람을 입력해주세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipient_phone">연락처</label>
            <input
              id="recipient_phone"
              type="tel"
              value={formData.recipient_phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                recipient_phone: e.target.value
              }))}
              placeholder="연락처를 입력해주세요"
              pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postal_code">우편번호</label>
            <div className="address-search-group">
              <input
                id="postal_code"
                type="text"
                value={formData.postal_code}
                readOnly
                placeholder="우편번호"
                required
              />
              <button 
                type="button"
                onClick={() => setShowAddressSearch(true)}
                className="address-search-button"
              >
                주소 찾기
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">기본 주소</label>
            <input
              id="address"
              type="text"
              value={formData.address}
              readOnly
              placeholder="기본 주소"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="detailed_address">상세 주소</label>
            <input
              id="detailed_address"
              type="text"
              value={formData.detailed_address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                detailed_address: e.target.value
              }))}
              placeholder="상세 주소를 입력해주세요"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  is_default: e.target.checked
                }))}
              />
              기본 배송지로 설정
            </label>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              취소
            </button>
            <div className="right-buttons">
              {isEditing && (
                <button type="button" onClick={handleDelete} className="delete-button">
                  삭제
                </button>
              )}
              <button type="submit" className="save-button">
                {isEditing ? '수정' : '저장'}
              </button>
            </div>
          </div>
        </form>

        {showAddressSearch && (
          <AddressSearch
            onComplete={handleAddressComplete}
            onClose={() => setShowAddressSearch(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AddressModal; 