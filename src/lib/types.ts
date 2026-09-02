export type Profile = {
  id: string;
  full_name: string;
  tagline: string;
  bio: string;
  hero_image: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  accent_color: string;
  updated_at: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  marksheet_url: string | null;
  sort_order: number;
  created_at: string;
};

export type ClinicalExperience = {
  id: string;
  facility: string;
  unit: string;
  start_date: string | null;
  end_date: string | null;
  hours: number | null;
  description: string | null;
  skills_practiced: string | null;
  sort_order: number;
  created_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  sort_order: number;
  created_at: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  document_url: string | null;
  sort_order: number;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  image: string | null;
  sort_order: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  date: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type TableName =
  | 'profile'
  | 'education'
  | 'clinical_experience'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'achievements'
  | 'contact_messages';
