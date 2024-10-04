import connectMongoDB from "@/lib/mongodb";
import Roles from "@/models/roles";
import { NextResponse } from "next/server";
import { putRolestSchema } from "./schema";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  try {
    await connectMongoDB();
    const data = putRolestSchema.parse(await request.json());

    // Allow access only to all users
    if (!session) return new Response("401");
    const existingRole = await Roles.findOne({
      discordId: data.discordId,
    });

    let role;
    if (existingRole) {
      role = await Roles.findByIdAndUpdate(existingRole._id, data, {
        new: true,
      });
    } else {
      role = await Roles.create(data);
    }

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ message: error.message }, { status: 400 });
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    await connectMongoDB();
    if (id) {
      const roles = await Roles.findOne({ discordId: id });
      return NextResponse.json({ roles });
    } else {
      const roles = await Roles.find();
      return NextResponse.json({ roles });
    }
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ message: error.message }, { status: 400 });
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const discordKey = headers().get("discord-key");
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    const roles = await Roles.findOneAndDelete({ discordId: id });
    const houseRoles = await Roles.find({ house: roles.house });
    const userRoles = houseRoles.some(
      (role) => role.discordId === session?.user?.id
    );
    // Allow access only to high command roles and Discord Bot
    if (!session || (discordKey && discordKey === process.env.BOT_KEY))
      return new Response("401");
    return NextResponse.json({ roles });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ message: error.message }, { status: 400 });
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
