export type UnitCategory =
  | 'fully_self_contained'
  | 'no_hob_self_contained'
  | 'en_suite'
  | 'shared_bathroom';

export type ComplianceCategory =
  | 'gas'
  | 'ecir'
  | 'fra'
  | 'fire_detection'
  | 'emergency_lighting'
  | 'epc'
  | 'floor_plan';

export type PhotoPosition = 'front' | 'back';

export type Property = {
  id: string;
  name: string;
  address: string | null;
  notes: string | null;
  gas_provider: string | null;
  electric_provider: string | null;
  water_provider: string | null;
  council_tax_provider: string | null;
  created_at: string;
};

export type Unit = {
  id: string;
  property_id: string;
  name: string;
  category: UnitCategory;
  notes: string | null;
  room_length_m: number | null;
  room_width_m: number | null;
  toilet_length_m: number | null;
  toilet_width_m: number | null;
  living_kitchen_length_m: number | null;
  living_kitchen_width_m: number | null;
  created_at: string;
};

export type Photo = {
  id: string;
  unit_id: string | null;
  property_id: string | null;
  storage_path: string;
  label: string | null;
  sort_order: number;
  position: PhotoPosition | null;
  is_cover: boolean;
  created_at: string;
};

export type SentEmail = {
  id: string;
  property_id: string | null;
  unit_id: string | null;
  subject: string | null;
  photo_count: number;
  sent_at: string;
};

export type ComplianceDocument = {
  id: string;
  property_id: string;
  category: ComplianceCategory;
  name: string;
  storage_path: string;
  expiry_date: string | null;
  created_at: string;
};

export type UtilityKey =
  | 'gas_provider'
  | 'electric_provider'
  | 'water_provider'
  | 'council_tax_provider';

type EmptyMap = { [_ in never]: never };

type PropertyMutable = {
  name?: string;
  address?: string | null;
  notes?: string | null;
  gas_provider?: string | null;
  electric_provider?: string | null;
  water_provider?: string | null;
  council_tax_provider?: string | null;
};

type UnitDimensionsMutable = {
  room_length_m?: number | null;
  room_width_m?: number | null;
  toilet_length_m?: number | null;
  toilet_width_m?: number | null;
  living_kitchen_length_m?: number | null;
  living_kitchen_width_m?: number | null;
};

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: Property;
        Insert: PropertyMutable & { id?: string; name: string; created_at?: string };
        Update: PropertyMutable & { id?: string; created_at?: string };
        Relationships: [];
      };
      units: {
        Row: Unit;
        Insert: UnitDimensionsMutable & {
          id?: string;
          property_id: string;
          name: string;
          category: UnitCategory;
          notes?: string | null;
          created_at?: string;
        };
        Update: UnitDimensionsMutable & {
          id?: string;
          property_id?: string;
          name?: string;
          category?: UnitCategory;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      sent_emails: {
        Row: SentEmail;
        Insert: {
          id?: string;
          property_id?: string | null;
          unit_id?: string | null;
          subject?: string | null;
          photo_count?: number;
          sent_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string | null;
          unit_id?: string | null;
          subject?: string | null;
          photo_count?: number;
          sent_at?: string;
        };
        Relationships: [];
      };
      photos: {
        Row: Photo;
        Insert: {
          id?: string;
          unit_id?: string | null;
          property_id?: string | null;
          storage_path: string;
          label?: string | null;
          sort_order?: number;
          position?: PhotoPosition | null;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          unit_id?: string | null;
          property_id?: string | null;
          storage_path?: string;
          label?: string | null;
          sort_order?: number;
          position?: PhotoPosition | null;
          is_cover?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      compliance_documents: {
        Row: ComplianceDocument;
        Insert: {
          id?: string;
          property_id: string;
          category: ComplianceCategory;
          name: string;
          storage_path: string;
          expiry_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          category?: ComplianceCategory;
          name?: string;
          storage_path?: string;
          expiry_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: EmptyMap;
    Functions: EmptyMap;
    Enums: EmptyMap;
    CompositeTypes: EmptyMap;
  };
};
