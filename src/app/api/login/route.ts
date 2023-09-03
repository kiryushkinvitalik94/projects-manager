import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { sql } from "@vercel/postgres";

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Please fill in all required fields" },
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const user =
      await sql`SELECT username, id, email, created_at, updated_at, password FROM users WHERE email = ${email}`;

    console.error(user, "user");

    if (user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const storedPassword = user["password"];

    // Compare the provided password with the stored password
    const passwordMatch = await compare(password, storedPassword);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate and sign a JWT token
    const token = sign(
      { userId: user["id"], email },
      SECRET_KEY, // Use an environment variable for the secret
      {
        expiresIn: "24h",
      }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          name: user["username"],
          email: user["email"],
          created_at: user["created_at"],
          updated_at: user["updated_at"],
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
