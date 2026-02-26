"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Toplam Ürün",
      value: "1,234",
      description: "+20.1% geçen aya göre",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Siparişler",
      value: "856",
      description: "+12.5% geçen aya göre",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Müşteriler",
      value: "432",
      description: "+8.3% geçen aya göre",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Gelir",
      value: "₺45,231",
      description: "+15.2% geçen aya göre",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ]

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Hoş geldiniz! İşte istatistikleriniz</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Son Siparişler</CardTitle>
              <CardDescription>Son 24 saatte alınan siparişler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1001, customer: "Müşteri 1", amount: 824.99, hours: 1 },
                  { id: 1002, customer: "Müşteri 2", amount: 456.50, hours: 2 },
                  { id: 1003, customer: "Müşteri 3", amount: 672.30, hours: 3 },
                  { id: 1004, customer: "Müşteri 4", amount: 199.90, hours: 4 },
                  { id: 1005, customer: "Müşteri 5", amount: 945.75, hours: 5 },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">Sipariş #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₺{order.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.hours} saat önce</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popüler Ürünler</CardTitle>
              <CardDescription>En çok satılan ürünler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Ürün A', category: 'Kategori 1', sales: 87 },
                  { name: 'Ürün B', category: 'Kategori 2', sales: 65 },
                  { name: 'Ürün C', category: 'Kategori 3', sales: 54 },
                  { name: 'Ürün D', category: 'Kategori 4', sales: 42 },
                  { name: 'Ürün E', category: 'Kategori 5', sales: 38 },
                ].map((product, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.sales} satış</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
