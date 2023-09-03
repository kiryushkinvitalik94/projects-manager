import { NextRequest, NextResponse } from "next/server";
import { Client, sql } from "@vercel/postgres";
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

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    const existingUsers = sql`SELECT * FROM users WHERE email = ${email}`;

    if (existingUsers["rowCount"] > 0) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const result =
      await sql`INSERT INTO users (username, email, password, created_at, updated_at) VALUES (${username}, ${email}, ${hashedPassword}, NOW(), NOW()) RETURNING id`;

    if (result.rowCount > 0) {
      const userId = result.rows[0].id;

      const token = sign({ userId, email }, SECRET_KEY, {
        expiresIn: "24h",
      });

      return NextResponse.json(
        {
          message: "User registered successfully",
          user: { id: userId, username, email },
          token,
        },
        { status: 201 }
      );
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
    await client.end();
  }
}
