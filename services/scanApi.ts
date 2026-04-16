import axiosInstance from '../helpers/axiosHelper';

export const validateImageByGender = async (imageUri: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('img_url', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'outfit.jpg',
    } as any);

    console.log('=== VALIDATE IMAGE ===');
    console.log('URI:', imageUri);

    const res = await axiosInstance.post(
      '/core/validate-image-by-profile-gender',
      formData
    );

    console.log('SUCCESS:', JSON.stringify(res.data));
    return res.data.data as boolean;

  } catch (error: any) {
    console.log('=== ERROR ===');
    console.log('STATUS:', error?.response?.status);
    console.log('DATA:', JSON.stringify(error?.response?.data));
    console.log('HEADERS SENT:', JSON.stringify(error?.config?.headers));
    console.log('NETWORK ERROR:', error?.message);
    throw error;
  }
};

export const getScanCategories = async () => {
  const res = await axiosInstance.get('/core/master/scan-categories');
  return res.data.data as { id: number; title: string; icon: string }[];
};

export const openTicket = async (params: {
  imageUri: string;
  title: string;
  scanCategoryId: number;
}): Promise<{ ticket_id: string }> => {
  const formData = new FormData();
  formData.append('img_url', {
    uri: params.imageUri,
    type: 'image/jpeg',
    name: 'outfit.jpg',
  } as any);
  formData.append('title', params.title);
  formData.append('scan_category_id', String(params.scanCategoryId));

  const res = await axiosInstance.post('/core/open-ticket', formData);
  return res.data.data;
};