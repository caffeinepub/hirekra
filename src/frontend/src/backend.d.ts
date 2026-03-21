import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    id: bigint;
    name: string;
    email: string;
    company: string;
    timestamp: bigint;
    hiringNeeds: string;
}
export interface backendInterface {
    clearSubmissions(password: string): Promise<void>;
    getAllSubmissions(password: string): Promise<Array<Submission>>;
    submitForm(name: string, email: string, company: string, hiringNeeds: string): Promise<bigint>;
}
