import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalOrders = orders.length;

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    let totalRevenue = 0;
    let totalItemsSold = 0;
    let weeklyOrders = 0;
    const productSales = new Map();
    const revenueByDate = new Map();

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const dateKey = orderDate.toISOString().split('T')[0];

      let orderTotal = 0;

      order.items.forEach(item => {
        const itemRevenue = item.product.price * item.quantity;
        totalRevenue += itemRevenue;
        totalItemsSold += item.quantity;
        orderTotal += itemRevenue;

        const productName = item.product.name;
        const currentQuantity = productSales.get(productName) || 0;
        productSales.set(productName, currentQuantity + item.quantity);
      });

      const currentRevenue = revenueByDate.get(dateKey) || 0;
      revenueByDate.set(dateKey, currentRevenue + orderTotal);

      if (orderDate >= oneWeekAgo) {
        weeklyOrders++;
      }
    });

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const topProductEntry = Array.from(productSales.entries())
      .sort((a, b) => b[1] - a[1])[0];
    const topProduct = topProductEntry
      ? { name: topProductEntry[0], quantity: topProductEntry[1] }
      : null;

    return new Response(
      JSON.stringify({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        totalItemsSold,
        weeklyOrders,
        topProduct,
        revenueByDate: Object.fromEntries(revenueByDate),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), {
      status: 500,
    });
  }
}
