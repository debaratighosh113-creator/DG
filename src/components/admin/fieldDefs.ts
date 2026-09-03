import type { FieldDef } from '@/components/admin/CrudEditor';

export const educationFields: FieldDef[] = [
  {
    key: 'degree',
    label: 'Degree / Program',
    type: 'text',
    required: true,
    placeholder: 'GNM Nursing 1st Year',
  },
  {
    key: 'school',
    label: 'School / Institution',
    type: 'text',
    required: true,
    placeholder: 'Angel Day Nursing School of Nursing',
  },
  {
    key: 'start_date',
    label: 'Start',
    type: 'text',
    placeholder: '2023',
  },
  {
    key: 'end_date',
    label: 'End',
    type: 'text',
    placeholder: '2023',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
  },
  {
    key: 'marksheet_url',
    label: 'Marksheet document',
    type: 'file',
    placeholder: 'Upload marksheet PDF',
  },
  {
    key: 'sort_order',
    label: 'Sort order',
    type: 'number',
    min: 0,
  },
];

export const clinicalFields: FieldDef[] = [
  {
    key: 'facility',
    label: 'Facility',
    type: 'text',
    required: true,
    placeholder: 'Hospital / Healthcare Facility',
  },
  {
    key: 'unit',
    label: 'Unit',
    type: 'text',
    required: true,
    placeholder: 'Medical-Surgical',
  },
  {
    key: 'start_date',
    label: 'Start',
    type: 'text',
    placeholder: 'Jan 2025',
  },
  {
    key: 'end_date',
    label: 'End',
    type: 'text',
    placeholder: 'May 2025',
  },
  {
    key: 'hours',
    label: 'Hours',
    type: 'number',
    placeholder: '180',
    min: 0,
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
  },
  {
    key: 'skills_practiced',
    label: 'Skills practiced (comma-separated)',
    type: 'text',
    placeholder: 'Vitals, wound care, IV therapy',
  },
  {
    key: 'sort_order',
    label: 'Sort order',
    type: 'number',
    min: 0,
  },
];

export const skillsFields: FieldDef[] = [
  {
    key: 'name',
    label: 'Skill name',
    type: 'text',
    required: true,
    placeholder: 'Wound Care',
  },
  {
    key: 'category',
    label: 'Category',
    type: 'text',
    required: true,
    placeholder: 'Clinical',
  },
  {
    key: 'proficiency',
    label: 'Proficiency',
    type: 'select',
    options: [
      'Beginner',
      'Intermediate',
      'Advanced',
    ],
    required: true,
  },
  {
    key: 'sort_order',
    label: 'Sort order',
    type: 'number',
    min: 0,
  },
];

export const certificationsFields: FieldDef[] = [
  {
    key: 'name',
    label: 'Certification name',
    type: 'text',
    required: true,
    placeholder: 'CPR / BLS / Other Certification',
  },
  {
    key: 'issuer',
    label: 'Issuer',
    type: 'text',
    placeholder: 'Issuing organization',
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
    label: 'Certificate document',
    type: 'file',
    placeholder: 'Upload certificate PDF',
  },
  {
    key: 'sort_order',
    label: 'Sort order',
    type: 'number',
    min: 0,
  },
];

export const projectsFields: FieldDef[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    required: true,
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
  },
  {
    key: 'link',
    label: 'Link (URL)',
    type: 'text',
    placeholder: 'https://…',
  },
  {
    key: 'image',
    label: 'Project image',
    type: 'file',
    placeholder: 'Upload project image',
  },
  {
    key: 'sort_order',
    label: 'Sort order',
    type: 'number',
    min: 0,
  },
];

export const achievementsFields: FieldDef[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Achievement',
  },
  {
    key: 'date',
    label: 'Date',
    type: 'text',
    placeholder: '2024',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
  },
  {
    key: 'sort_order',
    label: 'Sort order',
    type: 'number',
    min: 0,
  },
];