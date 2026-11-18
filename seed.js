// Scenario A3: Seed Data for companyDB.employees
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

print("Sample data inserted into companyDB.employees successfully.");
