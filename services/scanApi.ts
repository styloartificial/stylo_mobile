import axiosInstance from '../helpers/axiosHelper';

// ============================================================
// TYPES
// ============================================================

export type ScanCategory = {
  id: number;
  title: string;
  icon: string;
  type: 'item' | 'occasion' | 'style' | 'hijab';
};

export type ScanCategoriesGrouped = {
  item: ScanCategory[];
  occasion: ScanCategory[];
  style: ScanCategory[];
  hijab: ScanCategory[];
};

export type SelectedCategoryPayload = {
  item: number[];
  occasion: number[];
  style: number[];
  hijab: number[];
};

// ============================================================
// VALIDATE IMAGE
// ============================================================

export const validateImageByGender = async (imageFile: { uri: string; type: string; name: string }): Promise<boolean> => {
  const formData = new FormData();
  formData.append('img_url', imageFile as any);

  console.log("Form Data");
  console.log(formData);

  const res = await axiosInstance.post('/core/validate-image-by-profile-gender', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    },
    timeout: 60000,
  });
  return res.data.data as boolean;
};
// ============================================================
// GET SCAN CATEGORIES
// ============================================================

export const getScanCategories = async (): Promise<ScanCategoriesGrouped> => {
  const res = await axiosInstance.get('/core/master/scan-categories');
  const all: ScanCategory[] = res.data.data;

  console.log('=== SCAN CATEGORIES ===');
  console.log('RAW:', JSON.stringify(all));

  return {
    item: all.filter(c => c.type === 'item'),
    occasion: all.filter(c => c.type === 'occasion'),
    style: all.filter(c => c.type === 'style'),
    hijab: all.filter(c => c.type === 'hijab'),
  };
};

// ============================================================
// OPEN TICKET
// ============================================================

export const openTicket = async (params: {
  imageFile: { uri: string; type: string; name: string };
  title: string;
  scanCategoryId: SelectedCategoryPayload;
}): Promise<{ ticket_id: string }> => {
  const formData = new FormData();

  formData.append('img_url', params.imageFile as any);

  formData.append('title', params.title);

  // Append nested array: scan_category_id[item][], scan_category_id[occasion][], dst
  const types = ['item', 'occasion', 'style', 'hijab'] as const;
  types.forEach(type => {
    params.scanCategoryId[type].forEach(id => {
      formData.append(`scan_category_id[${type}][]`, String(id));
    });
  });

  const res = await axiosInstance.post('/core/open-ticket', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    },
  });
  return res.data.data;
};