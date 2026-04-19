"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Search, MessageCircle, Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, buildWhatsAppLink } from "@/lib/utils";
import type { OrderWithItems } from "@/types";

interface Props {
  orders: OrderWithItems[];
  filters: { status?: string; payment?: string; search?: string };
}

export function OrdersListClient({ orders, filters }: Props) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = React.useState(filters.search || "");

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", search || null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("orders")}</h1>
        <Badge variant="outline" className="text-sm">{orders.length} {t("orders")}</Badge>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("searchOrders")} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
        </form>
        <Select value={filters.payment || "all"} onValueChange={(v) => updateFilter("payment", v)}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder={t("payment")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allPayments")}</SelectItem>
            <SelectItem value="PAID">{t("paid")}</SelectItem>
            <SelectItem value="UNPAID">{t("unpaid")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status || "all"} onValueChange={(v) => updateFilter("status", v)}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder={t("delivery")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allDelivery")}</SelectItem>
            <SelectItem value="DELIVERED">{t("delivered")}</SelectItem>
            <SelectItem value="NOT_DELIVERED">{t("notDelivered")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t("noOrdersFound")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("order")} #</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("date")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("customer")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("city")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("items")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("total")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("payment")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("delivery")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 font-mono text-xs font-semibold">{order.orderNumber}</td>
                    <td className="p-3 text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.whatsappNumber}</div>
                    </td>
                    <td className="p-3"><Badge variant="outline">{order.city}</Badge></td>
                    <td className="p-3">{order.items.length}</td>
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
                          <Link href={`/${locale}/admin/orders/${order.id}`}><Eye className="h-3.5 w-3.5" /></Link>
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
