import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import { url } from "inspector";

export async function sendVerifivationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("email in sendVerificationEmail => ", email);
    console.log("username in sendVerificationEmail => ", username);
    console.log("verifyCode in sendVerificationEmail => ", verifyCode);
  
    await resend.emails.send({
      from: "dev@harshradadiya.com",
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
