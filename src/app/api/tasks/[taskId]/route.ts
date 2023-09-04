import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verify } from "jsonwebtoken";
import { sql } from "@vercel/postgres";

const SECRET_KEY = process.env.SECRET_KEY;

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];
  const taskId = Number(params.taskId);

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    const { title, description, status } = await request.json();

    if (!title || !description || status === undefined) {
      return NextResponse.json(
        { message: "Title, description, and status are required" },
        { status: 400 }
      );
    }

    const getTaskResult = await sql`SELECT tasks.id
    FROM tasks
    INNER JOIN projects ON tasks.project_id = projects.id
    WHERE tasks.id = ${taskId} AND projects.user_id = ${decodedToken.userId}`;

    if (getTaskResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    const updatedTaskResult = await sql`UPDATE tasks
    SET title = ${title}, description = ${description}, status = ${status}
    WHERE id = ${taskId}`;

    if (updatedTaskResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTaskResult.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating a task:", error);
    return NextResponse.json(
      { message: "Failed to update a task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];
  const taskId = Number(params.taskId);

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    const taskOwnership = await sql`SELECT tasks.id FROM tasks
    INNER JOIN projects ON tasks.project_id = projects.id
    WHERE tasks.id = ${taskId} AND projects.user_id = ${decodedToken.userId}`;

    if (!taskOwnership || taskOwnership["length"] === 0) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    const deletedTaskResult = await sql`DELETE FROM tasks WHERE id = ${taskId}`;

    if (deletedTaskResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting a task:", error);
    return NextResponse.json(
      { message: "Failed to delete a task" },
      { status: 500 }
    );
  }
}
