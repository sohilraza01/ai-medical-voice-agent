import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    // Example: Hardcoded doctors for now
    const suggestedDoctors = [
      {
        id: "1",
        image: "/doctor1.png",
        specialist: "Cardiologist",
        name: "Dr. John Doe",
        about: "Specialist in heart health with 10 years experience",
      },
      {
        id: "2",
        image: "/doctor2.png",
        specialist: "Dermatologist",
        name: "Dr. Jane Smith",
        about: "Expert in skin and cosmetic treatments",
      },
    ];

    // Logic: You can later integrate AI or DB filtering based on `notes`
    return NextResponse.json(suggestedDoctors);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
