import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../db";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Please fill in all required fields" },
      { status: 400 }
    );
  }

  const db = await connectDB();

  try {
    // Check if the email is already registered
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password before storing it in the database
    const hashedPassword = await hash(password, 10);

    // Insert the new user into the database
    const result = await db.query(
      "INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [username, email, hashedPassword]
    );

    if (result[0]["affectedRows"] > 0) {
      const [newUser] = await db.query(
        "SELECT id, username, email FROM users WHERE id = ?",
        [result[0]["insertId"]]
      );
      if (Array.isArray(newUser) && newUser.length > 0) {
        const token = sign({ userId: newUser[0]["id"], email }, SECRET_KEY, {
          expiresIn: "24h",
        });

        return NextResponse.json(
          { message: "User registered successfully", user: newUser[0], token },
          { status: 201 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Failed to register user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    db.end(); // Close the database connection
  }
}
