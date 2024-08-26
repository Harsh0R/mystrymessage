import connectToDb from "@/lib/dbConnection";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  await connectToDb();

  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const decodedCode = decodeURIComponent(code);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          successs: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifyCode === decodedCode;
    const isCodeExpired = new Date(user.verifyCodeExpires) > new Date();

    if (isCodeValid && isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          successs: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (isCodeValid && !isCodeExpired) {
      return Response.json(
        {
          successs: false,
          message: "Code is valid but has expired",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          successs: false,
          message: "Code is invalid",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("Error in verify-code route => ", error);
    return Response.json(
      {
        successs: false,
        message: "Error in verify-code route",
      },
      {
        status: 500,
      }
    );
  }
}
