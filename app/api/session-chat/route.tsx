import { db } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from "@clerk/nextjs/server";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";


export async function POST(req:NextRequest){
    const {notes,selectedDoctor} = await req.json();
    const user = await currentUser();
    try{
        const sessionId = uuidv4();
        const result  = await db.insert(SessionChatTable).values({
        sessionId:sessionId,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        notes:notes,
        selectedDoctor:selectedDoctor,
        createdOn:(new Date()).toString()
        //@ts-ignore
    }).returning({ SessionChatTable });
    return NextResponse.json(result[0]?.SessionChatTable)

    }
    catch(e){
        return NextResponse.json(e);
    }
}



export async function GET(req:NextRequest){
    const {searchParams}  = new URL(req.url);
    const sessionId=searchParams.get('sessionId');
    const user = await currentUser();
    console.log("user:", user);
    const result= await db.select().from(SessionChatTable)
    // @ts-ignore
    .where(eq(SessionChatTable.sessionId,sessionId));

    return NextResponse.json(result[0])
}







// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const sessionId = searchParams.get('sessionId');

//     if (!sessionId) {
//       return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
//     }

//     const result = await db
//       .select()
//       .from(SessionChatTable)
//     //   @ts-ignore
//       .where(eq(SessionChatTable.sessionId, sessionId));

//     if (result.length === 0) {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }

//     return NextResponse.json(result[0]);
//   } catch (error: any) {
//     console.error("Error fetching session:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
