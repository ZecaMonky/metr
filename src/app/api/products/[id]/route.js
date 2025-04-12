import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req, context) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "ID отсутствует" }, { status: 400 });
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    return NextResponse.json(
      { error: "Не удалось удалить товар", details: error.message },
      { status: 500 }
    );
  }
}
