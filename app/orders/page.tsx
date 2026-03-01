"use client"

import React, { useState, useMemo, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Search,
  ChevronDown,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Upload,
  Eye,
  Save,
  CheckCheck,
  PackageCheck,
  Printer,
  ExternalLink,
  Timer,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

// Platform type
type Platform = "trendyol" | "n11" | "hepsiburada" | "bolbolbul"

// Order status - Platform agnostic internal statuses
type OrderStatus =
  | "pending"           // Beklemede / Onay Bekliyor
  | "approved"          // Onaylandı (N11, Hepsiburada)
  | "processing"        // İşleme Alındı / Hazırlanıyor
  | "ready_to_ship"     // Kargoya Hazır
  | "shipped"           // Kargoya Verildi
  | "delivered"         // Teslim Edildi
  | "completed"         // Tamamlandı
  | "cancelled"         // İptal Edildi

// Order item type
type OrderItem = {
  id: string
  productName: string
  sku: string
  quantity: number
  purchasePrice: number // Alış fiyatı
  salePrice: number     // Satış fiyatı
}

// Order type
type Order = {
  id: string
  orderNumber: string
  platform: Platform
  platformOrderId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  status: OrderStatus
  commissionRate: number | null  // Komisyon oranı (%)
  shippingCost: number           // Kargo maliyeti
  orderDate: string
  estimatedProfit?: number       // Tahmini kar
  commissionAmount?: number      // Komisyon tutarı
  invoiceUrl?: string            // Fatura URL
  trackingNumber?: string        // Kargo takip no
  notes?: string
}

// Platform logos
const platformLogos: Record<Platform, string> = {
  trendyol: "/platforms/trendyol.png",
  n11: "/platforms/n11.png",
  hepsiburada: "/platforms/hepsiburada.png",
  bolbolbul: "/platforms/bolbolbul.png",
}

// Sample orders
const SAMPLE_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2026-001",
    platform: "trendyol",
    platformOrderId: "TY-789456123",
    customerName: "Ahmet Yılmaz",
    customerPhone: "0532 XXX XX 45",
    customerAddress: "Kadıköy, İstanbul",
    items: [
      {
        id: "i1",
        productName: "Bosch GSR 12V-15 Akülü Vidalama",
        sku: "BSH-GSR-12V",
        quantity: 1,
        purchasePrice: 850,
        salePrice: 1299,
      }
    ],
    status: "pending",
    commissionRate: null,
    shippingCost: 25,
    orderDate: "2026-02-27 14:30",
  },
  {
    id: "2",
    orderNumber: "ORD-2026-002",
    platform: "hepsiburada",
    platformOrderId: "HB-456789321",
    customerName: "Ayşe Demir",
    customerPhone: "0533 XXX XX 67",
    customerAddress: "Çankaya, Ankara",
    items: [
      {
        id: "i2",
        productName: "Makita DHP484 Darbeli Matkap",
        sku: "MKT-DHP484",
        quantity: 1,
        purchasePrice: 2150,
        salePrice: 2899,
      },
      {
        id: "i3",
        productName: "Makita 18V 5.0Ah Batarya",
        sku: "MKT-BL1850B",
        quantity: 2,
        purchasePrice: 450,
        salePrice: 699,
      }
    ],
    status: "processing",
    commissionRate: 12,
    shippingCost: 35,
    orderDate: "2026-02-27 13:15",
  },
  {
    id: "3",
    orderNumber: "ORD-2026-003",
    platform: "n11",
    platformOrderId: "N11-987654321",
    customerName: "Mehmet Kaya",
    customerPhone: "0534 XXX XX 89",
    customerAddress: "Konak, İzmir",
    items: [
      {
        id: "i4",
        productName: "DeWalt DCD796 Darbeli Matkap",
        sku: "DWT-DCD796",
        quantity: 1,
        purchasePrice: 1850,
        salePrice: 2499,
      }
    ],
    status: "approved",
    commissionRate: 15,
    shippingCost: 30,
    orderDate: "2026-02-27 11:45",
  },
  {
    id: "4",
    orderNumber: "ORD-2026-004",
    platform: "bolbolbul",
    platformOrderId: "BBB-741852963",
    customerName: "Fatma Şahin",
    customerPhone: "0535 XXX XX 23",
    customerAddress: "Nilüfer, Bursa",
    items: [
      {
        id: "i5",
        productName: "Black&Decker KR504RE Darbeli Matkap",
        sku: "BD-KR504RE",
        quantity: 1,
        purchasePrice: 380,
        salePrice: 599,
      }
    ],
    status: "shipped",
    commissionRate: 10,
    shippingCost: 20,
    orderDate: "2026-02-26 16:20",
    trackingNumber: "987654321TR",
  },
  {
    id: "5",
    orderNumber: "ORD-2026-005",
    platform: "trendyol",
    platformOrderId: "TY-852963741",
    customerName: "Ali Çelik",
    customerPhone: "0536 XXX XX 56",
    customerAddress: "Bornova, İzmir",
    items: [
      {
        id: "i6",
        productName: "Hilti SF 6H-A22 Akülü Vidalama",
        sku: "HLT-SF6H",
        quantity: 1,
        purchasePrice: 3500,
        salePrice: 4799,
      }
    ],
    status: "delivered",
    commissionRate: 14,
    shippingCost: 40,
    orderDate: "2026-02-25 10:30",
    trackingNumber: "456789123TR",
    invoiceUrl: "invoice-ORD-2026-005.pdf",
  },
  {
    id: "6",
    orderNumber: "ORD-2026-006",
    platform: "hepsiburada",
    platformOrderId: "HB-159753486",
    customerName: "Zeynep Arslan",
    customerPhone: "0537 XXX XX 78",
    customerAddress: "Mezitli, Mersin",
    items: [
      {
        id: "i7",
        productName: "Stanley STHR202 Kırıcı Delici",
        sku: "STN-STHR202",
        quantity: 1,
        purchasePrice: 1200,
        salePrice: 1699,
      }
    ],
    status: "pending",
    commissionRate: 12,
    shippingCost: 25,
    orderDate: "2026-02-26 09:15", // 24+ saat önce
  },
]

// Platform specific workflow configurations
const getPlatformWorkflow = (platform: Platform) => {
  switch (platform) {
    case "trendyol":
      // Trendyol: Beklemede -> İşleme Al -> Kargoya Hazır -> Kargoya Verildi -> Teslim Edildi -> Fatura Yükle
      return {
        hasApprovalStep: false,
        requiresInvoice: true,
        steps: ["pending", "processing", "ready_to_ship", "shipped", "delivered", "completed"],
      }
    case "n11":
      // N11: Beklemede -> Onayla -> Hazırlanıyor -> Kargoya Verildi -> Teslim Edildi -> Fatura Yükle
      return {
        hasApprovalStep: true,
        requiresInvoice: true,
        steps: ["pending", "approved", "processing", "shipped", "delivered", "completed"],
      }
    case "hepsiburada":
      // Hepsiburada: Beklemede -> Onayla -> İşleme Al -> Kargoya Verildi -> Teslim Edildi -> Fatura Yükle
      return {
        hasApprovalStep: true,
        requiresInvoice: true,
        steps: ["pending", "approved", "processing", "shipped", "delivered", "completed"],
      }
    case "bolbolbul":
      // Bolbolbul: Beklemede -> İşlemde -> Kargoya Verildi -> Tamamlandı (Fatura yok)
      return {
        hasApprovalStep: false,
        requiresInvoice: false,
        steps: ["pending", "processing", "shipped", "completed"],
      }
  }
}

// Get next status for a platform
const getNextStatus = (platform: Platform, currentStatus: OrderStatus): OrderStatus | null => {
  const workflow = getPlatformWorkflow(platform)
  const currentIndex = workflow.steps.indexOf(currentStatus)
  if (currentIndex === -1 || currentIndex === workflow.steps.length - 1) return null
  return workflow.steps[currentIndex + 1] as OrderStatus
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState<string>("all")
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [detailsSheet, setDetailsSheet] = useState<{ open: boolean; order: Order | null }>({
    open: false,
    order: null
  })
  const [editingCommission, setEditingCommission] = useState<{ [key: string]: number | null }>({})
  const [editingShipping, setEditingShipping] = useState<{ [key: string]: number | null }>({})
  const [activeTab, setActiveTab] = useState<string>("all")
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; orderId: string | null }>({
    open: false,
    orderId: null,
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  // Calculate remaining time (24 hours from order date)
  const getRemainingTime = (orderDate: string) => {
    const orderTime = new Date(orderDate)
    const deadlineTime = new Date(orderTime.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    const remaining = deadlineTime.getTime() - currentTime.getTime()

    if (remaining <= 0) {
      return { hours: 0, minutes: 0, isExpired: true, percentage: 0 }
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    const percentage = (remaining / (24 * 60 * 60 * 1000)) * 100

    return { hours, minutes, isExpired: false, percentage }
  }

  // Calculate profit and commission
  const calculateOrderFinancials = (order: Order, commissionRate?: number | null) => {
    const rate = commissionRate !== undefined ? commissionRate : order.commissionRate

    // Total sale amount
    const totalSale = order.items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0)

    // Total purchase cost
    const totalPurchase = order.items.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0)

    // Commission amount
    const commissionAmount = rate ? (totalSale * rate) / 100 : 0

    // Estimated profit
    const estimatedProfit = totalSale - totalPurchase - commissionAmount - order.shippingCost

    return { totalSale, totalPurchase, commissionAmount, estimatedProfit }
  }

  // Toggle order expansion
  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  // Update commission rate
  const updateCommissionRate = (orderId: string, rate: number | null) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, commissionRate: rate }
        : order
    ))
    setEditingCommission({ ...editingCommission, [orderId]: null })
  }

  // Update shipping cost
  const updateShippingCost = (orderId: string, cost: number | null) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, shippingCost: cost || 0 }
        : order
    ))
    setEditingShipping({ ...editingShipping, [orderId]: null })
  }

  // Update order status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status }
        : order
    ))
  }

  // Cancel order
  const handleCancelOrder = () => {
    if (cancelDialog.orderId) {
      updateOrderStatus(cancelDialog.orderId, "cancelled")
      setCancelDialog({ open: false, orderId: null })
    }
  }

  // Upload invoice (placeholder)
  const handleUploadInvoice = (orderId: string) => {
    // Fatura yükleme simülasyonu
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: "completed", invoiceUrl: `invoice-${order.orderNumber}.pdf` }
        : order
    ))
  }

  // Filter orders by tab
  const getOrdersByTab = (tab: string) => {
    switch (tab) {
      case "pending":
        return orders.filter(o => o.status === "pending")
      case "approved":
        return orders.filter(o => o.status === "approved")
      case "processing":
        return orders.filter(o => o.status === "processing" || o.status === "ready_to_ship")
      case "shipped":
        return orders.filter(o => o.status === "shipped")
      case "awaiting-invoice":
        return orders.filter(o => o.status === "delivered")
      case "completed":
        return orders.filter(o => o.status === "completed")
      case "cancelled":
        return orders.filter(o => o.status === "cancelled")
      default:
        return orders
    }
  }

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = getOrdersByTab(activeTab)

    // Search filter
    if (searchTerm) {
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.platformOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Platform filter
    if (platformFilter !== "all") {
      result = result.filter(order => order.platform === platformFilter)
    }

    return result
  }, [orders, searchTerm, platformFilter, activeTab])

  // Statistics
  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    approved: orders.filter(o => o.status === "approved").length,
    processing: orders.filter(o => o.status === "processing" || o.status === "ready_to_ship").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    awaitingInvoice: orders.filter(o => o.status === "delivered").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }

  // Status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700">
            <Clock className="h-3 w-3 mr-1" />
            Beklemede
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700">
            <CheckCheck className="h-3 w-3 mr-1" />
            Onaylandı
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700">
            <Package className="h-3 w-3 mr-1" />
            Hazırlanıyor
          </Badge>
        )
      case "ready_to_ship":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700">
            <PackageCheck className="h-3 w-3 mr-1" />
            Kargoya Hazır
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700">
            <Truck className="h-3 w-3 mr-1" />
            Kargoda
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">
            <FileText className="h-3 w-3 mr-1" />
            Fatura Bekleniyor
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tamamlandı
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            İptal Edildi
          </Badge>
        )
    }
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-6 bg-gray-50/50 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sipariş Yönetimi</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tüm platformlardan gelen siparişleri yönetin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Toplam Sipariş</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.all}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-950/20 rounded-xl p-4 border border-gray-100 dark:border-gray-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Beklemede</p>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{stats.pending}</p>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-950/20 rounded-xl p-4 border border-cyan-100 dark:border-cyan-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Onaylandı</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-500">{stats.approved}</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Hazırlanıyor</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-500">{stats.processing}</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Kargoda</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-500">{stats.shipped}</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Fatura Bekliyor</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-500">{stats.awaitingInvoice}</p>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-100 dark:border-green-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tamamlandı</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-500">{stats.completed}</p>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-100 dark:border-red-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">İptal</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-500">{stats.cancelled}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="all" className="text-xs">
              Tümü ({stats.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Beklemede ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs">
              Onaylandı ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-xs">
              Hazırlanıyor ({stats.processing})
            </TabsTrigger>
            <TabsTrigger value="shipped" className="text-xs">
              Kargoda ({stats.shipped})
            </TabsTrigger>
            <TabsTrigger value="awaiting-invoice" className="text-xs">
              Fatura ({stats.awaitingInvoice})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Tamamlandı ({stats.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs">
              İptal ({stats.cancelled})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Sipariş, müşteri veya ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-[160px] bg-white text-xs h-9">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Platformlar</SelectItem>
                    <SelectItem value="trendyol">Trendyol</SelectItem>
                    <SelectItem value="n11">N11</SelectItem>
                    <SelectItem value="hepsiburada">Hepsiburada</SelectItem>
                    <SelectItem value="bolbolbul">Bolbolbul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Orders Table */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2 w-[40px]"></TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2 w-[100px]">Platform</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2">Sipariş No</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2">Müşteri</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2">Tarih</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2 text-center w-[120px]">Kalan Süre</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2 text-center">Durum</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2 text-right">Toplam</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2 text-right">Tahmini Kar</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-200 text-xs h-10 py-2 text-center w-[100px]">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const isExpanded = expandedOrders.has(order.id)
                      const financials = calculateOrderFinancials(order)

                      return (
                        <React.Fragment key={order.id}>
                          <TableRow className="border-b dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-gray-700/50 transition-colors">
                            <TableCell className="py-2 h-12">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleOrder(order.id)}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="py-2 h-12">
                              <div className="flex items-center justify-center w-20 h-10 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-1.5">
                                <Image
                                  src={platformLogos[order.platform]}
                                  alt={order.platform}
                                  width={60}
                                  height={30}
                                  className="object-contain"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-medium text-gray-900 dark:text-gray-100 py-2 h-12">
                              <div>
                                <p className="font-semibold">{order.orderNumber}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{order.platformOrderId}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-gray-900 dark:text-gray-100 py-2 h-12">
                              <div>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{order.customerPhone}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-gray-600 dark:text-gray-400 py-2 h-12">
                              {order.orderDate}
                            </TableCell>
                            <TableCell className="py-2 h-12 text-center">
                              {(() => {
                                // If order is shipped, delivered, or completed, show "Ürün Kargoda"
                                if (order.status === "shipped" || order.status === "delivered" || order.status === "completed") {
                                  return (
                                    <div className="flex items-center justify-center gap-1">
                                      <Truck className="h-3 w-3 text-green-600 dark:text-green-400" />
                                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                        Ürün Kargoda
                                      </span>
                                    </div>
                                  )
                                }

                                const timeLeft = getRemainingTime(order.orderDate)
                                if (timeLeft.isExpired) {
                                  return (
                                    <div className="flex items-center justify-center gap-1">
                                      <Timer className="h-3 w-3 text-red-600 dark:text-red-400" />
                                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                        Süre Doldu!
                                      </span>
                                    </div>
                                  )
                                }

                                const isUrgent = timeLeft.percentage < 25 // Less than 6 hours
                                const isWarning = timeLeft.percentage < 50 // Less than 12 hours

                                return (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <div className={`flex items-center gap-1 ${
                                      isUrgent
                                        ? 'text-red-600 dark:text-red-400'
                                        : isWarning
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      <Timer className="h-3 w-3" />
                                      <span className="text-xs font-semibold">
                                        {timeLeft.hours}s {timeLeft.minutes}dk
                                      </span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all ${
                                          isUrgent
                                            ? 'bg-red-500'
                                            : isWarning
                                            ? 'bg-amber-500'
                                            : 'bg-green-500'
                                        }`}
                                        style={{ width: `${timeLeft.percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                )
                              })()}
                            </TableCell>
                            <TableCell className="py-2 h-12 text-center">
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell className="text-xs text-right font-semibold text-gray-900 dark:text-gray-100 py-2 h-12">
                              {financials.totalSale.toFixed(2)} ₺
                            </TableCell>
                            <TableCell className="text-xs text-right font-bold py-2 h-12">
                              <span className={financials.estimatedProfit >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
                                {financials.estimatedProfit.toFixed(2)} ₺
                              </span>
                            </TableCell>
                            <TableCell className="py-2 h-12 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                onClick={() => setDetailsSheet({ open: true, order })}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Expanded order details */}
                          {isExpanded && (
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                              <TableCell colSpan={9} className="p-4">
                                <div className="space-y-4">
                                  {/* Order Items */}
                                  <div>
                                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Ürünler</h4>
                                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                      <Table>
                                        <TableHeader>
                                          <TableRow className="bg-gray-50 dark:bg-gray-800">
                                            <TableHead className="text-xs h-8 py-1">Ürün Adı</TableHead>
                                            <TableHead className="text-xs h-8 py-1">SKU</TableHead>
                                            <TableHead className="text-xs h-8 py-1 text-center">Adet</TableHead>
                                            <TableHead className="text-xs h-8 py-1 text-right">Alış</TableHead>
                                            <TableHead className="text-xs h-8 py-1 text-right">Satış</TableHead>
                                            <TableHead className="text-xs h-8 py-1 text-right">Toplam</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                              <TableCell className="text-xs py-2">{item.productName}</TableCell>
                                              <TableCell className="text-xs py-2 font-mono text-gray-600 dark:text-gray-400">{item.sku}</TableCell>
                                              <TableCell className="text-xs py-2 text-center">{item.quantity}</TableCell>
                                              <TableCell className="text-xs py-2 text-right">{item.purchasePrice.toFixed(2)} ₺</TableCell>
                                              <TableCell className="text-xs py-2 text-right font-medium">{item.salePrice.toFixed(2)} ₺</TableCell>
                                              <TableCell className="text-xs py-2 text-right font-semibold">{(item.salePrice * item.quantity).toFixed(2)} ₺</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>

                                  {/* Financials */}
                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                      <Label className="text-xs text-gray-500">Toplam Alış</Label>
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                        {financials.totalPurchase.toFixed(2)} ₺
                                      </p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                      <Label className="text-xs text-gray-500 mb-1 block">Kargo Maliyeti (₺)</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          value={editingShipping[order.id] !== undefined ? editingShipping[order.id] || "" : order.shippingCost || ""}
                                          onChange={(e) => setEditingShipping({
                                            ...editingShipping,
                                            [order.id]: e.target.value ? parseFloat(e.target.value) : null
                                          })}
                                          className="h-7 text-xs"
                                        />
                                        {editingShipping[order.id] !== undefined && (
                                          <Button
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => updateShippingCost(order.id, editingShipping[order.id])}
                                          >
                                            <Save className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                      <Label className="text-xs text-gray-500 mb-1 block">Komisyon Oranı (%)</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          value={editingCommission[order.id] !== undefined ? editingCommission[order.id] || "" : order.commissionRate || ""}
                                          onChange={(e) => setEditingCommission({
                                            ...editingCommission,
                                            [order.id]: e.target.value ? parseFloat(e.target.value) : null
                                          })}
                                          className="h-7 text-xs"
                                        />
                                        {editingCommission[order.id] !== undefined && (
                                          <Button
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => updateCommissionRate(order.id, editingCommission[order.id])}
                                          >
                                            <Save className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                                      <Label className="text-xs text-gray-500">Komisyon Tutarı</Label>
                                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-1">
                                        {financials.commissionAmount.toFixed(2)} ₺
                                      </p>
                                    </div>

                                    <div className={`rounded-lg p-3 border ${
                                      financials.estimatedProfit >= 0
                                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                        : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                    }`}>
                                      <Label className="text-xs text-gray-500">Tahmini Kar</Label>
                                      <p className={`text-sm font-bold mt-1 ${
                                        financials.estimatedProfit >= 0
                                          ? "text-green-700 dark:text-green-400"
                                          : "text-red-700 dark:text-red-400"
                                      }`}>
                                        {financials.estimatedProfit.toFixed(2)} ₺
                                      </p>
                                    </div>
                                  </div>

                                  {/* Actions - Platform specific */}
                                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                                    {/* Show shipping label button - Before shipping (ready to ship) and after */}
                                    {(order.status === "ready_to_ship" || order.status === "processing" || order.status === "approved" || order.status === "shipped" || order.status === "delivered" || order.status === "completed") && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-8 border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20"
                                        onClick={() => {
                                          // Platformlara göre kargo fişi URL'leri
                                          const shippingLabelUrls = {
                                            trendyol: `https://merchantpanel.trendyol.com/orders/${order.platformOrderId}/shipping-label`,
                                            n11: `https://satici.n11.com/siparis-detay?orderId=${order.platformOrderId}`,
                                            hepsiburada: `https://merchant.hepsiburada.com/orders/${order.platformOrderId}/shipping-label`,
                                            bolbolbul: `#`, // Bolbolbul için
                                          }
                                          window.open(shippingLabelUrls[order.platform], '_blank')
                                        }}
                                      >
                                        <Printer className="h-3 w-3 mr-1.5" />
                                        Kargo Fişini Yazdır
                                      </Button>
                                    )}

                                    {/* Track shipment button - only after shipped */}
                                    {(order.status === "shipped" || order.status === "delivered" || order.status === "completed") && order.trackingNumber && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-8"
                                        onClick={() => window.open(`https://gonderitakip.ptt.gov.tr/Track/Verify?q=${order.trackingNumber}`, '_blank')}
                                      >
                                        <ExternalLink className="h-3 w-3 mr-1.5" />
                                        Kargo Takip
                                      </Button>
                                    )}

                                    {(() => {
                                      const nextStatus = getNextStatus(order.platform, order.status)
                                      const workflow = getPlatformWorkflow(order.platform)

                                      if (!nextStatus) return null

                                      // Render appropriate button based on next status
                                      switch (nextStatus) {
                                        case "approved":
                                          return (
                                            <Button
                                              size="sm"
                                              className="text-xs h-8"
                                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                                            >
                                              <CheckCheck className="h-3 w-3 mr-1.5" />
                                              Onayla
                                            </Button>
                                          )
                                        case "processing":
                                          return (
                                            <Button
                                              size="sm"
                                              className="text-xs h-8"
                                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                                            >
                                              <Package className="h-3 w-3 mr-1.5" />
                                              {order.platform === "trendyol" ? "İşleme Al" : "Hazırlamaya Başla"}
                                            </Button>
                                          )
                                        case "ready_to_ship":
                                          return (
                                            <Button
                                              size="sm"
                                              className="text-xs h-8"
                                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                                            >
                                              <PackageCheck className="h-3 w-3 mr-1.5" />
                                              Kargoya Hazır
                                            </Button>
                                          )
                                        case "shipped":
                                          return (
                                            <Button
                                              size="sm"
                                              className="text-xs h-8"
                                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                                            >
                                              <Truck className="h-3 w-3 mr-1.5" />
                                              Kargoya Ver
                                            </Button>
                                          )
                                        case "delivered":
                                          return (
                                            <Button
                                              size="sm"
                                              className="text-xs h-8"
                                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                                            >
                                              <CheckCircle className="h-3 w-3 mr-1.5" />
                                              Teslim Edildi
                                            </Button>
                                          )
                                        case "completed":
                                          // For platforms requiring invoice
                                          if (workflow.requiresInvoice && order.status === "delivered") {
                                            return (
                                              <Button
                                                size="sm"
                                                className="text-xs h-8"
                                                onClick={() => handleUploadInvoice(order.id)}
                                              >
                                                <Upload className="h-3 w-3 mr-1.5" />
                                                Fatura Yükle
                                              </Button>
                                            )
                                          }
                                          // For platforms not requiring invoice (like Bolbolbul)
                                          return (
                                            <Button
                                              size="sm"
                                              className="text-xs h-8 bg-green-600 hover:bg-green-700"
                                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                                            >
                                              <CheckCircle className="h-3 w-3 mr-1.5" />
                                              Tamamla
                                            </Button>
                                          )
                                        default:
                                          return null
                                      }
                                    })()}

                                    {/* Cancel button for non-completed orders */}
                                    {order.status !== "cancelled" && order.status !== "completed" && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="text-xs h-8 ml-auto"
                                        onClick={() => setCancelDialog({ open: true, orderId: order.id })}
                                      >
                                        <XCircle className="h-3 w-3 mr-1.5" />
                                        İptal Et
                                      </Button>
                                    )}

                                    {/* Return/Cancel button for completed orders */}
                                    {order.status === "completed" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-8 ml-auto border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                        onClick={() => setCancelDialog({ open: true, orderId: order.id })}
                                      >
                                        <XCircle className="h-3 w-3 mr-1.5" />
                                        İade - İptal
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cancel/Return Dialog */}
        <Dialog open={cancelDialog.open} onOpenChange={(open) => setCancelDialog({ open, orderId: null })}>
          <DialogContent className="sm:max-w-md">
            {(() => {
              const order = orders.find(o => o.id === cancelDialog.orderId)
              const isReturn = order?.status === "completed"

              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="h-5 w-5" />
                      {isReturn ? "Sipariş İadesi - İptal" : "Siparişi İptal Et"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                      {isReturn
                        ? "Bu siparişi iade/iptal etmek istediğinizden emin misiniz?"
                        : "Bu siparişi iptal etmek istediğinizden emin misiniz?"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                          Uyarı
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          {isReturn
                            ? "İade/İptal edilen siparişler geri alınamaz. Müşteri ile iletişime geçmeyi ve platform tarafında gerekli işlemleri yapmayı unutmayın."
                            : "İptal edilen siparişler geri alınamaz. Platform tarafında da gerekli işlemleri yapmayı unutmayın."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setCancelDialog({ open: false, orderId: null })}
                      className="text-xs"
                    >
                      Vazgeç
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelOrder}
                      className="text-xs"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-2" />
                      {isReturn ? "İade/İptal Et" : "Siparişi İptal Et"}
                    </Button>
                  </DialogFooter>
                </>
              )
            })()}
          </DialogContent>
        </Dialog>

        {/* Details Sheet */}
        <Sheet open={detailsSheet.open} onOpenChange={(open) => setDetailsSheet({ open, log: null })}>
          <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Sipariş Detayları</SheetTitle>
            </SheetHeader>
            {detailsSheet.order && (
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Sipariş No</Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {detailsSheet.order.orderNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Platform</Label>
                    <div className="w-24 h-12 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center">
                      <Image
                        src={platformLogos[detailsSheet.order.platform]}
                        alt={detailsSheet.order.platform}
                        width={80}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Müşteri</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {detailsSheet.order.customerName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Telefon</Label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {detailsSheet.order.customerPhone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">Adres</Label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {detailsSheet.order.customerAddress}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Sipariş Ürünleri</h4>
                  <div className="space-y-2">
                    {detailsSheet.order.items.map((item) => (
                      <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                            <p className="text-gray-500 dark:text-gray-400 font-mono mt-1">{item.sku}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {item.quantity} Adet
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="text-gray-500">Alış</p>
                            <p className="font-medium">{item.purchasePrice} ₺</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Satış</p>
                            <p className="font-medium">{item.salePrice} ₺</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Toplam</p>
                            <p className="font-semibold">{(item.salePrice * item.quantity).toFixed(2)} ₺</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {detailsSheet.order.trackingNumber && (
                  <div>
                    <Label className="text-xs text-gray-500">Kargo Takip No</Label>
                    <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
                      {detailsSheet.order.trackingNumber}
                    </p>
                  </div>
                )}

                {detailsSheet.order.invoiceUrl && (
                  <div>
                    <Label className="text-xs text-gray-500">Fatura</Label>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 underline cursor-pointer">
                      {detailsSheet.order.invoiceUrl}
                    </p>
                  </div>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </MainLayout>
  )
}
