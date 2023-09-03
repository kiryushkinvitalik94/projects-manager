import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verify } from "jsonwebtoken";
import { connectDB } from "../../db";
import { ProjectModel, TaskModel } from "models";

const SECRET_KEY = process.env.SECRET_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];
  const projectId = Number(params.projectId);

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const getProjectQuery = `
      SELECT *
      FROM projects
      WHERE id = ?
    `;

    const getTasksQuery = `
      SELECT tasks.*
      FROM tasks
      WHERE project_id = ?
    `;

    const [projectData] = await db.query(getProjectQuery, [projectId]);

    if (projectData && projectData["length"] > 0) {
      projectData[0].tasks = [];

      const [tasksData] = await db.query(getTasksQuery, [projectId]);

      if (tasksData && tasksData["length"] > 0) {
        projectData[0].tasks = tasksData;
      }
    } else {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    db.end();

    return NextResponse.json(
      {
        message: "Project with tasks retrieved successfully",
        project: projectData[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while getting project with tasks:", error);
    return NextResponse.json(
      { message: "Failed to get project with tasks" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];
  const projectId = Number(params.projectId);

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const { name, description } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { message: "Name and description are required" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const updateProjectQuery =
      "UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?";

    const result = await db.query(updateProjectQuery, [
      name,
      description,
      projectId,
      decodedToken.userId,
    ]);

    const getUpdatedProjectQuery = "SELECT * FROM projects WHERE id = ?";
    const [updatedProject] = await db.query(getUpdatedProjectQuery, [
      projectId,
    ]);

    db.end();

    if (result["affectedRows"] === 0) {
      return NextResponse.json(
        {
          message:
            "Project not found or you don't have permission to update it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating a project:", error);
    return NextResponse.json(
      { message: "Failed to update a project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];
  const projectId = Number(params.projectId);

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const deleteTasksQuery = "DELETE FROM tasks WHERE project_id = ?";
    await db.query(deleteTasksQuery, [projectId]);

    const deleteProjectQuery =
      "DELETE FROM projects WHERE id = ? AND user_id = ?";

    const result = await db.query(deleteProjectQuery, [
      projectId,
      decodedToken.userId,
    ]);

    db.end();

    if (result["affectedRows"] === 0) {
      return NextResponse.json(
        {
          message:
            "Project not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting a project:", error);
    return NextResponse.json(
      { message: "Failed to delete a project" },
      { status: 500 }
    );
  }
}
