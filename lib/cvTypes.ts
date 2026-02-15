export interface CVPersonal {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  linkedIn: string;
  website: string;
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVSkillGroup {
  id: string;
  name: string;
  items: string[];
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CVLanguage {
  id: string;
  language: string;
  proficiency: string;
}

export interface CVReference {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
}

export interface CVData {
  personal: CVPersonal;
  summary: string;
  education: CVEducation[];
  experience: CVExperience[];
  skills: CVSkillGroup[];
  certifications: CVCertification[];
  languages: CVLanguage[];
  references: CVReference[];
}

export const defaultPersonal: CVPersonal = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  linkedIn: '',
  website: '',
};

export const defaultEducation = (): CVEducation => ({
  id: crypto.randomUUID?.() ?? `ed-${Date.now()}`,
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  description: '',
});

export const defaultExperience = (): CVExperience => ({
  id: crypto.randomUUID?.() ?? `ex-${Date.now()}`,
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
});

export const defaultSkillGroup = (): CVSkillGroup => ({
  id: crypto.randomUUID?.() ?? `sg-${Date.now()}`,
  name: '',
  items: [],
});

export const defaultCertification = (): CVCertification => ({
  id: crypto.randomUUID?.() ?? `cert-${Date.now()}`,
  name: '',
  issuer: '',
  date: '',
});

export const defaultLanguage = (): CVLanguage => ({
  id: crypto.randomUUID?.() ?? `lang-${Date.now()}`,
  language: '',
  proficiency: '',
});

export const defaultReference = (): CVReference => ({
  id: crypto.randomUUID?.() ?? `ref-${Date.now()}`,
  name: '',
  role: '',
  company: '',
  email: '',
  phone: '',
});

export const defaultCVData: CVData = {
  personal: { ...defaultPersonal },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  certifications: [],
  languages: [],
  references: [],
};
