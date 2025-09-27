// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-uLO9djFAxT0CG9cETSf-UiZNAqGm-4Q",
  authDomain: "scholarship-cloudbase.firebaseapp.com",
  projectId: "scholarship-cloudbase",
  storageBucket: "scholarship-cloudbase.firebasestorage.app",
  messagingSenderId: "316123000523",
  appId: "1:316123000523:web:45dbf9c1eb25a5ede4b54e",
  measurementId: "G-QW1PMQZMSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Sample data arrays for generating random entries
const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Maria", "William", "Jennifer", "Richard", "Linda", "Joseph", "Elizabeth", "Thomas", "Barbara", "Christopher", "Susan"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const universities = ["Harvard University", "Stanford University", "MIT", "University of California Berkeley", "Yale University", "Princeton University", "Columbia University", "University of Chicago", "Penn State", "Duke University"];
const majors = ["Computer Science", "Engineering", "Business Administration", "Psychology", "Biology", "Mathematics", "Economics", "Political Science", "Chemistry", "Physics"];
const scholarshipTypes = ["Academic Merit", "Need-Based", "Athletic", "Research Grant", "Minority Scholarship", "STEM Excellence", "Community Service", "Leadership Award"];

// Function to generate random data
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomGPA() {
  return (Math.random() * 1.5 + 2.5).toFixed(2); // GPA between 2.5 and 4.0
}

function generateRandomAmount() {
  return Math.floor(Math.random() * 45000) + 5000; // Amount between $5,000 and $50,000
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomEmail(firstName, lastName) {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "edu.university.edu"];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;
}

// Function to create a random scholarship application
function createRandomScholarshipApplication() {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const applicationDate = generateRandomDate(new Date(2024, 0, 1), new Date());
  
  return {
    // Personal Information
    firstName: firstName,
    lastName: lastName,
    fullName: `${firstName} ${lastName}`,
    email: generateRandomEmail(firstName, lastName),
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    dateOfBirth: generateRandomDate(new Date(1998, 0, 1), new Date(2005, 11, 31)),
    
    // Academic Information
    university: getRandomElement(universities),
    major: getRandomElement(majors),
    gpa: parseFloat(generateRandomGPA()),
    graduationYear: Math.floor(Math.random() * 4) + 2024, // 2024-2027
    academicLevel: getRandomElement(["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]),
    
    // Scholarship Information
    scholarshipType: getRandomElement(scholarshipTypes),
    requestedAmount: generateRandomAmount(),
    applicationDate: applicationDate,
    status: getRandomElement(["Pending", "Under Review", "Approved", "Rejected", "Waitlisted"]),
    
    // Additional Information
    essay: `I am passionate about my studies in ${getRandomElement(majors)} and believe this scholarship will help me achieve my academic goals. My dedication to excellence and community service makes me an ideal candidate.`,
    extracurriculars: [
      getRandomElement(["Student Government", "Debate Club", "Volunteer Work", "Research Assistant"]),
      getRandomElement(["Sports Team", "Music Band", "Drama Club", "Academic Honor Society"])
    ],
    
    // Metadata
    createdAt: new Date(),
    updatedAt: new Date(),
    applicationId: `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}

// Function to create a random scholarship program
function createRandomScholarshipProgram() {
  const scholarshipName = `${getRandomElement(scholarshipTypes)} ${getRandomElement(["Foundation", "Program", "Award", "Grant"])}`;
  
  return {
    name: scholarshipName,
    description: `The ${scholarshipName} provides financial assistance to deserving students pursuing higher education.`,
    totalAmount: generateRandomAmount() * 10, // Larger fund amount
    availableAmount: generateRandomAmount() * 5,
    maxIndividualAward: generateRandomAmount(),
    minGpaRequirement: parseFloat((Math.random() * 1 + 2.5).toFixed(2)),
    eligibleMajors: [getRandomElement(majors), getRandomElement(majors)],
    applicationDeadline: generateRandomDate(new Date(), new Date(2025, 11, 31)),
    isActive: Math.random() > 0.2, // 80% chance of being active
    requirements: [
      "Maintain minimum GPA",
      "Submit academic transcripts",
      "Provide letters of recommendation",
      "Complete essay requirement"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Function to add sample scholarship applications
async function addSampleApplications(count = 10) {
  console.log(`Adding ${count} sample scholarship applications...`);
  
  try {
    for (let i = 0; i < count; i++) {
      const applicationData = createRandomScholarshipApplication();
      const docRef = await addDoc(collection(db, "scholarship_applications"), applicationData);
      console.log(`Application ${i + 1} added with ID: ${docRef.id}`);
    }
    console.log(`Successfully added ${count} scholarship applications!`);
  } catch (error) {
    console.error("Error adding scholarship applications:", error);
  }
}

// Function to add sample scholarship programs
async function addSamplePrograms(count = 5) {
  console.log(`Adding ${count} sample scholarship programs...`);
  
  try {
    for (let i = 0; i < count; i++) {
      const programData = createRandomScholarshipProgram();
      const docRef = await addDoc(collection(db, "scholarship_programs"), programData);
      console.log(`Program ${i + 1} added with ID: ${docRef.id}`);
    }
    console.log(`Successfully added ${count} scholarship programs!`);
  } catch (error) {
    console.error("Error adding scholarship programs:", error);
  }
}

// Function to add sample administrators/users
async function addSampleUsers(count = 3) {
  console.log(`Adding ${count} sample users...`);
  
  const userRoles = ["administrator", "reviewer", "student"];
  
  try {
    for (let i = 0; i < count; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: generateRandomEmail(firstName, lastName),
        role: getRandomElement(userRoles),
        isActive: true,
        permissions: ["read", "write", "review"],
        createdAt: new Date(),
        lastLogin: generateRandomDate(new Date(2024, 0, 1), new Date())
      };
      
      const docRef = await addDoc(collection(db, "users"), userData);
      console.log(`User ${i + 1} added with ID: ${docRef.id}`);
    }
    console.log(`Successfully added ${count} users!`);
  } catch (error) {
    console.error("Error adding users:", error);
  }
}

// Function to read and display data from a collection
async function readCollectionData(collectionName) {
  console.log(`\nReading data from ${collectionName} collection:`);
  
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id}:`, doc.data());
    });
  } catch (error) {
    console.error(`Error reading ${collectionName}:`, error);
  }
}

// Main function to populate database with sample data
async function populateDatabase() {
  console.log("🚀 Starting to populate Firebase database with sample data...\n");
  
  // Add sample data to different collections
  await addSampleApplications(15);
  console.log("");
  
  await addSamplePrograms(8);
  console.log("");
  
  await addSampleUsers(5);
  console.log("");
  
  console.log("✅ Database population completed!");
  
  // Optional: Read back some data to verify
  console.log("\n📖 Sample of added data:");
  await readCollectionData("scholarship_applications");
}

// Export functions for use in other files
export {
  populateDatabase,
  addSampleApplications,
  addSamplePrograms,
  addSampleUsers,
  readCollectionData,
  createRandomScholarshipApplication,
  createRandomScholarshipProgram
};

// Run the population if this file is executed directly
if (typeof window === 'undefined') {
  // Running in Node.js environment
  populateDatabase().catch(console.error);
}

// For browser usage, you can call populateDatabase() from the console or attach it to a button
console.log("Firebase sample data script loaded. Call populateDatabase() to add sample data.");