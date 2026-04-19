"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, User, MapPin, CreditCard, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateOrderPaymentStatus, updateOrderDeliveryStatus } from "@/actions/orders";
import { formatPrice, buildWhatsAppLink } from "@/lib/utils";
import type { OrderWithItems } from "@/types";

export function OrderDetailClient({ order }: { order: OrderWithItems }) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);

  async function handlePaymentChange(status: string) {
    const s = status as "UNPAID" | "PAID";
    setPaymentStatus(s);
    await updateOrderPaymentStatus(order.id, s);
    router.refresh();
  }

  async function handleDeliveryChange(status: string) {
    const s = status as "NOT_DELIVERED" | "DELIVERED";
    setDeliveryStatus(s);
    await updateOrderDeliveryStatus(order.id, s);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/admin/orders`}><ChevronLeft className="h-4 w-4 me-1" />{t("orders")}</Link>
        </Button>
        <h1 className="text-2xl font-bold flex-1">{t("order")} {order.orderNumber}</h1>
        <Button className="bg-emerald-500 hover:bg-emerald-600" asChild>
          <a href={buildWhatsAppLink(order.whatsappNumber, `Hi ${order.customerName}, regarding order ${order.orderNumber}`)} target="_blank" rel="noopener">
            <MessageCircle className="h-4 w-4 me-2" />{t("whatsapp")}
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Package className="h-4 w-4" />{t("items")}</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  {item.image && (
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                      <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">×{item.quantity}{item.color && ` • ${item.color}`}{item.size && ` • ${item.size}`}</p>
                  </div>
                  <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("subtotal")}</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("shipping")}</span><span>{formatPrice(order.shippingCost)}</span></div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg"><span>{t("total")}</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><User className="h-4 w-4" />{t("customerInfo")}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">{t("name")}:</span> <span className="font-medium">{order.customerName}</span></div>
              <div><span className="text-muted-foreground">{t("whatsapp")}:</span> <span className="font-medium">{order.whatsappNumber}</span></div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><MapPin className="h-4 w-4" />{t("deliveryDetails")}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">{t("city")}:</span> <Badge variant="outline">{order.city}</Badge></div>
              <div><span className="text-muted-foreground">{t("delivery")}:</span> <Badge variant="outline">{order.deliveryType}</Badge></div>
              {order.deliveryType === "HOME" && order.address && (
                <div className="col-span-2"><span className="text-muted-foreground">{t("address")}:</span> <span className="font-medium">{order.address}</span></div>
              )}
              {order.deliveryType === "HOTEL" && (
                <>
                  <div><span className="text-muted-foreground">{t("hotel")}:</span> <span className="font-medium">{order.hotelName}</span></div>
                  <div><span className="text-muted-foreground">{t("guest")}:</span> <span className="font-medium">{order.guestName}</span></div>
                  <div><span className="text-muted-foreground">{t("room")}:</span> <span className="font-medium">{order.roomNumber}</span></div>
                </>
              )}
              {order.notes && (
                <div className="col-span-2"><span className="text-muted-foreground">{t("notes")}:</span> <span className="font-medium">{order.notes}</span></div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><CreditCard className="h-4 w-4" />{t("paymentStatus")}</h3>
            <div className="space-y-3">
              <div className="text-sm"><span className="text-muted-foreground">{t("method")}:</span> <span className="font-medium">{order.paymentMethod.replace(/_/g, " ")}</span></div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">{t("status")}</label>
                <Select value={paymentStatus} onValueChange={handlePaymentChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNPAID">{t("unpaid")}</SelectItem>
                    <SelectItem value="PAID">{t("paid")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Truck className="h-4 w-4" />{t("deliveryStatus")}</h3>
            <Select value={deliveryStatus} onValueChange={handleDeliveryChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_DELIVERED">{t("notDelivered")}</SelectItem>
                <SelectItem value="DELIVERED">{t("delivered")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-2xl border p-6 text-sm space-y-2">
            <div><span className="text-muted-foreground">{t("created")}:</span> {new Date(order.createdAt).toLocaleString()}</div>
            <div><span className="text-muted-foreground">{t("locale")}:</span> {order.locale}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
