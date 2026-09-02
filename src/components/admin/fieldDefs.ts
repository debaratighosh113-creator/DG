import type { FieldDef } from '@/components/admin/CrudEditor';

export const educationFields: FieldDef[] = [
  { key: 'degree', label: 'Degree / Program', type: 'text', required: true, placeholder: 'BSN' },
  { key: 'school', label: 'School', type: 'text', required: true, placeholder: 'University of Health Sciences' },
  { key: 'start_date', label: 'Start', type: 'text', placeholder: '2022' },
  { key: 'end_date', label: 'End', type: 'text', placeholder: '2026 (Expected)' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'marksheet_url', label: 'Marksheet document URL', type: 'text', placeholder: '/documents/marksheet.pdf' },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
];

export const clinicalFields: FieldDef[] = [
  { key: 'facility', label: 'Facility', type: 'text', required: true, placeholder: 'St. Mary Medical Center' },
  { key: 'unit', label: 'Unit', type: 'text', required: true, placeholder: 'Medical-Surgical' },
  { key: 'start_date', label: 'Start', type: 'text', placeholder: 'Jan 2025' },
  { key: 'end_date', label: 'End', type: 'text', placeholder: 'May 2025' },
  { key: 'hours', label: 'Hours', type: 'number', placeholder: '180' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'skills_practiced', label: 'Skills practiced (comma-separated)', type: 'text', placeholder: 'Vitals, wound care, IV therapy' },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
];

export const skillsFields: FieldDef[] = [
  { key: 'name', label: 'Skill name', type: 'text', required: true, placeholder: 'Wound Care' },
  { key: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Clinical' },
  { key: 'proficiency', label: 'Proficiency', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
];

export const certificationsFields: FieldDef[] = [
  {
    key: 'name',
    label: 'Certification name',
    type: 'text',
    required: true,
    placeholder: 'Basic Life Support (BLS)',
  },
  {
    key: 'issuer',
    label: 'Issuer',
    type: 'text',
    placeholder: 'American Heart Association',
  },
  {
    key: 'issue_date',
    label: 'Issue date',
    type: 'text',
    placeholder: 'YYYY-MM',
  },
  {
    key: 'expiry_date',
    label: 'Expiry date',
    type: 'text',
    placeholder: 'YYYY-MM',
  },
  {
    key: 'credential_id',
    label: 'Credential ID',
    type: 'text',
    placeholder: 'Optional',
  },
  {
    key: 'document_url',
    label: 'Certificate document URL',
    type: 'text',
    placeholder: '/documents/certificate.pdf',
  },
  {
    key: 'sort_order',
    label: 'Sort order',
    type: 'number',
    min: 0,
  },
];

export const projectsFields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'link', label: 'Link (URL)', type: 'text', placeholder: 'https://…' },
  { key: 'image', label: 'Image URL', type: 'text', placeholder: 'https://…' },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
];

export const achievementsFields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, placeholder: "Dean's List" },
  { key: 'date', label: 'Date', type: 'text', placeholder: '2024' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'sort_order', label: 'Sort order', type: 'number' },
];
