import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import db from "../index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwtSecret = process.env.SECRET_KEY;

export const Signup = async (req, res) => {
  const email = req.body.email;

  // Check if the email already exists and is verified
  db.query(
    "SELECT * FROM userauth WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .send({ success: false, message: "Database query failed" });
      }
      if (results.length > 0 && results[0].isverified) {
        return res
          .status(200)
          .send({ success: false, message: "Email already exists!" });
      } else {
        if (results.length > 0) {
          db.query(
            "DELETE FROM userauth WHERE email = ?",
            [email],
            (err, result) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: "Failed to delete existing unverified email",
                });
              }
            }
          );
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Insert new user
        const newUser = {
          ...req.body,
          password: hashedPassword,
          isVerified: false,
          OTP: "",
        };

        db.query("INSERT INTO userauth SET ?", newUser, (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({ success: false, message: "Failed to create user" });
          }
          res
            .status(200)
            .send({ success: true, message: "OTP sent successfully" });
        });
      }
    }
  );
};

export const SendOTP = async (req, res) => {
  const email = req.body.email;
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  // Configure nodemailer with your email service provider
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "nsmc21129nitw@gmail.com",
      pass: "usch khfq irmx xqqj",
    },
  });

  // Construct email message
  const mailOptions = {
    from: "nsmc21129nitw@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP to create an account is: ${otp}`,
  };

  try {
    // Update user with the new OTP
    const query = "UPDATE userauth SET otp = ? WHERE email = ?";
    db.query(query, [otp, email], (err, results) => {
      if (err) {
        console.error("Failed to update OTP: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to update OTP" });
      }

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to send OTP" });
        }
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
      });
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const Login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Find user by email
    const query = "SELECT * FROM userauth WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Database query failed: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      }

      const found = results[0];
      const match = await bcrypt.compare(password, found.password);

      if (match && found.isverified) {
        const token = jwt.sign(
          { id: found.id, email: found.email },
          jwtSecret,
          { expiresIn: "1h" }
        );

        // Update the user token in the database
        const updateQuery = "UPDATE userauth SET token = ? WHERE email = ?";
        db.query(updateQuery, [token, email], (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Failed to update token: ", updateErr);
            return res
              .status(500)
              .json({ success: false, message: "Failed to update token" });
          }

          const obj = {
            name: found.name,
            email: found.email,
            token: token,
          };

          res.send({ success: true, obj });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid credentials or user not verified",
        });
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const VerifyOTP = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.OTP;

  try {
    // Check if the email and OTP match
    const query = "SELECT * FROM userauth WHERE email = ? AND otp = ?";
    db.query(query, [email, otp], (err, results) => {
      if (err) {
        console.error("Database query failed: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }

      if (results.length > 0) {
        // Update the user as verified
        const updateQuery =
          "UPDATE userauth SET isVerified = ? WHERE email = ?";
        db.query(updateQuery, [true, email], (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Failed to update user: ", updateErr);
            return res
              .status(500)
              .json({ success: false, message: "Failed to update user" });
          }

          res.status(200).json({ success: true, message: "User Registered" });
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid OTP" });
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};
