import { Message } from "@/model/User";


export interface ApiResponse{
    successs:boolean;
    message:string;
    isAccesptingMessage:boolean;
    messages?:Array<Message>
}