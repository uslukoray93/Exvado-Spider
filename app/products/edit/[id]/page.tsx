"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  Calendar
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [product, setProduct] = useState({
    id: id,
    name: "Ergonomik Ofis Sandalyesi Ayarlanabilir Kol Dayama ve Bel Desteği ile Premium Kalite",
    supplier: "Barbaros",
    sku: "EOS-005",
    barcode: "8690123456793",
    desi: "11",
    kdv: "20",
    isActive: true,
    category: ["Mobilya", "Ofis", "Sandalyeler"],
    supplierCost: 20000,
    cashDiscountCost: 19500,
    shippingCost: 23750,
    salesPrice: 24250,
    specialDiscount: {
      enabled: false,
      percentage: 0,
      startDate: "",
      endDate: ""
    },
    bbbSalesPrice: 24250,
    previousCampaigns: [
      { date: "2024-12-15", discount: "15%", price: 20612 },
      { date: "2024-11-28", discount: "10%", price: 21825 }
    ],
    technicalSpecs: [
      { key: "Güç", value: "2 Hp (1.5 kW)" },
      { key: "Kademe Sayısı", value: "6" },
      { key: "Giriş - Çıkış Çapı", value: "11/4\"-1\"" },
      { key: "Debi", value: "11 metrede 7 m3 / 23 metrede 6 m3 / 37 metrede 5 m3 / 55 metrede 3,6 m3 / 59 metrede 2,4 m3 / 60 metrede 1,2 m3 Su Verir / 65 metrede Su Vermez" },
      { key: "Voltaj", value: "380 V" },
      { key: "Ürün Bilgisi", value: "Dik Milli Kademeli Pompa" }
    ],
    metaTitle: "Ergonomik Ofis Sandalyesi - Premium Kalite",
    metaDescription: "Ayarlanabilir kol dayama ve bel desteği ile maksimum konfor sağlayan ergonomik ofis sandalyesi.",
    description: "Premium kalitede ergonomik ofis sandalyesi. Ayarlanabilir kol dayama, bel desteği ve yükseklik ayarı ile maksimum konfor sağlar.",
    images: [
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop"
    ]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated product:", product)
    router.push("/products")
  }

  const removeTechnicalSpec = (index: number) => {
    setProduct({
      ...product,
      technicalSpecs: product.technicalSpecs.filter((_, i) => i !== index)
    })
  }

  const removeImage = (index: number) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index)
    })
  }

  const generateWithAI = (field: string, wordCount?: number) => {
    console.log(`Generating ${field} with AI${wordCount ? ` (${wordCount} words)` : ''}`)
  }

  const cardClass = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
  const headerClass = "px-6 py-4 border-b border-gray-200 dark:border-gray-700"
  const inputClass = "h-10 rounded-md border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block"

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Clean Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/products">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Ürün Düzenle
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    #{id} • {product.sku}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/products">
                  <Button variant="outline" size="sm">
                    İptal
                  </Button>
                </Link>
                <Button onClick={handleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
            {/* Temel Bilgiler */}
            <Card className={cardClass}>
              <CardHeader className={headerClass}>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Temel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="name" className={labelClass}>Ürün Adı *</Label>
                  <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    placeholder="Ürün adını girin"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="supplier" className={labelClass}>Tedarikçi *</Label>
                    <Select value={product.supplier} onValueChange={(value) => setProduct({ ...product, supplier: value })}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ital">İtal</SelectItem>
                        <SelectItem value="Mapaş">Mapaş</SelectItem>
                        <SelectItem value="Barbaros">Barbaros Motor</SelectItem>
                        <SelectItem value="ABM">ABM Hırdavat</SelectItem>
                        <SelectItem value="DövizSheet">DövizSheet</SelectItem>
                        <SelectItem value="AkınZiraat">Akın Ziraat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 w-full">
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={(checked) => setProduct({ ...product, isActive: checked })}
                        id="isActive"
                      />
                      <Label htmlFor="isActive" className="cursor-pointer mb-0">
                        {product.isActive ? (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">Envanter Aktif</Badge>
                        ) : (
                          <Badge variant="secondary">Envanter Pasif</Badge>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="sku" className={labelClass}>Stok Kodu *</Label>
                    <Input
                      id="sku"
                      value={product.sku}
                      onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                      placeholder="SKU"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="desi" className={labelClass}>Desi</Label>
                    <Select value={product.desi} onValueChange={(value) => setProduct({ ...product, desi: value })}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="kdv" className={labelClass}>KDV %</Label>
                    <Select value={product.kdv} onValueChange={(value) => setProduct({ ...product, kdv: value })}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">%1</SelectItem>
                        <SelectItem value="10">%10</SelectItem>
                        <SelectItem value="20">%20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="barcode" className={labelClass}>Barkod Kodu</Label>
                  <Input
                    id="barcode"
                    value={product.barcode}
                    onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
                    placeholder="8690123456789"
                    className={inputClass}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Kategori */}
            <Card className={cardClass}>
              <CardHeader className={headerClass}>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Kategori
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {product.category.map((cat, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                      >
                        {cat}
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fiyatlandırma */}
            <Card className={cardClass}>
              <CardHeader className={headerClass}>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Fiyatlandırma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <Label htmlFor="supplierCost" className={labelClass}>Tedarikçi Maliyet</Label>
                    <Input
                      id="supplierCost"
                      type="number"
                      value={product.supplierCost}
                      onChange={(e) => setProduct({ ...product, supplierCost: parseInt(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashDiscountCost" className={labelClass}>Nakit İskontolu Maliyet</Label>
                    <Input
                      id="cashDiscountCost"
                      type="number"
                      value={product.cashDiscountCost}
                      onChange={(e) => setProduct({ ...product, cashDiscountCost: parseInt(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingCost" className={labelClass}>Kargo + Nakit İskontolu</Label>
                    <Input
                      id="shippingCost"
                      type="number"
                      value={product.shippingCost}
                      onChange={(e) => setProduct({ ...product, shippingCost: parseInt(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="salesPrice" className={labelClass}>Satış Fiyatı</Label>
                    <Input
                      id="salesPrice"
                      type="number"
                      value={product.salesPrice}
                      onChange={(e) => setProduct({ ...product, salesPrice: parseInt(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bbbSalesPrice" className={labelClass}>BBB Satış Fiyatı</Label>
                    <Input
                      id="bbbSalesPrice"
                      type="number"
                      value={product.bbbSalesPrice}
                      onChange={(e) => setProduct({ ...product, bbbSalesPrice: parseInt(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Özel Kampanya */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Özel Kampanya İndirimi</Label>
                    <Switch
                      checked={product.specialDiscount.enabled}
                      onCheckedChange={(checked) => setProduct({
                        ...product,
                        specialDiscount: { ...product.specialDiscount, enabled: checked }
                      })}
                    />
                  </div>
                  {product.specialDiscount.enabled && (
                    <div className="grid grid-cols-3 gap-5 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                      <div>
                        <Label htmlFor="discountPercentage" className="text-sm">İndirim %</Label>
                        <Input
                          id="discountPercentage"
                          type="number"
                          value={product.specialDiscount.percentage}
                          onChange={(e) => setProduct({
                            ...product,
                            specialDiscount: { ...product.specialDiscount, percentage: parseInt(e.target.value) }
                          })}
                          placeholder="0"
                          className="mt-1.5 h-10 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="startDate" className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Başlangıç
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={product.specialDiscount.startDate}
                          onChange={(e) => setProduct({
                            ...product,
                            specialDiscount: { ...product.specialDiscount, startDate: e.target.value }
                          })}
                          className="mt-1.5 h-10 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate" className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Bitiş
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={product.specialDiscount.endDate}
                          onChange={(e) => setProduct({
                            ...product,
                            specialDiscount: { ...product.specialDiscount, endDate: e.target.value }
                          })}
                          className="mt-1.5 h-10 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Kar Göstergesi */}
                {product.bbbSalesPrice && product.shippingCost && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tahmini Kar:</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₺{(product.bbbSalesPrice - product.shippingCost).toLocaleString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          %{(((product.bbbSalesPrice - product.shippingCost) / product.shippingCost) * 100).toFixed(1)} kar marjı
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Geçmiş Kampanyalar */}
            <Card className={cardClass}>
              <CardHeader className={headerClass}>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Son Uygulanan Kampanyalar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {product.previousCampaigns.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{campaign.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500">{campaign.discount}</Badge>
                        <span className="text-sm font-semibold">₺{campaign.price.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teknik Özellikler */}
            <Card className={cardClass}>
              <CardHeader className={headerClass}>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Teknik Özellikler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* Sol Panel */}
                  <div className="space-y-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-800/30 dark:to-gray-700/30 p-6 rounded-2xl border border-blue-100 dark:border-gray-700">
                    <div>
                      <Label className={labelClass}>Özellik Grubu Seçin</Label>
                      <Select defaultValue="">
                        <SelectTrigger className={inputClass}>
                          <SelectValue placeholder="Özellik Grubu Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="motor">Motor Özellikleri</SelectItem>
                          <SelectItem value="elektrik">Elektrik Özellikleri</SelectItem>
                          <SelectItem value="mekanik">Mekanik Özellikler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Grup Oluştur
                    </Button>

                    <div>
                      <Select defaultValue="">
                        <SelectTrigger className={inputClass}>
                          <SelectValue placeholder="Özellik Grubu Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guc">Güç</SelectItem>
                          <SelectItem value="kademe">Kademe Sayısı</SelectItem>
                          <SelectItem value="cap">Giriş - Çıkış Çapı</SelectItem>
                          <SelectItem value="debi">Debi</SelectItem>
                          <SelectItem value="voltaj">Voltaj</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Özellik Oluştur
                    </Button>

                    <Button
                      type="button"
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
                    >
                      Ekle
                    </Button>
                  </div>

                  {/* Sağ Panel */}
                  <div>
                    <Label className={labelClass}>Seçilen</Label>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900/50">
                      {product.technicalSpecs.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 py-3.5 px-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 group transition-all"
                        >
                          <div className="font-semibold text-sm min-w-[150px] text-gray-900 dark:text-white">
                            {spec.key}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                            {spec.value}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTechnicalSpec(index)}
                            className="h-8 w-8 flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO & İçerik */}
            <Card className={cardClass}>
              <CardHeader className={headerClass}>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  SEO ve İçerik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="metaTitle" className={labelClass}>Meta Title</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => generateWithAI('metaTitle')}
                      className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg"
                    >
                      <Sparkles className="h-4 w-4" />
                      AI ile Oluştur
                    </Button>
                  </div>
                  <Input
                    id="metaTitle"
                    value={product.metaTitle}
                    onChange={(e) => setProduct({ ...product, metaTitle: e.target.value })}
                    placeholder="SEO başlığı"
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="metaDescription" className={labelClass}>Meta Description</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => generateWithAI('metaDescription')}
                      className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg"
                    >
                      <Sparkles className="h-4 w-4" />
                      AI ile Oluştur
                    </Button>
                  </div>
                  <Textarea
                    id="metaDescription"
                    value={product.metaDescription}
                    onChange={(e) => setProduct({ ...product, metaDescription: e.target.value })}
                    placeholder="SEO açıklaması"
                    rows={3}
                    className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description" className={labelClass}>Ürün Açıklaması</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => generateWithAI('description', 150)}
                        className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg text-xs"
                      >
                        <Sparkles className="h-3 w-3" />
                        150
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => generateWithAI('description', 300)}
                        className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg text-xs"
                      >
                        <Sparkles className="h-3 w-3" />
                        300
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => generateWithAI('description', 400)}
                        className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg text-xs"
                      >
                        <Sparkles className="h-3 w-3" />
                        400
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    placeholder="Ürün detaylı açıklaması..."
                    rows={6}
                    className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ürün Görselleri */}
            <Card className={cardClass}>
              <CardHeader className={headerClass}>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Ürün Görselleri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-44 object-cover rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-md group-hover:shadow-xl transition-all"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={index === 0 ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg" : "bg-gray-800/80 backdrop-blur-sm"}
                        >
                          {index === 0 ? "Ana" : index + 1}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="rounded-lg shadow-lg"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Yeni Görsel Ekle */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center flex flex-col items-center justify-center h-44 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">Görsel Ekle</p>
                    <Button type="button" variant="outline" size="sm" className="rounded-lg">
                      <Upload className="h-3 w-3 mr-2" />
                      Seç
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
