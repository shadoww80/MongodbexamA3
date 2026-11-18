// ============================================================================
// Set A - Scenario A3: Employee Directory: Speeding up Searches with Indexes
// Database / Collection: companyDB.employees
// ============================================================================

use("companyDB");

db.employees.drop();
db.employees.insertMany([
  { _id: 1, name: "Anil", dept: "IT", city: "Chennai", salary: 60000, skills: ["MongoDB", "Python"] },
  { _id: 2, name: "Bhavna", dept: "HR", city: "Mumbai", salary: 45000, skills: ["Excel", "Communication"] },
  { _id: 3, name: "Charan", dept: "IT", city: "Chennai", salary: 75000, skills: ["Java", "MongoDB"] },
  { _id: 4, name: "Deepa", dept: "Finance", city: "Pune", salary: 52000, skills: ["Excel", "Tally"] },
  { _id: 5, name: "Elan", dept: "IT", city: "Bengaluru", salary: 68000, skills: ["Python", "Docker"] },
  { _id: 6, name: "Farida", dept: "HR", city: "Delhi", salary: 48000, skills: ["Communication", "Recruitment"] },
  { _id: 7, name: "Gokul", dept: "Finance", city: "Chennai", salary: 58000, skills: ["Tally", "Excel"] },
  { _id: 8, name: "Hema", dept: "IT", city: "Pune", salary: 82000, skills: ["MongoDB", "Kubernetes"] }
]);

print("\n--- Task 1: Run explain('executionStats') without index for dept: 'IT' ---");
const exp1 = db.employees.find({ dept: "IT" }).explain("executionStats");
printjson({
  stage: exp1.queryPlanner.winningPlan.stage,
  nReturned: exp1.executionStats.nReturned,
  totalKeysExamined: exp1.executionStats.totalKeysExamined,
  totalDocsExamined: exp1.executionStats.totalDocsExamined
});

print("\n--- Task 2: Create a single-field index on dept and re-run explain ---");
const idxDept = db.employees.createIndex({ dept: 1 });
print("Created Index: " + idxDept);
const exp2 = db.employees.find({ dept: "IT" }).explain("executionStats");
printjson({
  stage: exp2.queryPlanner.winningPlan.stage,
  inputStage: exp2.queryPlanner.winningPlan.inputStage.stage,
  indexName: exp2.queryPlanner.winningPlan.inputStage.indexName,
  nReturned: exp2.executionStats.nReturned,
  totalKeysExamined: exp2.executionStats.totalKeysExamined,
  totalDocsExamined: exp2.executionStats.totalDocsExamined
});

print("\n--- Task 3: Create compound index { dept: 1, salary: -1 } & check sort ---");
const idxCompound = db.employees.createIndex({ dept: 1, salary: -1 });
print("Created Index: " + idxCompound);
const exp3 = db.employees.find({ dept: "IT" }).sort({ salary: -1 }).explain("executionStats");
printjson({
  winningPlanStage: exp3.queryPlanner.winningPlan.stage,
  inputStage: exp3.queryPlanner.winningPlan.inputStage.stage,
  indexName: exp3.queryPlanner.winningPlan.inputStage.indexName,
  hasInMemorySort: JSON.stringify(exp3.queryPlanner.winningPlan).includes('"SORT"')
});
printjson(db.employees.find({ dept: "IT" }, { _id: 0, name: 1, dept: 1, salary: 1 }).sort({ salary: -1 }).toArray());

print("\n--- Task 4: Create multikey index on skills array & find MongoDB devs ---");
const idxSkills = db.employees.createIndex({ skills: 1 });
print("Created Index: " + idxSkills);
const exp4 = db.employees.find({ skills: "MongoDB" }).explain("executionStats");
printjson({
  inputStage: exp4.queryPlanner.winningPlan.inputStage.stage,
  indexName: exp4.queryPlanner.winningPlan.inputStage.indexName,
  isMultiKey: exp4.queryPlanner.winningPlan.inputStage.isMultiKey,
  nReturned: exp4.executionStats.nReturned,
  totalKeysExamined: exp4.executionStats.totalKeysExamined,
  totalDocsExamined: exp4.executionStats.totalDocsExamined
});
printjson(db.employees.find({ skills: "MongoDB" }, { _id: 0, name: 1, skills: 1 }).toArray());

print("\n--- Task 5: Hide skills_1 index, verify COLLSCAN fallback, then unhide ---");
printjson(db.employees.hideIndex("skills_1"));
const exp5Hidden = db.employees.find({ skills: "MongoDB" }).explain("executionStats");
printjson({
  stage: exp5Hidden.queryPlanner.winningPlan.stage,
  nReturned: exp5Hidden.executionStats.nReturned,
  totalDocsExamined: exp5Hidden.executionStats.totalDocsExamined
});
printjson(db.employees.unhideIndex("skills_1"));
const exp5Unhidden = db.employees.find({ skills: "MongoDB" }).explain("executionStats");
printjson({
  inputStage: exp5Unhidden.queryPlanner.winningPlan.inputStage.stage,
  indexName: exp5Unhidden.queryPlanner.winningPlan.inputStage.indexName
});

print("\n--- Task 6: Attempt unique index on city (fails), then create on name ---");
try {
  db.employees.createIndex({ city: 1 }, { unique: true });
} catch (err) {
  print("Expected Error on { city: 1 } unique index: " + err.message);
}
const idxUniqueName = db.employees.createIndex({ name: 1 }, { unique: true });
print("Created unique index on suitable field 'name': " + idxUniqueName);

print("\n--- Task 7: List all indexes of the collection ---");
printjson(db.employees.getIndexes());
