export interface Address {
  address_id?: string | number;
  user_id?: string;
  address_name: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detailed_address: string;
  postal_code: string;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface AddressFormData {
  address_name: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detailed_address: string;
  postal_code: string;
  is_default: boolean;
} 