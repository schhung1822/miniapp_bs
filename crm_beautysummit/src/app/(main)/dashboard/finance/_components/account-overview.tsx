"use client";

import { Plus } from "lucide-react";
import { siApple, siPaypal, siOpenai, siVercel, siFigma } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, cn } from "@/lib/utils";

function ChipSVG() {
  return (
    <svg enableBackground="new 0 0 132 92" viewBox="0 0 132 92" xmlns="http://www.w3.org/2000/svg" className="w-14">
      <title>Chip</title>
      <rect x="0.5" y="0.5" width="131" height="91" rx="15" className="fill-accent stroke-accent" />
      <rect x="9.5" y="9.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="9.5" y="61.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="9.5" y="35.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="9.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="61.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="35.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
    </svg>
  );
}

const recentPayments = [
  {
    id: 1,
    icon: siPaypal,
    title: "API tiktok",
    subtitle: "Nhận qua PayPal cho dự án Website Tool TikTok",
    type: "credit",
    amount: 1200,
    date: "Jul 8",
  },
  {
    id: 2,
    icon: siOpenai,
    title: "ChatGPT",
    subtitle: "Đăng ký hàng tháng OpenAI",
    type: "debit",
    amount: 20,
    date: "Jul 7",
  },
  {
    id: 3,
    icon: siVercel,
    title: "Vercel Hosting",
    subtitle: "Chi phí lưu trữ đám mây Vercel",
    type: "debit",
    amount: 160,
    date: "Jul 4",
  },
  {
    id: 4,
    icon: siFigma,
    title: "Figma Pro",
    subtitle: "Gói chuyên nghiệp Figma",
    type: "debit",
    amount: 35,
    date: "Jul 2",
  },
];

export function AccountOverview() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="items-center">
        <CardTitle>Thẻ của tôi</CardTitle>
        <CardDescription>Tổng quan về thẻ, số dư và các giao dịch gần đây của bạn trong một cái nhìn.</CardDescription>
        <CardAction>
          <Button size="icon" variant="outline">
            <Plus className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs className="gap-4" defaultValue="virtual">
          <TabsList className="w-full">
            <TabsTrigger value="virtual">Thẻ ảo</TabsTrigger>
            <TabsTrigger value="physical" disabled>
              Thẻ vật lý
            </TabsTrigger>
          </TabsList>
          <TabsContent value="virtual">
            <div className="space-y-4">
              <div className="bg-primary relative aspect-8/5 w-full max-w-96 overflow-hidden rounded-xl perspective-distant">
                <div className="absolute top-6 left-6">
                  <SimpleIcon icon={siApple} className="fill-primary-foreground size-8" />
                </div>
                <div className="absolute top-1/2 w-full -translate-y-1/2">
                  <div className="flex items-end justify-between px-6">
                    <span className="text-accent font-mono text-lg leading-none font-medium tracking-wide uppercase">
                      DUONG MANH HUNG
                    </span>
                    <ChipSVG />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Số thẻ</span>
                  <span className="font-medium tabular-nums">•••• •••• 2143</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ngày hết hạn</span>
                  <span className="font-medium tabular-nums">06/30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CVC</span>
                  <span className="font-medium">•••</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giới hạn chi tiêu</span>
                  <span className="font-medium tabular-nums">62.000.00đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Số dư khả dụng</span>
                  <span className="font-medium tabular-nums">28.100.06đ</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" size="sm">
                  Đóng băng thẻ
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Đặt giới hạn
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Thêm
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h6 className="text-muted-foreground text-sm uppercase">Thanh toán gần đây</h6>

                <div className="space-y-4">
                  {recentPayments.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-2">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                        <SimpleIcon icon={transaction.icon} className="size-5" />
                      </div>
                      <div className="flex w-full items-end justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{transaction.subtitle}</p>
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm leading-none font-medium tabular-nums",
                              transaction.type === "debit" ? "text-destructive" : "text-green-500",
                            )}
                          >
                            {formatCurrency(transaction.amount, { noDecimals: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="sm" variant="outline">
                  Xem tất cả các khoản thanh toán
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="physical">Chi tiêu thẻ vật lý hiện không khả dụng</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
