// install nodemailer package
//configure email and send it
import nodemailer from "nodemailer";

async function sendMail(email, job) {
  // 1.create email transporter

  // configure SMTP(send mail trasnfer protocol) server
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "das.rudra2504@gmail.com",
      pass: "offq rzqb cryw morl",
    },
  });
  // Configure email options
  const mailOptions = {
    from: '"Naukri Portal" <das.rudra2504@gmail.com>',
    to: email,
    subject: "Application Submitted Successfully",
    html: `
        <h4>Thank You for Submitting Your Application!</h4>
        <p>We have received your application successfully.</p>
        <p>Our team will review it and get back to you shortly.</p>
        <p>Best regards,<br/>${job.company}</p>
      `,
  };
  //send email
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email sent failed\n", err);
  }
}

export default sendMail;
