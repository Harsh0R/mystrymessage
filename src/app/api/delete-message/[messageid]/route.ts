import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connectToDb from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { group } from "console";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageID = params.messageid;
  await connectToDb();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
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
  const user: User = session?.user;
  const userID = new mongoose.Types.ObjectId(user._id);

  try {
    const updateUser = await UserModel.updateOne(
      { _id: userID },
      { $pull: { messages: { _id: messageID } } }
    );
    if (updateUser.modifiedCount === 0) {
      return Response.json(
        {
          successs: false,
          message: "Message not found or Already deleted",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        successs: true,
        message: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in delete-message route => ", error);
    return Response.json(
      {
        successs: false,
        message: "Error in deleting message",
      },
      {
        status: 500,
      }
    );
  }
}
