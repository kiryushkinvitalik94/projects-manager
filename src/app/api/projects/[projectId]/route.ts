import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verify } from "jsonwebtoken";
import { sql } from "@vercel/postgres";

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

    const getProjectResult =
      await sql`SELECT * FROM projects WHERE id = ${projectId}`;
    let projectData = {};

    if (getProjectResult.rowCount > 0) {
      projectData = getProjectResult.rows[0];
      projectData["tasks"] = [];

      const getTasksResult =
        await sql`SELECT * FROM tasks WHERE project_id = ${projectId}`;

      if (getTasksResult.rowCount > 0 && getTasksResult.rows.length > 0) {
        projectData["tasks"] = getTasksResult.rows;
      }
    } else {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Project with tasks retrieved successfully",
        project: projectData,
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

    const result =
      await sql`UPDATE projects SET name = ${name}, description = ${description} WHERE id = ${projectId} AND user_id = ${decodedToken.userId}`;

    if (result) {
      return NextResponse.json(
        {
          message:
            "Project not found or you don't have permission to update it",
        },
        { status: 404 }
      );
    }

    const getUpdatedProjectResult =
      await sql`SELECT * FROM projects WHERE id = ${projectId}`;

    return NextResponse.json(
      {
        message: "Project updated successfully",
        project: getUpdatedProjectResult.rows[0],
      },
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

    const deletedProject =
      await sql`DELETE FROM tasks WHERE project_id = ${projectId} AND user_id = ${decodedToken.userId}`;

    console.log(deletedProject, "deletedProject");

    if (deletedProject) {
      return NextResponse.json(
        {
          message:
            "Project not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    await sql`DELETE FROM projects WHERE id = ${projectId} AND user_id = ${decodedToken.userId}`;

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
