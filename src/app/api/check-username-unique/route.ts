import connectToDb from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpScheme";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {

    // if (req.method !== "GET") {
    //   return Response.json(
    //     {
    //       successs: false,
    //       message: "Method not allowed",
    //     },
    //     {
    //       status: 405,
    //     }
    //   );
        
    // }

  await connectToDb();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //velidate username with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log("result => ", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          successs: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        {
          status: 400,
        }
      );
    }

    const {username} = result.data;

    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    console.log("existingUserByUsername => ", existingUserByUsername);
    if (existingUserByUsername) {
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

    return Response.json(
      {
        successs: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );


  } catch (error) {
    console.log("Error in check-username-unique route => ", error);
    return Response.json(
      {
        successs: false,
        message: "Error in check-username-unique route",
      },
      {
        status: 500,
      }
    );
  }
}
