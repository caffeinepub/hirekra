import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  CheckCircle,
  Clock,
  Coffee,
  FileText,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Info,
  Lightbulb,
  Linkedin,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Star,
  Target,
  ToggleLeft,
  Trash2,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Submission } from "./backend";

// JobListing type (from backend)
interface JobListing {
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

// Career application type (from backend)
interface CareerApplication {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  timestamp: bigint;
}
import { createActorWithConfig } from "./config";

// Extend Submission type locally to include formSource
type SubmissionWithSource = Submission & { formSource?: string };

// Context for tracking which CTA was clicked
const FormSourceContext = createContext<{
  formSource: string;
  setFormSource: (src: string) => void;
}>({ formSource: "Direct", setFormSource: () => {} });

// --- Scroll animation hook ---
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// --- Admin Dashboard ---
function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"contacts" | "careers" | "jobs">(
    "contacts",
  );
  const [careerApps, setCareerApps] = useState<CareerApplication[]>([]);
  const [careerLoading, setCareerLoading] = useState(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    jobType: "Full-Time",
    location: "",
    description: "",
    skills: "",
    isInternship: false,
    duration: "",
    stipend: "",
  });
  const [postingJob, setPostingJob] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const actor = await createActorWithConfig();
      const data = await actor.getAllSubmissions(password);
      setSubmissions(data);
      setAuthenticated(true);
    } catch {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const actor = await createActorWithConfig();
      const data = await actor.getAllSubmissions(password);
      setSubmissions(data);
    } catch {
      toast.error("Failed to refresh submissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
    setSubmissions([]);
    setError("");
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleString();
  };

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #0A2E45 0%, #0B3D5C 40%, #1E4D7A 70%, #1E6FA8 100%)",
        }}
      >
        <Toaster position="top-center" richColors />
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/assets/uploads/IMG_0928-1.jpeg"
              alt="HireKra Logo"
              className="h-16 w-16 rounded-full object-cover mb-4 shadow-md"
            />
            <h1 className="text-2xl font-extrabold text-[#0A2E45]">
              Hire<span className="text-[#1E6FA8]">Kra</span>
            </h1>
            <h2 className="text-lg font-bold text-gray-700 mt-1">
              Admin Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Enter your password to view partner form submissions.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label
                htmlFor="admin-password"
                className="text-sm font-semibold text-gray-700 mb-1.5 block"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="admin-password"
                  data-ocid="admin.input"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 rounded-xl"
                  required
                />
              </div>
              {error && (
                <p
                  data-ocid="admin.error_state"
                  className="text-red-500 text-xs mt-2"
                >
                  {error}
                </p>
              )}
            </div>
            <Button
              data-ocid="admin.submit_button"
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A2E45] hover:bg-[#0B3D5C] text-white rounded-full py-5 font-bold"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-[#1E6FA8] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "";
              }}
            >
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleLoadCareers = async () => {
    setCareerLoading(true);
    try {
      const actor = await createActorWithConfig();
      const data = (await (actor as any).getAllCareerApplications(
        password,
      )) as CareerApplication[];
      setCareerApps(data);
    } catch {
      toast.error("Failed to load career applications.");
    } finally {
      setCareerLoading(false);
    }
  };

  const handleLoadJobs = async () => {
    setJobsLoading(true);
    try {
      const actor = await createActorWithConfig();
      const data = (await (actor as any).getAllJobListings(
        password,
      )) as JobListing[];
      setJobListings(data);
    } catch {
      toast.error("Failed to load job listings.");
    } finally {
      setJobsLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingJob(true);
    try {
      const actor = await createActorWithConfig();
      await (actor as any).createJobListing(
        password,
        jobForm.title,
        jobForm.jobType,
        jobForm.location,
        jobForm.description,
        jobForm.skills,
        jobForm.isInternship,
        jobForm.duration,
        jobForm.stipend,
      );
      toast.success("Job posted successfully!");
      setJobForm({
        title: "",
        jobType: "Full-Time",
        location: "",
        description: "",
        skills: "",
        isInternship: false,
        duration: "",
        stipend: "",
      });
      handleLoadJobs();
    } catch {
      toast.error("Failed to post job.");
    } finally {
      setPostingJob(false);
    }
  };

  const handleToggleJob = async (jobId: bigint) => {
    try {
      const actor = await createActorWithConfig();
      await (actor as any).toggleJobActive(password, jobId);
      handleLoadJobs();
    } catch {
      toast.error("Failed to toggle job status.");
    }
  };

  const handleDeleteJob = async (jobId: bigint) => {
    if (!window.confirm("Delete this job listing?")) return;
    try {
      const actor = await createActorWithConfig();
      await (actor as any).deleteJobListing(password, jobId);
      toast.success("Job deleted.");
      handleLoadJobs();
    } catch {
      toast.error("Failed to delete job.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header
        className="sticky top-0 z-50 shadow-md"
        style={{
          background: "linear-gradient(135deg, #0A2E45 0%, #1E6FA8 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/IMG_0928-1.jpeg"
              alt="HireKra Logo"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <span className="text-white font-extrabold text-lg">
                Hire<span className="text-[#60C3F5]">Kra</span>
              </span>
              <span className="text-white/60 text-sm ml-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              data-ocid="admin.secondary_button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full"
            >
              <RefreshCw
                size={14}
                className={`mr-1.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              data-ocid="admin.secondary_button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full"
            >
              <LogOut size={14} className="mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            data-ocid="admin.tab"
            type="button"
            onClick={() => setActiveTab("contacts")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "contacts" ? "bg-[#0A2E45] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Contact Submissions
          </button>
          <button
            type="button"
            data-ocid="admin.tab"
            onClick={() => {
              setActiveTab("careers");
              handleLoadCareers();
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "careers" ? "bg-[#0A2E45] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Career Applications
          </button>
          <button
            type="button"
            data-ocid="admin.tab"
            onClick={() => {
              setActiveTab("jobs");
              handleLoadJobs();
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "jobs" ? "bg-[#0A2E45] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Job Postings
          </button>
        </div>

        {activeTab === "jobs" ? (
          <div>
            {/* Post New Job Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
              <h2 className="text-xl font-extrabold text-[#0A2E45] mb-1 flex items-center gap-2">
                <Plus size={20} />
                Post New Job
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Add a new opening to the Careers page
              </p>
              <form
                onSubmit={handlePostJob}
                className="grid sm:grid-cols-2 gap-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="job-title" className="text-sm font-semibold">
                    Job Title *
                  </Label>
                  <Input
                    id="job-title"
                    data-ocid="admin.input"
                    placeholder="e.g. Senior Recruitment Consultant"
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, title: e.target.value }))
                    }
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="job-type" className="text-sm font-semibold">
                    Job Type
                  </Label>
                  <select
                    id="job-type"
                    data-ocid="admin.select"
                    value={jobForm.jobType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setJobForm((p) => ({
                        ...p,
                        jobType: val,
                        isInternship: val === "Internship",
                      }));
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FA8]"
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="job-location"
                    className="text-sm font-semibold"
                  >
                    Location *
                  </Label>
                  <Input
                    id="job-location"
                    data-ocid="admin.input"
                    placeholder="e.g. Mumbai / Remote"
                    value={jobForm.location}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, location: e.target.value }))
                    }
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="job-skills" className="text-sm font-semibold">
                    Required Skills
                  </Label>
                  <Input
                    id="job-skills"
                    data-ocid="admin.input"
                    placeholder="e.g. Talent Acquisition, Communication"
                    value={jobForm.skills}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, skills: e.target.value }))
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="job-desc" className="text-sm font-semibold">
                    Description *
                  </Label>
                  <Textarea
                    id="job-desc"
                    data-ocid="admin.textarea"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm((p) => ({ ...p, description: e.target.value }))
                    }
                    required
                    className="rounded-xl min-h-[80px] resize-none"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="job-internship"
                    data-ocid="admin.checkbox"
                    checked={jobForm.isInternship}
                    onChange={(e) =>
                      setJobForm((p) => ({
                        ...p,
                        isInternship: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#0A2E45]"
                  />
                  <Label
                    htmlFor="job-internship"
                    className="text-sm font-semibold cursor-pointer"
                  >
                    Is Internship?
                  </Label>
                </div>
                {jobForm.isInternship && (
                  <>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="job-duration"
                        className="text-sm font-semibold"
                      >
                        Duration
                      </Label>
                      <Input
                        id="job-duration"
                        data-ocid="admin.input"
                        placeholder="e.g. 3 Months"
                        value={jobForm.duration}
                        onChange={(e) =>
                          setJobForm((p) => ({
                            ...p,
                            duration: e.target.value,
                          }))
                        }
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="job-stipend"
                        className="text-sm font-semibold"
                      >
                        Stipend
                      </Label>
                      <Input
                        id="job-stipend"
                        data-ocid="admin.input"
                        placeholder="e.g. ₹8,000/month"
                        value={jobForm.stipend}
                        onChange={(e) =>
                          setJobForm((p) => ({ ...p, stipend: e.target.value }))
                        }
                        className="rounded-xl"
                      />
                    </div>
                  </>
                )}
                <div className="sm:col-span-2">
                  <Button
                    data-ocid="admin.submit_button"
                    type="submit"
                    disabled={postingJob}
                    className="bg-[#0A2E45] hover:bg-[#1E6FA8] text-white rounded-full px-8 font-bold transition-colors"
                  >
                    {postingJob ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Existing Jobs Table */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0A2E45]">
                All Job Listings
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadJobs}
                disabled={jobsLoading}
                className="rounded-full border-gray-200"
              >
                <RefreshCw
                  size={14}
                  className={`mr-1.5 ${jobsLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
            {jobsLoading ? (
              <div
                data-ocid="admin.loading_state"
                className="flex items-center justify-center py-16"
              >
                <RefreshCw size={28} className="animate-spin text-[#1E6FA8]" />
              </div>
            ) : jobListings.length === 0 ? (
              <div
                data-ocid="admin.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-200"
              >
                <Briefcase size={32} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-gray-600 mb-1">
                  No job listings yet
                </h3>
                <p className="text-gray-400 text-sm">
                  Use the form above to add your first opening.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table data-ocid="admin.table" className="w-full">
                  <thead>
                    <tr
                      style={{
                        background: "linear-gradient(135deg, #0A2E45, #1E4D7A)",
                      }}
                    >
                      <th className="text-left px-5 py-3 text-white text-xs font-bold uppercase tracking-wider">
                        Title
                      </th>
                      <th className="text-left px-5 py-3 text-white text-xs font-bold uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-left px-5 py-3 text-white text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                        Location
                      </th>
                      <th className="text-left px-5 py-3 text-white text-xs font-bold uppercase tracking-wider hidden sm:table-cell">
                        Internship
                      </th>
                      <th className="text-left px-5 py-3 text-white text-xs font-bold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-white text-xs font-bold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobListings.map((job, i) => (
                      <tr
                        key={String(job.id)}
                        data-ocid={`admin.row.item.${i + 1}`}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800 text-sm">
                            {job.title}
                          </p>
                          <p className="text-xs text-gray-400 md:hidden">
                            {job.location}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            {job.jobType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 hidden md:table-cell">
                          {job.location}
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          {job.isInternship ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                              Yes
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-semibold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {job.isActive ? (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-semibold">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              data-ocid={`admin.toggle.${i + 1}`}
                              onClick={() => handleToggleJob(job.id)}
                              title={job.isActive ? "Deactivate" : "Activate"}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1E6FA8] transition-colors"
                            >
                              <ToggleLeft size={16} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`admin.delete_button.${i + 1}`}
                              onClick={() => handleDeleteJob(job.id)}
                              title="Delete"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === "careers" ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#0A2E45] mb-1">
                Career Applications
              </h2>
              <p className="text-gray-500 text-sm">
                {careerApps.length}{" "}
                {careerApps.length === 1 ? "application" : "applications"}{" "}
                received
              </p>
            </div>
            {careerLoading ? (
              <div
                data-ocid="admin.loading_state"
                className="flex items-center justify-center py-24"
              >
                <RefreshCw size={28} className="animate-spin text-[#1E6FA8]" />
              </div>
            ) : careerApps.length === 0 ? (
              <div
                data-ocid="admin.empty_state"
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, #0A2E45, #1E6FA8)",
                  }}
                >
                  <Briefcase size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2E45] mb-2">
                  No career applications yet
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  When candidates apply via the Careers page, their details will
                  appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <table data-ocid="admin.table" className="w-full">
                    <thead>
                      <tr
                        style={{
                          background:
                            "linear-gradient(135deg, #0A2E45, #1E4D7A)",
                        }}
                      >
                        <th className="text-left px-5 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          #
                        </th>
                        <th className="text-left px-5 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Name
                        </th>
                        <th className="text-left px-5 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Email
                        </th>
                        <th className="text-left px-5 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="text-left px-5 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Position
                        </th>
                        <th className="text-left px-5 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Cover Letter
                        </th>
                        <th className="text-left px-5 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {careerApps.map((app, i) => (
                        <tr
                          key={String(app.id)}
                          data-ocid={`admin.row.item.${i + 1}`}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="px-5 py-4 text-sm font-semibold text-gray-400">
                            {i + 1}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #0A2E45, #1E6FA8)",
                                }}
                              >
                                {app.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-800 text-sm">
                                {app.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <a
                              href={`mailto:${app.email}`}
                              className="text-[#1E6FA8] hover:underline text-sm"
                            >
                              {app.email}
                            </a>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-700">
                            {app.phone}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                              {app.position}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700 max-w-xs line-clamp-2">
                              {app.coverLetter || (
                                <span className="text-gray-400 italic">
                                  Not provided
                                </span>
                              )}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatDate(app.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden flex flex-col gap-4">
                  {careerApps.map((app, i) => (
                    <div
                      key={String(app.id)}
                      data-ocid={`admin.row.item.${i + 1}`}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #0A2E45, #1E6FA8)",
                          }}
                        >
                          {app.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{app.name}</p>
                          <a
                            href={`mailto:${app.email}`}
                            className="text-[#1E6FA8] text-xs hover:underline"
                          >
                            {app.email}
                          </a>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {app.phone}
                        </p>
                        <p>
                          <span className="font-semibold">Position:</span>{" "}
                          {app.position}
                        </p>
                        {app.coverLetter && (
                          <p>
                            <span className="font-semibold">Message:</span>{" "}
                            {app.coverLetter}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {formatDate(app.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#0A2E45] mb-1">
                Client Form Submissions
              </h2>
              <p className="text-gray-500 text-sm mb-3">
                {submissions.length}{" "}
                {submissions.length === 1 ? "submission" : "submissions"}{" "}
                received
              </p>
              {submissions.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {(
                    ["Partner With Us", "Book a Call", "Hire Now"] as const
                  ).map((src) => {
                    const count = (
                      submissions as SubmissionWithSource[]
                    ).filter((s) => (s.formSource || "Direct") === src).length;
                    if (count === 0) return null;
                    const colors: Record<string, string> = {
                      "Partner With Us":
                        "bg-blue-100 text-blue-700 border-blue-200",
                      "Book a Call":
                        "bg-green-100 text-green-700 border-green-200",
                      "Hire Now":
                        "bg-orange-100 text-orange-700 border-orange-200",
                    };
                    return (
                      <span
                        key={src}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors[src]}`}
                      >
                        {src}: {count}
                      </span>
                    );
                  })}
                  {(() => {
                    const directCount = (
                      submissions as SubmissionWithSource[]
                    ).filter(
                      (s) => !s.formSource || s.formSource === "Direct",
                    ).length;
                    return directCount > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-600 border-gray-200">
                        Direct: {directCount}
                      </span>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            {loading ? (
              <div
                data-ocid="admin.loading_state"
                className="flex items-center justify-center py-24"
              >
                <RefreshCw size={28} className="animate-spin text-[#1E6FA8]" />
              </div>
            ) : submissions.length === 0 ? (
              <div
                data-ocid="admin.empty_state"
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, #0A2E45, #1E6FA8)",
                  }}
                >
                  <Mail size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2E45] mb-2">
                  No submissions yet
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  When clients fill out any form (Book a Call, Hire Now, or
                  Partner With Us), their details will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <table data-ocid="admin.table" className="w-full">
                    <thead>
                      <tr
                        style={{
                          background:
                            "linear-gradient(135deg, #0A2E45, #1E4D7A)",
                        }}
                      >
                        <th className="text-left px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          #
                        </th>
                        <th className="text-left px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Name
                        </th>
                        <th className="text-left px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Email
                        </th>
                        <th className="text-left px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Company
                        </th>
                        <th className="text-left px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Source
                        </th>
                        <th className="text-left px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Hiring Needs
                        </th>
                        <th className="text-left px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">
                          Date &amp; Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {submissions.map((sub, i) => (
                        <tr
                          key={String(sub.id)}
                          data-ocid={`admin.row.item.${i + 1}`}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-400">
                            {i + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #0A2E45, #1E6FA8)",
                                }}
                              >
                                {sub.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-800 text-sm">
                                {sub.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`mailto:${sub.email}`}
                              className="text-[#1E6FA8] hover:underline text-sm"
                            >
                              {sub.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {sub.company || (
                              <span className="text-gray-400 italic">
                                Not provided
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              const src =
                                (sub as SubmissionWithSource).formSource ||
                                "Direct";
                              const badgeClass: Record<string, string> = {
                                "Partner With Us": "bg-blue-100 text-blue-700",
                                "Book a Call": "bg-green-100 text-green-700",
                                "Hire Now": "bg-orange-100 text-orange-700",
                              };
                              return (
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass[src] || "bg-gray-100 text-gray-600"}`}
                                >
                                  {src}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 max-w-xs line-clamp-2">
                              {sub.hiringNeeds}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatDate(sub.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden flex flex-col gap-4">
                  {submissions.map((sub, i) => (
                    <div
                      key={String(sub.id)}
                      data-ocid={`admin.row.item.${i + 1}`}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #0A2E45, #1E6FA8)",
                            }}
                          >
                            {sub.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {sub.name}
                            </p>
                            <a
                              href={`mailto:${sub.email}`}
                              className="text-[#1E6FA8] text-xs hover:underline"
                            >
                              {sub.email}
                            </a>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-semibold">
                          #{i + 1}
                        </span>
                      </div>
                      {sub.company && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                            Company
                          </p>
                          <p className="text-sm text-gray-700">{sub.company}</p>
                        </div>
                      )}
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                          Hiring Needs
                        </p>
                        <p className="text-sm text-gray-700">
                          {sub.hiringNeeds}
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                          Source
                        </p>
                        {(() => {
                          const src =
                            (sub as SubmissionWithSource).formSource ||
                            "Direct";
                          const badgeClass: Record<string, string> = {
                            "Partner With Us": "bg-blue-100 text-blue-700",
                            "Book a Call": "bg-green-100 text-green-700",
                            "Hire Now": "bg-orange-100 text-orange-700",
                          };
                          return (
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass[src] || "bg-gray-100 text-gray-600"}`}
                            >
                              {src}
                            </span>
                          );
                        })()}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                          Submitted
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(sub.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Navbar ---
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Presence", href: "#presence" },
    { label: "Expertise", href: "#expertise" },
    { label: "Leadership", href: "#leadership" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-nav" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <img
              src="/assets/uploads/IMG_0928-1.jpeg"
              alt="HireKra Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-navy">
              Hire<span className="text-brand-blue">Kra</span>
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                type="button"
                key={l.href}
                data-ocid="nav.link"
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-foreground hover:text-brand-blue transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Button
              data-ocid="nav.primary_button"
              onClick={() => scrollTo("#contact")}
              className="bg-navy hover:bg-navy-light text-white rounded-full px-5 text-sm font-semibold"
            >
              Partner With Us
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            data-ocid="nav.toggle"
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-border shadow-nav">
          <div className="px-4 py-4 flex flex-col gap-2">
            {links.map((l) => (
              <button
                type="button"
                key={l.href}
                data-ocid="nav.link"
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-foreground hover:text-brand-blue py-2 text-left transition-colors"
              >
                {l.label}
              </button>
            ))}
            <Button
              data-ocid="nav.primary_button"
              onClick={() => scrollTo("#contact")}
              className="bg-navy hover:bg-navy-light text-white rounded-full mt-2"
            >
              Partner With Us
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// --- Hero ---
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0A2E45 0%, #0B3D5C 40%, #1E4D7A 70%, #1E6FA8 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Decorative blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10 bg-brand-blue blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full opacity-10 bg-white blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
          Hire Top Talent Faster
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #60C3F5, #A8D8FF)",
            }}
          >
            with HireKra
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
          Your specialist Talent Acquisition partner across India &amp; the
          Middle East — delivering the right talent, at the right time, every
          time.
        </p>

        {/* Highlight badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { icon: <Users size={14} />, label: "Specialized Non-IT Hiring" },
            { icon: <TrendingUp size={14} />, label: "Volume Hiring" },
            {
              icon: <Briefcase size={14} />,
              label: "Contract & Permanent Staffing",
            },
            { icon: <Target size={14} />, label: "Niche Hiring" },
            { icon: <Settings size={14} />, label: "Customized to Your Goals" },
          ].map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-medium rounded-full px-4 py-2"
            >
              {b.icon}
              {b.label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            data-ocid="hero.primary_button"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-navy hover:bg-white/90 rounded-full px-8 py-6 text-base font-bold shadow-lg"
          >
            Partner With Us
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            variant="outline"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-transparent border-2 border-white text-white hover:bg-white/15 rounded-full px-8 py-6 text-base font-semibold"
          >
            Get in Touch
          </Button>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 text-white/40 text-xs">
          <div className="w-px h-10 bg-white/20" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

// --- About ---
function About() {
  const ref = useFadeIn();
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader badge="Who We Are" title="About HireKra" />

          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-muted-foreground leading-relaxed text-base">
              HIREKRA Private Limited is a global talent acquisition partner
              based in Mumbai, India, helping companies across the Middle East
              and beyond build teams that think clearly, work calmly, and
              deliver results that matter. We connect top talent with
              forward-thinking companies, all while keeping quality, integrity,
              and well-being at the heart of everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <Target size={22} className="text-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To deliver quality talent with speed and precision —
                    enabling businesses to build high-performing teams that
                    drive sustainable growth.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                  <Star size={22} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our vision is to become a trusted global talent acquisition
                    partner, connecting organizations with the right and
                    empowered individuals who drive meaningful growth and
                    long-term success. We are committed to building a
                    people-first culture that values clarity, well-being, and
                    thoughtful hiring, enabling our teams to work with focused
                    and calm minds while supporting businesses across
                    international markets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {[
              { value: "2", label: "Regions Covered" },
              { value: "5+", label: "Industries" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-navy text-white rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-extrabold mb-1">{s.value}</div>
                <div className="text-white/70 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Presence ---
function Presence() {
  const ref = useFadeIn();
  return (
    <section id="presence" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Our Reach"
            title="Our Presence"
            subtitle="Extensive hiring capabilities spanning two of the world's fastest-growing talent markets."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {/* India card */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div
                className="h-2"
                style={{
                  background:
                    "linear-gradient(90deg, #FF9933, #FFFFFF, #138808)",
                }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-4xl">🇮🇳</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">India</h3>
                    <p className="text-muted-foreground text-sm">
                      Pan-India Hiring Capabilities
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Headquartered in Mumbai (Innov8 Parinee Crescenzo, Bandra
                  East) with deep-rooted networks across all major metros and
                  tier-2 cities. We source talent from every corner of the
                  country.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Mumbai",
                    "Delhi NCR",
                    "Bangalore",
                    "Hyderabad",
                    "Chennai",
                    "Pune",
                    "Kolkata",
                    "Ahmedabad",
                  ].map((city) => (
                    <span
                      key={city}
                      className="flex items-center gap-1 bg-muted text-foreground text-xs font-medium rounded-full px-3 py-1"
                    >
                      <MapPin size={10} />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle East card */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div
                className="h-2"
                style={{
                  background:
                    "linear-gradient(90deg, #009736, #FFFFFF, #CE1126)",
                }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-4xl">🌍</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Middle East
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      UAE, KSA, Qatar & Beyond
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Expanding presence in the Middle East, connecting Indian
                  talent with opportunities in the region's fastest-growing
                  economies.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Dubai",
                    "Abu Dhabi",
                    "Riyadh",
                    "Jeddah",
                    "Doha",
                    "Manama",
                    "Kuwait City",
                    "Muscat",
                  ].map((city) => (
                    <span
                      key={city}
                      className="flex items-center gap-1 bg-muted text-foreground text-xs font-medium rounded-full px-3 py-1"
                    >
                      <MapPin size={10} />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Expertise ---
function Expertise() {
  const ref = useFadeIn();

  const services = [
    {
      icon: <Users size={24} />,
      title: "Non-IT & Bulk Hiring",
      desc: "High-volume recruitment solutions for operations, sales, logistics, and manufacturing roles at scale.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Startup Hiring",
      desc: "Specialized talent acquisition for high-growth startups — from early hires to scaling product and engineering teams.",
    },
    {
      icon: <Award size={24} />,
      title: "Leadership Hiring",
      desc: "Executive search and C-suite placement with rigorous assessment for VP, Director, and CXO roles.",
    },
    {
      icon: <Settings size={24} />,
      title: "Contract Staffing",
      desc: "Flexible workforce solutions — short-term project hiring, contract-to-hire, and staff augmentation.",
    },
  ];

  const industries = [
    { icon: <Truck size={16} />, label: "Logistics" },
    { icon: <Building2 size={16} />, label: "Real Estate" },
    { icon: <Headphones size={16} />, label: "BPOs / Call Centers" },
    { icon: <Globe size={16} />, label: "Others" },
  ];

  return (
    <section id="expertise" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="What We Do"
            title="Our Expertise"
            subtitle="Comprehensive recruitment solutions tailored to your industry, scale, and hiring objectives."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-12">
            {services.map((s) => (
              <div
                key={s.title}
                className="group bg-card border border-border rounded-2xl p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/10 group-hover:bg-navy group-hover:text-white flex items-center justify-center text-navy mb-5 transition-all duration-300">
                  {s.icon}
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Industries */}
          <div className="bg-navy rounded-2xl p-8">
            <p className="text-white/70 text-sm font-medium text-center mb-5 uppercase tracking-wider">
              Industries We Serve
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((ind) => (
                <span
                  key={ind.label}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-full px-5 py-2"
                >
                  {ind.icon}
                  {ind.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Services Offered ---
function ServicesOffered() {
  const ref = useFadeIn();

  const servicesList = [
    "Candidate sourcing across multiple platforms",
    "Screening and evaluation of candidates",
    "Conducting preliminary interviews",
    "Scheduling and coordinating all further rounds of client interviews",
    "Providing timely feedback to candidates after interviews",
    "Offer coordination and follow-ups until the candidate joins",
    "Onboarding support and guidance for a smooth first day",
    "Flexible support for client-specific recruitment processes",
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader badge="What We Do" title="Services Offered" />
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10 text-base leading-relaxed">
            Hirekra provides end-to-end talent acquisition, managing the
            complete recruitment process while keeping candidates engaged and
            clients informed.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
            {servicesList.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 shadow-sm"
              >
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-blue/15 flex items-center justify-center">
                  <Check size={12} className="text-brand-blue" />
                </span>
                <span className="text-sm text-foreground leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <Info
                size={18}
                className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong>Note:</strong> HireKra does not handle payroll, work
                permits, visas, or legal compliance.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
            <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={20} className="text-brand-blue" />
                <h3 className="font-bold text-base text-foreground">
                  Our Clients
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We serve Middle East companies in BPO/Call Centers, Logistics,
                and Real Estate. Hirekra specializes in non-tech white-collar
                roles and provides end-to-end recruitment solutions, tailored to
                each client's process for seamless and high-quality hiring
                outcomes.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={20} className="text-brand-blue" />
                <h3 className="font-bold text-base text-foreground">
                  Geographic Focus
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hirekra primarily serves companies across the Middle East,
                including the UAE, Saudi Arabia, Qatar, and Oman. Our deep
                understanding of regional markets allows us to deliver tailored,
                end-to-end recruitment solutions.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-2xl p-7 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={20} className="text-white/80" />
                <h3 className="font-bold text-base text-white">
                  Global Expansion
                </h3>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                We plan to expand our services globally in the future, bringing
                the same people-first, thoughtful recruitment approach to
                clients worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Leadership ---
function Leadership() {
  const ref = useFadeIn();

  const leaders = [
    {
      name: "Kratika Haldwani",
      role: "Founder and CEO",
      linkedin: "https://www.linkedin.com/in/kratikahaldwani",
      bio: "Kratika Haldwani leads Hirekra with passion and purpose. She believes that the right people are the backbone of every successful organization and is committed to connecting clients with talent that drives results. With experience in end-to-end recruitment for global organizations, she fosters calm, focused teams that deliver exceptional outcomes while keeping client success at the center.",
    },
    {
      name: "Usha",
      role: "Director",
      bio: "Usha brings experience, insight, and a deep commitment to client trust. She ensures every recruitment process is transparent, smooth, and client-focused, keeping clients informed at every step. By fostering confidence and strong partnerships, she supports Hirekra's mission to deliver exceptional talent solutions with clarity, integrity, and a people-first approach.",
    },
    {
      name: "Vansh Gupta",
      role: "Head of Operations",
      bio: "Vansh brings strategic vision, operational excellence, and a strong focus on execution. As Head of Operations, he ensures that every recruitment process runs efficiently, seamlessly, and with a results-driven approach. He oversees daily operations, streamlines workflows, and maintains high performance across the team. With a commitment to quality, accountability, and continuous improvement, Vansh plays a key role in building scalable systems and delivering consistent outcomes for clients. His leadership supports HireKra's mission to provide reliable, fast, and people-first talent solutions while maintaining strong internal culture and operational discipline.",
    },
  ];

  return (
    <section id="leadership" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Our Team"
            title="Leadership"
            subtitle="The passionate minds driving HireKra's mission to transform talent acquisition."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leaders.map((l, i) => (
              <div
                data-ocid={`leadership.card.${i + 1}`}
                key={l.name}
                className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
              >
                <div className="flex items-center justify-center py-10 bg-gradient-to-br from-blue-600 to-blue-900">
                  <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-extrabold text-white tracking-wide select-none">
                      {l.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {l.name}
                      </h3>
                      <span className="text-brand-blue text-sm font-semibold">
                        {l.role}
                      </span>
                    </div>
                    {l.linkedin && (
                      <a
                        href={l.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${l.name} on LinkedIn`}
                        className="w-10 h-10 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5] flex items-center justify-center text-[#0077B5] hover:text-white transition-all duration-200"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {l.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Why Choose ---
function WhyChoose() {
  const ref = useFadeIn();

  const reasons = [
    {
      icon: <Zap size={22} />,
      title: "Fast Turnaround Time",
      desc: "We move fast. From sourcing to final offer, our streamlined process ensures you get the right hire quickly — without compromising on quality.",
    },
    {
      icon: <Users size={22} />,
      title: "Strong Candidate Pipeline",
      desc: "Access a continuously refreshed pool of pre-screened, job-ready candidates built from years of active network cultivation.",
    },
    {
      icon: <TrendingUp size={22} />,
      title: "Expertise in Bulk Hiring",
      desc: "Proven track record in high-volume hiring campaigns — seamlessly managing large mandates with speed, accuracy, and consistency.",
    },
    {
      icon: <Globe size={22} />,
      title: "PAN India + Middle East Reach",
      desc: "Deep talent networks spanning every major metro in India and key Middle East markets — giving you access to the best talent wherever they are.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Why HireKra"
            title="Why Choose HireKra?"
            subtitle="We go beyond filling positions — we build partnerships that fuel long-term organizational success."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="flex gap-4 bg-card border border-border rounded-2xl p-7 shadow-card"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mt-0.5">
                  {r.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">
                    {r.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Client CTA ---
function ClientCTA() {
  const ref = useFadeIn();
  const { setFormSource } = useContext(FormSourceContext);

  const scrollToContact = (source: string) => {
    setFormSource(source);
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const ctaActions = [
    {
      label: "Book a Call",
      icon: <CalendarDays size={20} />,
      ocid: "cta.book_call_button",
      variant: "book" as const,
    },
    {
      label: "Hire Now",
      icon: <Users size={20} />,
      ocid: "cta.hire_now_button",
      variant: "hire" as const,
    },
    {
      label: "Partner With Us",
      icon: <Handshake size={20} />,
      ocid: "cta.partner_button",
      variant: "partner" as const,
    },
  ];

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0A2E45 0%, #0B3D5C 40%, #1E4D7A 70%, #1E6FA8 100%)",
      }}
    >
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full opacity-10 bg-white blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10 bg-sky-300 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div ref={ref} className="section-fade-in">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white/90 text-xs font-semibold rounded-full px-4 py-1.5 mb-6 uppercase tracking-wider">
            <Zap size={12} />
            Work With HireKra
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Ready to Build Your
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, #60C3F5, #A8D8FF)",
              }}
            >
              Dream Team?
            </span>
          </h2>

          <p className="text-white/75 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Take the next step — choose how you'd like to work with us and let's
            start building something great together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctaActions.map((action) => {
              if (action.variant === "book") {
                return (
                  <button
                    key={action.label}
                    type="button"
                    data-ocid={action.ocid}
                    onClick={() => scrollToContact(action.label)}
                    className="flex items-center gap-2.5 bg-white text-navy hover:bg-white/90 rounded-full px-8 py-4 text-base font-bold shadow-lg transition-all duration-200 hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                );
              }
              if (action.variant === "hire") {
                return (
                  <button
                    key={action.label}
                    type="button"
                    data-ocid={action.ocid}
                    onClick={() => scrollToContact(action.label)}
                    className="flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-bold shadow-lg transition-all duration-200 hover:scale-105 w-full sm:w-auto justify-center text-white border-2 border-white/40 hover:border-white/70 hover:bg-white/10"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(30,79,122,0.8) 0%, rgba(30,111,168,0.9) 100%)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                );
              }
              return (
                <button
                  key={action.label}
                  type="button"
                  data-ocid={action.ocid}
                  onClick={() => scrollToContact(action.label)}
                  className="flex items-center gap-2.5 bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white rounded-full px-8 py-4 text-base font-bold transition-all duration-200 hover:scale-105 w-full sm:w-auto justify-center"
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
          </div>

          {/* Trust note */}
          <p className="mt-10 text-white/45 text-sm">
            No commitment required · Typically respond within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}

// --- Careers ---
function Careers() {
  const ref = useFadeIn();
  const formRef = useRef<HTMLDivElement>(null);
  const [careerForm, setCareerForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    coverLetter: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeJobs, setActiveJobs] = useState<JobListing[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const actor = await createActorWithConfig();
        const data = (await (actor as any).getActiveJobs()) as JobListing[];
        setActiveJobs(data);
      } catch {
        // silently fail — show empty state
      } finally {
        setJobsLoading(false);
      }
    })();
  }, []);

  const jobs = activeJobs.filter((j) => !j.isInternship);
  const internships = activeJobs.filter((j) => j.isInternship);

  const scrollToForm = (position: string) => {
    setCareerForm((prev) => ({ ...prev, position }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const actor = await createActorWithConfig();
      await (actor as any).submitCareerApplication(
        careerForm.name,
        careerForm.email,
        careerForm.phone,
        careerForm.position,
        careerForm.coverLetter,
      );
      toast.success("Application submitted! We'll review it within 48 hours.");
      setCareerForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        coverLetter: "",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const culturePoints = [
    {
      icon: Users,
      title: "Team Environment",
      desc: "We work together, support each other, and celebrate successes as a team.",
    },
    {
      icon: Target,
      title: "Core Values & Vision",
      desc: "Integrity, empathy, and excellence guide everything we do. Our vision is to redefine recruitment by combining technology with a human touch.",
    },
    {
      icon: Heart,
      title: "Employee Wellbeing",
      desc: "Mental health is a top priority. We provide resources, support, and flexibility to ensure our team feels balanced, motivated, and cared for.",
    },
    {
      icon: MessageSquare,
      title: "Open Feedback Culture",
      desc: "Feedback flows both ways. Employees are encouraged to share ideas, concerns, and suggestions, helping us grow stronger together.",
    },
    {
      icon: TrendingUp,
      title: "Benefits & Growth",
      desc: "We offer competitive perks, learning opportunities, and a path for career advancement—because when our employees succeed, HireKra succeeds.",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Browse & Apply",
      desc: "Find a role that fits and submit via the form below.",
    },
    {
      step: 2,
      title: "Initial Screening",
      desc: "Our team reviews your application within 48 hours.",
    },
    {
      step: 3,
      title: "Interview Rounds",
      desc: "1-2 rounds with the hiring team.",
    },
    {
      step: 4,
      title: "Offer & Onboarding",
      desc: "Get your offer letter and join the HireKra family.",
    },
  ];

  const SkeletonCard = () => (
    <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
      <div className="h-3 bg-muted rounded w-1/3 mb-4" />
      <div className="h-3 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted rounded w-5/6 mb-5" />
      <div className="flex gap-1.5 mb-5">
        <div className="h-5 bg-muted rounded-full w-16" />
        <div className="h-5 bg-muted rounded-full w-20" />
      </div>
      <div className="h-9 bg-muted rounded-full w-full" />
    </div>
  );

  return (
    <section id="careers" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="We're Hiring"
            title="Join the HireKra Team"
            subtitle="Be part of a fast-growing recruitment firm changing how India and the Middle East hires talent. Explore open roles below."
          />

          {/* Job Listings */}
          <div className="mb-16">
            <h3 className="text-2xl font-extrabold text-foreground mb-2 flex items-center gap-2">
              <Briefcase size={22} className="text-brand-blue" />
              Current Openings
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Full-time positions at HireKra
            </p>
            {jobsLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div
                data-ocid="careers.empty_state"
                className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-2xl border border-border text-center"
              >
                <Briefcase size={28} className="text-muted-foreground mb-3" />
                <p className="font-semibold text-foreground mb-1">
                  No openings right now
                </p>
                <p className="text-sm text-muted-foreground">
                  Check back soon — we're growing fast!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {jobs.map((job, i) => (
                  <div
                    key={String(job.id)}
                    data-ocid={`careers.item.${i + 1}`}
                    className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-foreground text-base leading-tight flex-1 pr-2">
                        {job.title}
                      </h4>
                      <span className="text-xs font-semibold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full whitespace-nowrap">
                        {job.jobType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
                      <MapPin size={12} />
                      <span>{job.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills.split(",").map((skill) => (
                        <span
                          key={skill.trim()}
                          className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                    <Button
                      data-ocid={`careers.primary_button.${i + 1}`}
                      onClick={() => scrollToForm(job.title)}
                      className="w-full bg-[#0A2E45] hover:bg-[#1E6FA8] text-white rounded-full font-semibold transition-colors"
                    >
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internships */}
          <div className="mb-16">
            <h3 className="text-2xl font-extrabold text-foreground mb-2 flex items-center gap-2">
              <GraduationCap size={22} className="text-brand-blue" />
              Internship Opportunities
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Learn, grow, and kickstart your career with us
            </p>
            {jobsLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div
                data-ocid="careers.internship.empty_state"
                className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-2xl border border-border text-center"
              >
                <GraduationCap
                  size={28}
                  className="text-muted-foreground mb-3"
                />
                <p className="font-semibold text-foreground mb-1">
                  No internships right now
                </p>
                <p className="text-sm text-muted-foreground">
                  Check back soon — opportunities are coming!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {internships.map((intern, i) => (
                  <div
                    key={String(intern.id)}
                    data-ocid={`careers.internship.item.${i + 1}`}
                    className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-foreground text-base">
                        {intern.title}
                      </h4>
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Internship
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                      {intern.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {intern.duration}
                        </span>
                      )}
                      {intern.stipend && (
                        <span className="flex items-center gap-1">
                          <Award size={12} />
                          Stipend: {intern.stipend}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {intern.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {intern.skills.split(",").map((skill) => (
                        <span
                          key={skill.trim()}
                          className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                    <Button
                      data-ocid={`careers.internship.primary_button.${i + 1}`}
                      onClick={() => scrollToForm(intern.title)}
                      variant="outline"
                      className="w-full border-[#0A2E45] text-[#0A2E45] hover:bg-[#0A2E45] hover:text-white rounded-full font-semibold transition-colors"
                    >
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company Culture */}
          <div className="mb-16 bg-muted/50 rounded-3xl p-8 sm:p-10">
            <h3 className="text-2xl font-extrabold text-foreground mb-2 flex items-center gap-2">
              <Heart size={22} className="text-brand-blue" />
              Our Culture
            </h3>
            <p className="text-muted-foreground mb-8 text-sm">
              What it's like to work at HireKra
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {culturePoints.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Process */}
          <div className="mb-16">
            <h3 className="text-2xl font-extrabold text-foreground mb-2 flex items-center gap-2">
              <CheckCircle size={22} className="text-brand-blue" />
              Application Process
            </h3>
            <p className="text-muted-foreground mb-8 text-sm">
              Simple, transparent, and candidate-friendly
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((s) => (
                <div
                  key={s.step}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm mb-3 shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #0A2E45, #1E6FA8)",
                    }}
                  >
                    {s.step}
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Join Us Form */}
          <div
            ref={formRef}
            id="careers-form"
            className="bg-card border border-border rounded-3xl shadow-card p-8 sm:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <FileText size={20} className="text-brand-blue" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-foreground">
                  Quick Application
                </h3>
                <p className="text-xs text-muted-foreground">
                  Fill in your details and we'll get back to you within 48 hours
                </p>
              </div>
            </div>
            <form
              onSubmit={handleCareerSubmit}
              className="grid sm:grid-cols-2 gap-5"
            >
              <div className="space-y-1.5">
                <Label htmlFor="career-name" className="text-sm font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="career-name"
                  data-ocid="careers.input"
                  placeholder="Your full name"
                  value={careerForm.name}
                  onChange={(e) =>
                    setCareerForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="career-email" className="text-sm font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="career-email"
                  data-ocid="careers.input"
                  type="email"
                  placeholder="you@email.com"
                  value={careerForm.email}
                  onChange={(e) =>
                    setCareerForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="career-phone" className="text-sm font-semibold">
                  Phone Number *
                </Label>
                <Input
                  id="career-phone"
                  data-ocid="careers.input"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={careerForm.phone}
                  onChange={(e) =>
                    setCareerForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="career-position"
                  className="text-sm font-semibold"
                >
                  Position Applying For *
                </Label>
                <Input
                  id="career-position"
                  data-ocid="careers.input"
                  placeholder="e.g. Senior Recruitment Consultant"
                  value={careerForm.position}
                  onChange={(e) =>
                    setCareerForm((p) => ({ ...p, position: e.target.value }))
                  }
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="career-cover" className="text-sm font-semibold">
                  Cover Letter / Message
                </Label>
                <Textarea
                  id="career-cover"
                  data-ocid="careers.textarea"
                  placeholder="Tell us about yourself, your experience, and why you want to join HireKra..."
                  value={careerForm.coverLetter}
                  onChange={(e) =>
                    setCareerForm((p) => ({
                      ...p,
                      coverLetter: e.target.value,
                    }))
                  }
                  className="rounded-xl min-h-[120px] resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  data-ocid="careers.submit_button"
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0A2E45] hover:bg-[#1E6FA8] text-white rounded-full py-6 font-bold text-base transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Contact ---
function Contact() {
  const ref = useFadeIn();
  const { formSource, setFormSource } = useContext(FormSourceContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    hiringNeeds: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const actor = await createActorWithConfig();
      await (actor as any).submitForm(
        form.name,
        form.email,
        form.company,
        form.hiringNeeds,
        formSource || "Direct",
      );
      toast.success("Message sent! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", company: "", hiringNeeds: "" });
      setFormSource("Direct");
    } catch {
      toast.error(
        "Something went wrong. Please try again or email us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Get in Touch"
            title="Contact Us"
            subtitle="Ready to build your dream team? Let's start a conversation."
          />

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className="bg-card border border-border rounded-2xl shadow-card p-8">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <h3 className="font-bold text-lg text-foreground">
                  Send Us a Message
                </h3>
                {formSource &&
                  formSource !== "Direct" &&
                  (() => {
                    const badgeClass: Record<string, string> = {
                      "Partner With Us":
                        "bg-blue-100 text-blue-700 border-blue-200",
                      "Book a Call":
                        "bg-green-100 text-green-700 border-green-200",
                      "Hire Now":
                        "bg-orange-100 text-orange-700 border-orange-200",
                    };
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${badgeClass[formSource] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                      >
                        ✦ You're filling out: {formSource}
                      </span>
                    );
                  })()}
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    data-ocid="contact.input"
                    placeholder="Your full name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-xl border-border focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    data-ocid="contact.input"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="rounded-xl border-border"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="company"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Company
                  </Label>
                  <Input
                    id="company"
                    data-ocid="contact.input"
                    placeholder="Your company name"
                    value={form.company}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, company: e.target.value }))
                    }
                    className="rounded-xl border-border"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="hiringNeeds"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Hiring Needs *
                  </Label>
                  <Textarea
                    id="hiringNeeds"
                    data-ocid="contact.textarea"
                    placeholder="Tell us about your hiring requirements, roles, and timeline..."
                    required
                    rows={4}
                    value={form.hiringNeeds}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, hiringNeeds: e.target.value }))
                    }
                    className="rounded-xl border-border resize-none"
                  />
                </div>
                <Button
                  data-ocid="contact.submit_button"
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-navy hover:bg-navy-light text-white rounded-full py-6 text-base font-bold"
                >
                  {submitting ? "Sending..." : "Let's Build Your Team"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-navy rounded-2xl p-8 text-white">
                <h3 className="font-bold text-lg mb-6">Reach Us Directly</h3>
                <div className="space-y-5">
                  <a
                    href="mailto:info@hirekra.com"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Email</p>
                      <p className="font-semibold">info@hirekra.com</p>
                    </div>
                  </a>
                  <a
                    href="tel:+918587079103"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Phone</p>
                      <p className="font-semibold">+91 85870 79103</p>
                    </div>
                  </a>
                  <a
                    href="tel:+919783004914"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Mobile</p>
                      <p className="font-semibold">+91 97830 04914</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Headquarters</p>
                      <p className="font-semibold text-sm leading-snug">
                        Innov8 Parinee Crescenzo, 17th FL
                        <br />
                        Bandra East, Mumbai 400051
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                data-ocid="contact.link"
                href="https://www.linkedin.com/company/hirekra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#0077B5] hover:bg-[#005e8f] text-white rounded-2xl p-6 font-bold text-base transition-colors"
              >
                <Linkedin size={22} />
                Connect on LinkedIn
              </a>

              <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
                <h4 className="font-bold text-sm text-foreground mb-3">
                  Response Time
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We typically respond within{" "}
                  <strong className="text-navy">24 hours</strong>. For urgent
                  hiring needs, please mention it in your message and we'll
                  prioritize your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  const year = new Date().getFullYear();
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer
      className="bg-navy-dark text-white pt-16 pb-8"
      style={{ backgroundColor: "#0A2E45" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/uploads/IMG_0928-1.jpeg"
                alt="HireKra Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold">
                Hire<span className="text-brand-blue">Kra</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Your trusted recruitment partner across India & the Middle East.
              Building teams that drive growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                ["Home", "#home"],
                ["About Us", "#about"],
                ["Our Presence", "#presence"],
                ["Expertise", "#expertise"],
                ["Our Process", "#process"],
                ["Leadership", "#leadership"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <button
                    type="button"
                    data-ocid="footer.link"
                    onClick={() => scrollTo(href)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {[
                "Non-IT & Bulk Hiring",
                "Startup Hiring",
                "Leadership Hiring",
                "Contract Staffing",
              ].map((s) => (
                <li key={s} className="text-white/60 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {year} HireKra. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// --- Section Header ---
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12">
      <Badge
        variant="outline"
        className="mb-4 border-brand-blue/30 text-brand-blue bg-brand-blue/5 font-semibold px-4 py-1 rounded-full"
      >
        {badge}
      </Badge>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// --- App ---
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [formSource, setFormSource] = useState("Direct");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (hash === "#admin") {
    return <AdminDashboard />;
  }

  return (
    <FormSourceContext.Provider value={{ formSource, setFormSource }}>
      <Toaster position="top-center" richColors />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Presence />
        <Expertise />
        <ServicesOffered />
        <Leadership />
        <WhyChoose />
        <ClientCTA />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </FormSourceContext.Provider>
  );
}
