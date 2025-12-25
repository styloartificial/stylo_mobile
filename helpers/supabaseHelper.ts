import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON;
const supabaseBucket = process.env.EXPO_PUBLIC_SUPABASE_BUCKET;

if (!supabaseUrl || !supabaseAnonKey || !supabaseBucket) {
  throw new Error(
    'Variabel EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON, dan EXPO_PUBLIC_SUPABASE_BUCKET harus ada di .env',
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseService = {
  client: supabase,

  async upload(sectionName: string, file: any) {
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `${sectionName}/${uniqueFileName}`;

    const { data, error } = await supabase.storage.from(supabaseBucket).upload(filePath, file);

    if (error) {
      console.error('Supabase upload error:', error.message);
      throw error;
    }

    return data?.path;
  },

  getPublicUrl(filePath: string) {
    const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath);
    return data?.publicUrl;
  },
};

export default supabaseService;
