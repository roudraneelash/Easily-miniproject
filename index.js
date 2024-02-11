import express from "express";
import path from "path";
import recruiterController from "./src/controller/recruiter.controller.js";
import ejsLayouts from "express-ejs-layouts";
import session from "express-session";
import auth from "./src/middleware/auth.js";
import { validateRegistration } from "./src/middleware/validateRegistration.js";
import jobController from "./src/controller/job.controller.js";
import storesession from "./src/middleware/storesession.js";
import { uploadFile } from "./src/middleware/fileUpload.js";
const PORT = 8080;
const app = express();

import { fileURLToPath } from "url";
import { dirname } from "path";
import Job from "./src/model/Job.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use __dirname as needed

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.static("public"));
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "important",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(storesession);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", recruiterController.Login);
app.post("/login", recruiterController.handleLogin);

app.get("/register", recruiterController.register);
app.post(
  "/register",
  validateRegistration,
  recruiterController.handleRegistration
);

app.get("/logout", recruiterController.handleLogout);

// // /jobs route
app.get("/jobs", jobController.getAllJobs);
app.get("/createjobs", auth, jobController.getCreateJob);
app.post("/createjobs", auth, jobController.createJob);

app.get("/jobs/:id", jobController.getJobById);
app.get("/jobs/update/:id", auth, jobController.getUpdateJobForm);
app.post("/jobs/update/:id", auth, jobController.updateJob);
app.get("/jobs/delete/:id", auth, jobController.deleteJobById);

// // - /jobs/:id/applicants
app.get("/jobs/:id/applicants", auth, jobController.getApplicants);

app.get(
  "/jobs/:id/applicants/:applicantId/delete",
  auth,
  jobController.deleteApplicantsById
);
app.get(
  "/jobs/:id/applicants/:applicantId/edit",
  auth,
  jobController.editApplicant
);
app.post(
  "/jobs/:id/applicants/:applicantId/edit",
  uploadFile.single("resume"),
  auth,
  jobController.editApplicantsById
);
app.get("/jobs/:id/applicants/:applicantId/view", auth, (req, res) => {
  const { id, applicantId } = req.params;
  const applicant = Job.getApplicant(id, applicantId);
  const resumePath = applicant.resumePath;
  const absoluteResumePath = path.join(__dirname, resumePath);
  res.sendFile(absoluteResumePath, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
});

// //aplicants
app.get("/jobs/apply/:id", jobController.applyById);
app.post(
  "/jobs/apply/:id",
  uploadFile.single("resume"),
  jobController.submitApplication
);

app.listen(PORT, () => {
  console.log("server is up and running on port", PORT);
});
