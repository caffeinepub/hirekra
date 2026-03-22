import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> { __kind__: "Some"; value: T; }
export interface None { __kind__: "None"; }
export type Option<T> = Some<T> | None;

export interface Submission {
  id: bigint;
  name: string;
  email: string;
  company: string;
  timestamp: bigint;
  hiringNeeds: string;
  formSource: string;
}

export interface CareerApplication {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  timestamp: bigint;
}

export interface JobListing {
  id: bigint;
  title: string;
  jobType: string;
  location: string;
  description: string;
  skills: string;
  isInternship: boolean;
  duration: string;
  stipend: string;
  isActive: boolean;
  createdAt: bigint;
}

export interface backendInterface {
  clearSubmissions(password: string): Promise<void>;
  getAllSubmissions(password: string): Promise<Array<Submission>>;
  getAllCareerApplications(password: string): Promise<Array<CareerApplication>>;
  getAllJobListings(password: string): Promise<Array<JobListing>>;
  getActiveJobs(): Promise<Array<JobListing>>;
  submitForm(name: string, email: string, company: string, hiringNeeds: string, formSource: string): Promise<bigint>;
  submitCareerApplication(name: string, email: string, phone: string, position: string, coverLetter: string): Promise<bigint>;
  createJobListing(password: string, title: string, jobType: string, location: string, description: string, skills: string, isInternship: boolean, duration: string, stipend: string): Promise<bigint>;
  toggleJobActive(password: string, jobId: bigint): Promise<boolean>;
  deleteJobListing(password: string, jobId: bigint): Promise<void>;
}
