import UserModel from "@/model/User";
import connectToDb from "@/lib/dbConnection";
import { Message } from "@/model/User";

export async function POST(req: Request) {
  await connectToDb();

  const { username, message } = await req.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
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

    //is user accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          successs: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }
    const newMessage = {
      message,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        successs: true,
        message: "Message sent successfully",
        data: newMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in send-message route => ", error);
    return Response.json(
      {
        successs: false,
        message: "Error in sending message",
      },
      {
        status: 500,
      }
    );
  }
}
