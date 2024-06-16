require("dotenv").config();
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const Logger = require("../config/logger");

class Mail {
  static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    // // secureConnection: true,
    port: process.env.SMTP_PORT,

    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  static _sendEmail = (options, cb) => {
    this.transporter.use(
      "compile",
      hbs({
        viewEngine: {
          partialsDir: path.join(__dirname, "../views/emails"),
          layoutsDir: path.join(__dirname, "../views/emails"),
          defaultLayout: ""
        },
        viewPath: path.join(__dirname, "../views/emails")
      })
    );
    const attachments = options.attachments
      ? [{ ...options.attachments }]
      : null;

    const { email, message, subject, params, template } = options;

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: subject,
      text: message,
      template: template,
      context: {
        ...params
      },
      attachments
    };
    this.transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        return cb(err, null);
      }
      Logger.info("Email sent successfully");
      return cb(null, data);
    });
  };

  /**
   * @description Send verification email on stipend application
   * @param {*} name
   * @param {*} email
   * @param {*} link
   */
  static applicationReceivedSendVerification(user, stipendApplication, link) {
    this._sendEmail(
      {
        email: user.email,
        subject: "Complete Your Stipend Application",
        template: "application-received-verification",
        params: {
          name: user.name,
          stipendCategory: stipendApplication.stipendCategory,
          link,
          userEmail: user.email
        }
      },
      (err, data) => {
        if (err) Logger.error(err);
      }
    );
  }

  /**
   * @description Resends verification email for an expired token
   * @param {*} name
   * @param {*} email
   * @param {*} link
   */
  static resendVerificationEmail(name, email, link) {
    this._sendEmail(
      {
        email,
        subject: "Please verify your email",
        template: "resend-verification",
        params: {
          name: name,
          link,
          userEmail: email
        }
      },
      (err, data) => {
        if (err) console.log(err);
      }
    );
  }

  /**
   * @description Send password reset email
   * @param {*} name
   * @param {*} email
   * @param {*} link
   */
  static sendResetPasswordEmail(name, email, link) {
    this._sendEmail(
      {
        email,
        subject: "Password Reset Request",
        template: "password-reset",
        params: {
          name: name,
          link,
          userEmail: email
        }
      },
      (err) => {
        if (err) Logger.error(err);
      }
    );
  }

  /**
   * @description Send stipend request email received for returning users
   * @param {*} stipend request
   * @param {*} email
   */
  static stipendApplicationReceivedConfirmation(
    stipendCategory,
    email,
    name,
    link
  ) {
    this._sendEmail(
      {
        email,
        subject: "Stipend Request Received",
        template: "stipend-request-received",
        params: {
          stipendCategory,
          email,
          name,
          link
        }
      },
      (err) => {
        if (err) console.log(err);
      }
    );
  }

  static sendStipendApplicationStatusUpdate(userStipendApplication) {
    // Todo: Add date and status this
    const { email, name, stipendCategory } = userStipendApplication;
    this._sendEmail(
      {
        email,
        subject: "Application Status Update",
        template: "stipend-application-update",
        params: {
          email,
          name,
          stipendCategory
        }
      },

      (err, data) => {
        if (err) console.log(err);
      }
    );
  }

  /**
   * @description Batch send email updates
   * @param {*} email
   */
  static batchSendApplicationStipendStatusEmails(userStipendApplicationList) {
    userStipendApplicationList.forEach((userStipendApplication) => {
      this.sendStipendApplicationStatusUpdate(userStipendApplication);
    });
  }

  static applicationStatus(email, stipendCategory, message, subject) {
    this._sendEmail(
      {
        email,
        subject: "Application Status",
        template: "update-for-recieved",
        params: {
          email: email,
          stipendRequest: stipendCategory
        }
      },
      (err, data) => {
        if (err) console.log(err);
      }
    );
  }

  static applicationStatusForApproved(
    email,
    stipendCategory,
    message,
    subject
  ) {
    this._sendEmail(
      {
        email,
        subject: "Application Status",
        template: "update-for-approved",
        params: {
          email: email,
          stipendRequest: stipendCategory
        }
      },

      (err, data) => {
        if (err) console.log(err);
      }
    );
  }

  static applicationStatusForDenied(email, stipendCategory, message, subject) {
    this._sendEmail(
      {
        email,
        subject: "Application Status",
        template: "update-for-denied",
        params: {
          email: email,
          stipendRequest: stipendCategory
        }
      },
      (err, data) => {
        if (err) console.log(err);
      }
    );
  }

  /**
   * @description Send notification that user has been added to waitlist
   * @param {*} email
   */
  static sendWelcomeToWaitlist(email, name) {
    this._sendEmail(
      {
        email,
        subject: "Welcome to the Waitlist",
        template: "welcome-to-waitlist",
        params: {
          name
        }
      },
      (err, data) => {
        if (err) console.log(err);
      }
    );
  }

  /**
   * @description Send appreciation email after successful donation
   */
  static sendThankYouForDonation(email, amount) {
    this._sendEmail(
      {
        email,
        subject: "Thank You For Your Support",
        template: "thank-you-for-donating",
        params: {
          amount
        }
      },
      (err, data) => {
        if (err) {
          Logger.error('Error sending thank you email', err);
        }
      }
    );
  }
}

module.exports = Mail;
