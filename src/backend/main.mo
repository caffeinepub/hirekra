import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

actor {
  type SubmissionV1 = {
    name : Text;
    email : Text;
    company : Text;
    hiringNeeds : Text;
    timestamp : Int;
    id : Nat;
  };

  type Submission = {
    name : Text;
    email : Text;
    company : Text;
    hiringNeeds : Text;
    formSource : Text;
    timestamp : Int;
    id : Nat;
  };

  type CareerApplication = {
    name : Text;
    email : Text;
    phone : Text;
    position : Text;
    coverLetter : Text;
    timestamp : Int;
    id : Nat;
  };

  type JobListing = {
    id : Nat;
    title : Text;
    jobType : Text;
    location : Text;
    description : Text;
    skills : Text;
    isInternship : Bool;
    duration : Text;
    stipend : Text;
    isActive : Bool;
    createdAt : Int;
  };

  let AdminPassword = "HireKra@2024";

  let submissions = Map.empty<Nat, SubmissionV1>();
  var allSubmissions : [Submission] = [];
  var allCareerApplications : [CareerApplication] = [];
  var allJobListings : [JobListing] = [];

  let workingMap = Map.empty<Nat, Submission>();
  var nextId = 0;

  let careerMap = Map.empty<Nat, CareerApplication>();
  var nextCareerId = 0;

  let jobMap = Map.empty<Nat, JobListing>();
  var nextJobId = 0;

  do {
    for (sub in allSubmissions.vals()) {
      workingMap.add(sub.id, sub);
      if (sub.id >= nextId) { nextId := sub.id + 1 };
    };
    for (app in allCareerApplications.vals()) {
      careerMap.add(app.id, app);
      if (app.id >= nextCareerId) { nextCareerId := app.id + 1 };
    };
    for (job in allJobListings.vals()) {
      jobMap.add(job.id, job);
      if (job.id >= nextJobId) { nextJobId := job.id + 1 };
    };
  };

  system func postupgrade() {
    for ((k, v) in submissions.entries()) {
      let migrated : Submission = {
        name = v.name;
        email = v.email;
        company = v.company;
        hiringNeeds = v.hiringNeeds;
        formSource = "Partner With Us";
        timestamp = v.timestamp;
        id = v.id;
      };
      workingMap.add(k, migrated);
      if (k >= nextId) { nextId := k + 1 };
    };
    allSubmissions := workingMap.values().toArray();
    submissions.clear();
  };

  system func preupgrade() {
    allSubmissions := workingMap.values().toArray();
    allCareerApplications := careerMap.values().toArray();
    allJobListings := jobMap.values().toArray();
  };

  public shared func submitForm(
    name : Text,
    email : Text,
    company : Text,
    hiringNeeds : Text,
    formSource : Text,
  ) : async Nat {
    let id = nextId;
    let submission : Submission = {
      name;
      email;
      company;
      hiringNeeds;
      formSource;
      timestamp = Time.now();
      id;
    };
    workingMap.add(id, submission);
    nextId += 1;
    id;
  };

  public shared func submitCareerApplication(
    name : Text,
    email : Text,
    phone : Text,
    position : Text,
    coverLetter : Text,
  ) : async Nat {
    let id = nextCareerId;
    let app : CareerApplication = {
      name;
      email;
      phone;
      position;
      coverLetter;
      timestamp = Time.now();
      id;
    };
    careerMap.add(id, app);
    nextCareerId += 1;
    id;
  };

  public shared func createJobListing(
    password : Text,
    title : Text,
    jobType : Text,
    location : Text,
    description : Text,
    skills : Text,
    isInternship : Bool,
    duration : Text,
    stipend : Text,
  ) : async Nat {
    verifyPassword(password);
    let id = nextJobId;
    let job : JobListing = {
      id;
      title;
      jobType;
      location;
      description;
      skills;
      isInternship;
      duration;
      stipend;
      isActive = true;
      createdAt = Time.now();
    };
    jobMap.add(id, job);
    nextJobId += 1;
    id;
  };

  public shared func toggleJobActive(password : Text, jobId : Nat) : async Bool {
    verifyPassword(password);
    switch (jobMap.get(jobId)) {
      case null { Runtime.trap("Job not found") };
      case (?job) {
        let updated : JobListing = {
          id = job.id;
          title = job.title;
          jobType = job.jobType;
          location = job.location;
          description = job.description;
          skills = job.skills;
          isInternship = job.isInternship;
          duration = job.duration;
          stipend = job.stipend;
          isActive = not job.isActive;
          createdAt = job.createdAt;
        };
        jobMap.add(jobId, updated);
        updated.isActive;
      };
    };
  };

  public shared func deleteJobListing(password : Text, jobId : Nat) : async () {
    verifyPassword(password);
    ignore(jobMap.remove(jobId));
  };

  public query func getActiveJobs() : async [JobListing] {
    jobMap.values().toArray().filter(func j = j.isActive);
  };

  func verifyPassword(password : Text) {
    if (not Text.equal(password, AdminPassword)) {
      Runtime.trap("Unauthorized: Incorrect admin password. Access denied.");
    };
  };

  public query func getAllSubmissions(password : Text) : async [Submission] {
    verifyPassword(password);
    workingMap.values().toArray();
  };

  public query func getAllCareerApplications(password : Text) : async [CareerApplication] {
    verifyPassword(password);
    careerMap.values().toArray();
  };

  public query func getAllJobListings(password : Text) : async [JobListing] {
    verifyPassword(password);
    jobMap.values().toArray();
  };

  public shared func clearSubmissions(password : Text) : async () {
    verifyPassword(password);
    workingMap.clear();
    allSubmissions := [];
    nextId := 0;
  };
};
