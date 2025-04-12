import { PrismaClient } from "@prisma/client";
import AddProductForm from "../components/AddProductForm";
import OrderStatusForm from "../components/OrderStatusForm";
import ProductItem from "../components/ProductItem";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

async function getData() {
  const products = await prisma.product.findMany();
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return { products, orders };
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')?.value

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== "ADMIN") {
      redirect("/");
    }

    const { products, orders } = await getData();

    return (
      <div className="container mx-auto w-full mt-10 px-5 sm:px-0">
        <h1 className="text-2xl font-bold mb-4">Админ-панель</h1>
        <AddProductForm />

        <h2 className="text-xl font-semibold mt-6">Список товаров</h2>
        <ul className="space-y-4">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6">Заказы</h2>
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border-1 border-gray-200 p-4 rounded-xl shadow">
              <div>
                <strong>Заказ #{order.id}</strong>
                <OrderStatusForm orderId={order.id} currentStatus={order.status} />
              </div>
              <div>
                <span className="font-semibold">Пользователь:</span> {order.user.email}
              </div>
              <div>
                <span className="font-semibold">Метод доставки:</span> {order.deliveryMethod}
              </div>
              {order.deliveryAddress && (
                <div>
                  <span className="font-semibold">Адрес доставки:</span> {order.deliveryAddress}
                </div>
              )}
              <div>
                <span className="font-semibold">Товары:</span>
                <ul className="pl-5 list-disc">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} – {item.quantity} шт. (₽
                      {item.product.price * item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (err) {
    redirect("/login");
  }
}
