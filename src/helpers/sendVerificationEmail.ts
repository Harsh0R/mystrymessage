import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import nodemailer from "nodemailer";
import { url } from "inspector";
import { render } from "@react-email/components";
import { use } from "react";

export async function sendVerifivationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("email in sendVerificationEmail => ", email);
    console.log("username in sendVerificationEmail => ", username);
    console.log("verifyCode in sendVerificationEmail => ", verifyCode);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshradadiya9999@gmail.com",
        pass: "oolaedzyrvepevsn",
      },
    });

    const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));

    const options = {
      from: "harshradadiya9999@gmail.com",
      to: email,
      subject: "Verify your email",
      html: emailHtml,
    };

    await transporter.sendMail(options);

    await resend.emails.send({
      from: "harsh@hiteshchoudhary.com",
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      successs: true,
      message: "Email sent successfully",
      isAccesptingMessage: false,
      messages: undefined,
    };
  } catch (error) {
    console.log("Error in sendVerificationEmail => ", error);
    return {
      successs: false,
      message: "Error in sendVerificationEmail",
      isAccesptingMessage: false,
      messages: undefined,
    };
  }
}
