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
  outfitDetail?: string; // tambah ini
  scanCategoryId: SelectedCategoryPayload;
}): Promise<{ ticket_id: string }> => {
  const formData = new FormData();

  formData.append('img_url', params.imageFile as any);
  formData.append('title', params.title);
  
  if (params.outfitDetail) {
    formData.append('outfit_detail', params.outfitDetail); // tambah ini
  }

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

export type ScanProduct = {
  name: string;
  img_url: string;
  link_url: string;
  price: string;
  rating: string;
  total_buy: string;
};

export type ScanResultData = {
  ticket_id: string;
  title: string;
  summary: string;
  img_urls: string[];
};

export const getScanResult = async (ticketId: string): Promise<ScanResultData> => {
  const res = await axiosInstance.get(`/core/scan-result/${ticketId}`);
  return res.data.data as ScanResultData;
};

export const getScanProducts = (
  ticketId: string,
  onData: (products: ScanProduct[]) => void
) => {
  const { ref, query, orderByChild, equalTo, onValue, off } = require('firebase/database');
  const { database } = require('helpers/firebaseHelper');

  const ticketRef = query(
    ref(database, 'ticket-request'),
    orderByChild('ticket_id'),
    equalTo(ticketId)
  );

  onValue(ticketRef, (snapshot: any) => {
    if (!snapshot.exists()) return;
    const raw = snapshot.val();
    const entries = Object.values(raw) as any[];
    const ticket = entries.find((e: any) => e.ticket_id === ticketId);
    if (ticket?.data) {
      const products: ScanProduct[] = Object.values(ticket.data);
      onData(products);
    }
  });

  return () => off(ticketRef);
};