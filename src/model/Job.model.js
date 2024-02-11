import fs from "fs";

export default class Job {
  constructor(
    jobTitle,
    company,
    position,
    location,
    salary,
    jobDescription,
    noOfOpenings,
    endDate,
    skills // Add skills parameter
  ) {
    this.jobTitle = jobTitle;
    this.company = company;
    this.position = position;
    this.location = location;
    this.salary = salary;
    this.jobDescription = jobDescription;
    this.noOfOpenings = noOfOpenings;
    this.endDate = endDate;
    this.skills = skills; // Store skills as an array
    this.applicants = []; // Array to store applicants
  }

  // Method to get all jobs
  static getAllJobs() {
    return jobs;
  }

  // Method to add a job
  static addJob(job) {
    jobs.push(job);
  }

  // Method to search for a job by ID
  static searchJobById(jobId) {
    return jobs[jobId];
  }

  static updateById(id, updatedJob) {
    if (id >= 0 && id < jobs.length) {
      updatedJob.skills = updatedJob.skills
        .split(",")
        .map((skill) => skill.trim());
      jobs[id] = updatedJob;
    } else {
      console.error("Invalid index for job update");
    }
  }

  static deleteById(id) {
    if (id >= 0 && id < jobs.length) {
      jobs.splice(id, 1);
    } else {
      console.error("Job doesn't exist");
    }
  }

  // Method to add an applicant to the job
  static addApplicant(applicant, id) {
    jobs[id].applicants.push(applicant);
  }
  //Method to get an applicant
  static getApplicant(id, applicantId) {
    const job = jobs[id];
    return job?.applicants[applicantId];
  }
  // Method to delete an applicant by ID
  static deleteApplicantById(id, applicantId) {
    const job = jobs[id];
    if (!job) {
      throw new Error("Job not found");
    }
    if (applicantId >= 0 && job.applicants.length > 0) {
      fs.unlinkSync(jobs[id].applicants[applicantId].resumePath);
      job.applicants.splice(applicantId, 1);
    } else {
      throw new Error("Applicant not found");
    }
  }

  // Method to edit an applicant
  static editApplicantById(id, applicantId, resumePath, applicant) {
    if (resumePath) {
      fs.unlinkSync(jobs[id].applicants[applicantId].resumePath);
    }
    jobs[id].applicants[applicantId] = applicant;
  }
}

// Array to store jobs
let jobs = [
  {
    jobTitle: "Tech Angular Developer",
    company: "Go Digit",
    position: "Angular Developer",
    location: "Pune IND On-Site",
    salary: "6-10lpa",
    applyLink: "#",
    skills: ["Angular", "SQL", "AWS", "MongoDB", "Express"],
    jobDescription: "Description for Angular Developer position at Go Digit.",
    noOfOpenings: 5,
    endDate: "2024-05-31",
    applicants: [],
  },
  {
    jobTitle: "Tech SDE",
    company: "Juspay",
    position: "SDE",
    location: "Bangalore IND",
    salary: "20-26lpa",
    applyLink: "#",
    skills: ["JavaScript", "Node.js", "React", "RESTful API", "MongoDB"],
    jobDescription: "Description for SDE position at Juspay.",
    noOfOpenings: 3,
    endDate: "2024-06-15",
    applicants: [],
  },
  {
    jobTitle: "Tech SDE",
    company: "Coding Ninjas",
    position: "SDE",
    location: "Gurgaon HR IND Remote",
    salary: "14-20lpa",
    applyLink: "#",
    skills: ["Java", "Spring Boot", "Hibernate", "MySQL", "RESTful API"],
    jobDescription: "Description for SDE position at Coding Ninjas.",
    noOfOpenings: 7,
    endDate: "2024-06-30",
    applicants: [],
  },
];
