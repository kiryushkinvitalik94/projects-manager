import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verify } from "jsonwebtoken";
import { sql } from "@vercel/postgres";

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(request: NextRequest) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { message: "Name and description are required" },
        { status: 400 }
      );
    }

    const result =
      await sql`INSERT INTO projects (user_id = ${decodedToken.userId}, name = ${name}, description = ${description}`;

    if (result.rowCount > 0) {
      return NextResponse.json(
        { message: "Failed to create a project" },
        { status: 500 }
      );
    }

    const newProjectId = result[0]["insertId"];

    const newProject =
      await sql`SELECT * FROM projects WHERE id = ${newProjectId}`;

    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating a project:", error);
    return NextResponse.json(
      { message: "Failed to create a project" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const projects =
      await sql`SELECT * FROM projects WHERE user_id = ${decodedToken.userId}`;

    return NextResponse.json({ projects: projects }, { status: 200 });
  } catch (error) {
    console.error("Error while getting projects:", error);
    return NextResponse.json(
      { message: "Failed to get projects" },
      { status: 500 }
    );
  }
}
