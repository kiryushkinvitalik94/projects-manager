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

    const { project_id, title, description, status } = await request.json();

    if (!project_id || !title || !description || status === "undefined") {
      return NextResponse.json(
        { message: "Project ID, title, description, and status are required" },
        { status: 400 }
      );
    }

    const result =
      await sql`INSERT INTO tasks (user_id, project_id, title, description, status)
      VALUES (${decodedToken.userId}, ${project_id}, ${title}, ${description}, ${status})
      `;

    if (!result) {
      return NextResponse.json(
        { message: "Failed to create a task" },
        { status: 500 }
      );
    }

    const newTaskId = result[0]["insertId"];

    const newTask = await sql`SELECT * FROM tasks WHERE id = ${newTaskId}`;

    return NextResponse.json(
      { message: "Task created successfully", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating a task:", error);
    return NextResponse.json(
      { message: "Failed to create a task" },
      { status: 500 }
    );
  }
}
