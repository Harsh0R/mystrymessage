import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpScheme";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDb from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectToDb();

  console.log("authOptions => ", authOptions);

  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  console.log("session => ", session);
  console.log("_user => ", _user);

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated for messages" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  console.log("userId => ", userId);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    console.log("user => ", user);
    

    if (!user || user.length === 0) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
