import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verify, TokenExpiredError } from "jsonwebtoken";
import { sql } from "@vercel/postgres";

const SECRET_KEY = process.env.SECRET_KEY;

export async function GET(request: NextRequest) {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Token is missing" }, { status: 400 });
  }

  try {
    const decodedToken = verify(token, SECRET_KEY);

    if (decodedToken.exp * 1000 < Date.now()) {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const result =
      await sql`SELECT id, username, email FROM users WHERE id = ${decodedToken.userId}`;

    if (result["rowCount"] === 0) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 401 }
      );
    }

    const user = result["rows"][0];

    return NextResponse.json(
      { message: "Auto login successful", user: user, token },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    } else {
      console.error("Error during auto login:", error);
      return NextResponse.json(
        { message: "Auto login failed" },
        { status: 401 }
      );
    }
  }
}
