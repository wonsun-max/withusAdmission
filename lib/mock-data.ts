import type {
  AdmissionTrack,
  AdmissionFamily,
  DocumentRequirement,
  GuidelineSource,
  StudentProfile,
  UniversityGuideline
} from "./admission-types";

// Zeroed out mock data - application will now rely on DB seeding and service upload
export const sampleProfile: StudentProfile = {
  id: "empty",
  name: "New Student",
  dateOfBirth: "",
  track: "SPECIAL_12YR",
  targetMajor: "",
  countryContext: "",
  parentConsent: {
    status: "not-required",
    requiredBecause: { en: "", ko: "" }
  },
  accountLinks: [],
  gpaData: [],
  standardizedTests: [],
  extracurriculars: [],
  approvedFacts: []
};

export const universityGuidelines: UniversityGuideline[] = [];

export const consultantStudents: any[] = [];
