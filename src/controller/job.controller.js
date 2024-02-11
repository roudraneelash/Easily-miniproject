import Job from "../model/Job.model.js";
import Applicant from "../model/Applicant.model.js";
import sendMail from "../middleware/nodemailer.js";

export default class jobController {
  static getAllJobs(req, res) {
    res.render("jobs", { jobData: Job.getAllJobs() });
  }
  static getJobById(req, res) {
    const { id } = req.params;
    const result = Job.searchJobById(id);
    res.render("jobDetails", { jobData: result, id: id });
  }
  static getCreateJob(req, res) {
    res.render("JobForm", {
      formData: null,
      errorMessage: null,
      id: null,
    });
  }
  // Updated method to handle job creation
  static createJob(req, res) {
    let {
      jobTitle,
      company,
      position,
      location,
      salary,
      jobDescription,
      noOfOpenings,
      endDate,
      skills,
    } = req.body;

    skills = skills.split(",").map((skill) => skill.trim());

    // Validate form data (add your validation logic here)

    // Create a new Job instance
    const newJob = new Job(
      jobTitle,
      company,
      position,
      location,
      salary,
      jobDescription,
      parseInt(noOfOpenings),
      endDate,
      skills
    );

    // Add the new job to the array of jobs
    Job.addJob(newJob);

    // Redirect to the jobs page after creating the job
    res.redirect("/jobs");
  }
  static getUpdateJobForm(req, res) {
    const { id } = req.params;
    let formData = Job.searchJobById(id);
    formData.skills = formData.skills.join(", ");
    res.render("JobForm", { formData, errorMessage: null, id });
  }
  static updateJob(req, res) {
    const { id } = req.params;
    Job.updateById(id, req.body);
    res.redirect("/jobs/" + id);
  }
  static deleteJobById(req, res) {
    const { id } = req.params;
    Job.deleteById(id);
    res.redirect("/jobs");
  }
  static applyById(req, res) {
    const { id } = req.params;
    res.render("applyJob", {
      errorMessage: null,
      formData: null,
      id: id,
    });
  }
  static getApplicants(req, res) {
    const { id } = req.params;
    const job = Job.searchJobById(id);

    if (!job) {
      // Handle the case where the job is not found
      return res.status(404).send("Job not found");
    }

    // Render the view with jobData
    res.render("viewApplicants", { jobData: job, id: id });
  }
  static editApplicant(req, res) {
    const { id, applicantId } = req.params;
    const applicant = Job.getApplicant(id, applicantId);
    res.render("applyJob", {
      errorMessage: null,
      formData: applicant,
      id: id,
      applicantId: applicantId,
    });
  }
  static deleteApplicantsById(req, res) {
    const { id, applicantId } = req.params;
    Job.deleteApplicantById(id, applicantId);
    res.redirect(`/jobs/${id}/applicants`);
  }

  static editApplicantsById(req, res) {
    const { id, applicantId } = req.params;
    const { name, phone, email } = req.body;

    if (req.file) {
      const filePath = req.file.path;
      const applicant = new Applicant(name, phone, email, filePath);
      Job.editApplicantById(id, applicantId, filePath, applicant);
    } else {
      const existingApplicant = Job.getApplicant(id, applicantId);
      if (existingApplicant) {
        const applicant = new Applicant(
          name,
          phone,
          email,
          existingApplicant.resumePath
        );
        Job.editApplicantById(id, applicantId, null, applicant);
      } else {
        // Handle case where no existing applicant is found
        return res.status(404).send("Applicant not found.");
      }
    }
    res.redirect(`/jobs/${id}/applicants`);
  }

  static submitApplication(req, res) {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    if (!req.file) {
      // Handle case where no file was uploaded
      return res.render("applyJob", {
        errorMessage: "Please select a file.",
        formData: req.body,
        id: id,
        applicantId: null,
      });
    }
    const filePath = req.file.path;

    const applicant = new Applicant(name, phone, email, filePath);
    Job.addApplicant(applicant, id);
    const job = Job.searchJobById(id);
    // Send email
    sendMail(email, job);
    res.render("ThankYou");
  }
}
