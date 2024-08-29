import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDb from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { group } from "console";

export async function GET(req: Request) {
  await connectToDb();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      {
        successs: false,
        message: "You are not logged in",
      },
      {
        status: 401,
      }
    );
  }
  const userID = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userID } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          successs: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        successs: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in get-messages route => ", error);
    return Response.json(
      {
        successs: false,
        message: "Error in fetching messages",
      },
      {
        status: 500,
      }
    );
  }
}
