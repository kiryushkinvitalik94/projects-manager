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

    const projectData =
      await sql`SELECT * FROM projects WHERE id = ${projectId}`;

    if (projectData) {
      projectData["tasks"] = [];

      const tasksData =
        await sql`SELECT * FROM tasks WHERE project_id = ${projectId}`;

      if (tasksData && tasksData["length"] > 0) {
        projectData["tasks"] = tasksData;
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

    const updatedProject =
      await sql`SELECT * FROM projects WHERE id = ${projectId}`;

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

    const deletedProject =
      await sql`DELETE FROM tasks WHERE project_id = ${projectId} AND user_id = ${decodedToken.userId}`;

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
