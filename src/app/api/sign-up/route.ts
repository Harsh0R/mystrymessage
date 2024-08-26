import connectToDb from "@/lib/dbConnection";
import UserModel from "../../../model/User";
import bcryptjs from "bcryptjs";
import { sendVerifivationEmail } from "@/helpers/sendVerificationEmail";
import { usernameValidation } from "@/schemas/signUpScheme";
import { log } from "console";

export async function POST(req: Request) {
  await connectToDb();
  try {
    const { username, email, password } = await req.json();
    
    
    const parsedUsername = usernameValidation.parse(username);


    log("parsedUsernames => ", parsedUsername);
    log("username => ", username);
    log("email => ", email);
    log("password => ", password);



    const existingUserVerifiedByUsername = await UserModel.findOne({
      username: parsedUsername,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          successs: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    log("existingUserByEmail => ", existingUserByEmail);
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            successs: false,
            message: "User already exists with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await UserModel.create({
        username:parsedUsername,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }
    //send verification email
    const emailResponse = await sendVerifivationEmail(
      email,
      username,
      verifyCode
    );
    if (emailResponse.successs) {
      return Response.json(
        {
          successs: true,
          message:
            "User Registered Successfully. Please check your email for verification code",
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        {
          successs: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }


  } catch (error) {
    console.log("Error in sign-up route => ", error);
    return Response.json(
      {
        successs: false,
        message: "Error in sign-up route",
      },
      {
        status: 500,
      }
    );
  }
}
