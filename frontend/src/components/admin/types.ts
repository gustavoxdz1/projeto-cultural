export type AdminPlaceFormState = {
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  categoryId: string;
};

export const INITIAL_ADMIN_PLACE_FORM: AdminPlaceFormState = {
  name: '',
  description: '',
  address: '',
  neighborhood: '',
  latitude: '',
  longitude: '',
  imageUrl: '',
  categoryId: '',
};
