"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ShoppingBag, Package, FolderOpen, DollarSign,
  Truck, AlertCircle, CheckCircle, Clock, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, buildWhatsAppLink } from "@/lib/utils";
import type { OrderWithItems } from "@/types";

interface DashboardClientProps {
  stats: {
    totalOrders: number;
    unpaidOrders: number;
    paidOrders: number;
    deliveredOrders: number;
    notDeliveredOrders: number;
    totalProducts: number;
    totalCategories: number;
  };
  recentOrders: OrderWithItems[];
}

export function DashboardClient({ stats, recentOrders }: DashboardClientProps) {
  const locale = useLocale();
  const t = useTranslations("admin");

  const statCards = [
    { label: t("totalOrders"), value: stats.totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: t("unpaid"), value: stats.unpaidOrders, icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
    { label: t("paid"), value: stats.paidOrders, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
    { label: t("delivered"), value: stats.deliveredOrders, icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: t("pendingDelivery"), value: stats.notDeliveredOrders, icon: Truck, color: "bg-orange-50 text-orange-600" },
    { label: t("products"), value: stats.totalProducts, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: t("categories"), value: stats.totalCategories, icon: FolderOpen, color: "bg-pink-50 text-pink-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("dashboard")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border p-4">
            <div className={`h-10 w-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Button asChild><Link href={`/${locale}/admin/products/new`}>+ {t("newProduct")}</Link></Button>
        <Button variant="outline" asChild><Link href={`/${locale}/admin/categories/new`}>+ {t("newCategory")}</Link></Button>
        <Button variant="outline" asChild><Link href={`/${locale}/admin/orders`}>{t("viewAllOrders")}</Link></Button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">{t("recentOrders")}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/admin/orders`}>{t("viewAll")}</Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>{t("noOrdersYet")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("order")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("customer")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("city")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("total")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("payment")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("delivery")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3">
                      <Link href={`/${locale}/admin/orders/${order.id}`} className="font-mono text-xs font-semibold hover:text-primary">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3"><Badge variant="outline" className="text-xs">{order.city}</Badge></td>
                    <td className="p-3 font-semibold">{formatPrice(order.total)}</td>
                    <td className="p-3">
                      <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                        {order.paymentStatus === "PAID" ? t("paid") : t("unpaid")}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={order.deliveryStatus === "DELIVERED" ? "success" : "outline"}>
                        {order.deliveryStatus === "DELIVERED" ? t("delivered") : t("notDelivered")}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/${locale}/admin/orders/${order.id}`}><ShoppingBag className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" asChild>
                          <a href={buildWhatsAppLink(order.whatsappNumber, `Hi ${order.customerName}`)} target="_blank" rel="noopener">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
