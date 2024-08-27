import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDb from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
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

  const userID = user._id;
  const { acceptedMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessages: acceptedMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          successs: false,
          message: "failed to update user status to accept messages",
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        successs: true,
        message: "Messages acceptance status updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in accept-messages route => ", error);
    return Response.json(
      {
        successs: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
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
  const userID = user._id;


  try {
    const findUser = await UserModel.findById(userID);
    if (!findUser) {
      return Response.json(
        {
          successs: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        successs: true,
        isAcceptingMessages: findUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in accept-messages route => ", error);
    return Response.json(
      {
        successs: false,
        message: "Error in fetching isAcceptingMessages",
      },
      {
        status: 500,
      }
    );  
    

  }
}
