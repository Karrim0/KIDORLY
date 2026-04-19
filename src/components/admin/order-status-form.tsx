"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateOrderPaymentStatus, updateOrderDeliveryStatus } from "@/actions/orders";
import { Loader2 } from "lucide-react";

interface OrderStatusFormProps {
  orderId: string;
  currentPayment: string;
  currentDelivery: string;
}

export function OrderStatusForm({ orderId, currentPayment, currentDelivery }: OrderStatusFormProps) {
  const router = useRouter();
  const [payment, setPayment] = useState(currentPayment);
  const [delivery, setDelivery] = useState(currentDelivery);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    if (payment !== currentPayment) {
      await updateOrderPaymentStatus(orderId, payment as "UNPAID" | "PAID");
    }
    if (delivery !== currentDelivery) {
      await updateOrderDeliveryStatus(orderId, delivery as "NOT_DELIVERED" | "DELIVERED");
    }
    setSaving(false);
    router.refresh();
  }

  const hasChanges = payment !== currentPayment || delivery !== currentDelivery;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Payment Status</Label>
        <Select value={payment} onValueChange={setPayment}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Delivery Status</Label>
        <Select value={delivery} onValueChange={setDelivery}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NOT_DELIVERED">Not Delivered</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {hasChanges && (
        <Button onClick={handleSave} size="sm" className="w-full" disabled={saving}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin me-1" /> : null}
          Save Changes
        </Button>
      )}
    </div>
  );
}
