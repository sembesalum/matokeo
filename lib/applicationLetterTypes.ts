export interface RecipientBlock {
  title: string;
  companyName: string;
  address: string;
}

export interface ApplicationLetterData {
  date: string;
  applicant: {
    name: string;
    institution: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
  };
  recipient: RecipientBlock;
  recipient2: RecipientBlock | null;
  salutation: string;
  referenceLine: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  bodyParagraph3: string;
  closingLine: string;
  closing: string;
  signatureName: string;
}

const defaultRecipient: RecipientBlock = {
  title: '',
  companyName: '',
  address: '',
};

export const defaultLetterData: ApplicationLetterData = {
  date: new Date().toISOString().slice(0, 10),
  applicant: {
    name: '',
    institution: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
  },
  recipient: { ...defaultRecipient },
  recipient2: null,
  salutation: 'Dear sir,',
  referenceLine: '',
  bodyParagraph1: '',
  bodyParagraph2: '',
  bodyParagraph3: '',
  closingLine: '',
  closing: 'Sincerely,',
  signatureName: '',
};

export { defaultRecipient };
