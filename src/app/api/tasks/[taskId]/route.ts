import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verify } from "jsonwebtoken";
import { connectDB } from "../../db";

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

    const db = await connectDB();

    const checkTaskOwnershipQuery = `
      SELECT tasks.id
      FROM tasks
      INNER JOIN projects ON tasks.project_id = projects.id
      WHERE tasks.id = ? AND projects.user_id = ?
    `;

    const [taskOwnership] = await db.query(checkTaskOwnershipQuery, [
      taskId,
      decodedToken.userId,
    ]);

    if (!taskOwnership || taskOwnership["length"] === 0) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    const updateTaskQuery = `
      UPDATE tasks
      SET title = ?, description = ?, status = ?
      WHERE id = ?
    `;

    const result = await db.query(updateTaskQuery, [
      title,
      description,
      status,
      taskId,
    ]);

    const getUpdatedTaskQuery = `
      SELECT *
      FROM tasks
      WHERE id = ?
    `;

    const [updatedTask] = await db.query(getUpdatedTaskQuery, [taskId]);

    db.end();

    if (result["affectedRows"] === 0) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask[0] },
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

    const db = await connectDB();

    const checkTaskOwnershipQuery = `
      SELECT tasks.id
      FROM tasks
      INNER JOIN projects ON tasks.project_id = projects.id
      WHERE tasks.id = ? AND projects.user_id = ?
    `;

    const [taskOwnership] = await db.query(checkTaskOwnershipQuery, [
      taskId,
      decodedToken.userId,
    ]);

    if (!taskOwnership || taskOwnership["length"] === 0) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    const deleteTaskQuery = `
      DELETE FROM tasks
      WHERE id = ?
    `;

    const result = await db.query(deleteTaskQuery, [taskId]);

    db.end();

    if (result["affectedRows"] === 0) {
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
