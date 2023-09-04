require("dotenv").config();
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

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

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      template: options.template,
      context: {
        ...options.params
      },
      attachments
    };
    this.transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        return cb(err, null);
      }
      console.log("Email sent successfully");
      return cb(null, data);
    });
  };

  /**
   * @description Send verification code
   * @param {*} name
   * @param {*} email
   * @param {*} randomCode
   */
  static sendVerificationCode(name, email, link) {
    this._sendEmail(
      {
        email,
        subject: "Please confirm your email",
        template: "verification-token",
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

  static sendPasswordCode(name, email, link) {
    this._sendEmail(
      {
        email,
        subject: "Is this email yours?",
        template: "password-update",
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
   * @description Send stipend request email recieved
   * @param {*} stipend request
   * @param {*} email
   */

  static sendRecievedStipendRequest(stipendCategory, email) {
    this._sendEmail(
      {
        email,
        subject: "Stipend Request Received",
        template: "stipend-request-recieved",
        params: {
          stipendRequest: stipendCategory
        }
      },
      (err, data) => {
        if (err) console.log(err);
      }
    );
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
}

module.exports = Mail;
