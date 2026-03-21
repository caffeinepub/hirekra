import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type Submission = {
    name : Text;
    email : Text;
    company : Text;
    hiringNeeds : Text;
    timestamp : Int;
    id : Nat;
  };

  let submissions = Map.empty<Nat, Submission>();
  var nextId = 0;
  let AdminPassword = "HireKra@2024";

  public shared ({ caller }) func submitForm(name : Text, email : Text, company : Text, hiringNeeds : Text) : async Nat {
    let id = nextId;
    let submission : Submission = {
      name;
      email;
      company;
      hiringNeeds;
      timestamp = Time.now();
      id;
    };
    submissions.add(id, submission);
    nextId += 1;
    id;
  };

  func verifyPassword(password : Text) {
    if (not Text.equal(password, AdminPassword)) {
      Runtime.trap("Unauthorized: Incorrect admin password. Access denied. ");
    };
  };

  public query ({ caller }) func getAllSubmissions(password : Text) : async [Submission] {
    verifyPassword(password);
    submissions.values().toArray();
  };

  public shared ({ caller }) func clearSubmissions(password : Text) : async () {
    verifyPassword(password);
    submissions.clear();
    nextId := 0;
  };
};
