"use client"

import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Monitor,
  Globe,
  Menu,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { authAPI, userManager } from "@/lib/auth"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Kullanıcı bilgisini localStorage'dan al
    const userData = userManager.getUser()
    setUser(userData)
  }, [])

  const handleLogout = () => {
    // Logout işlemi: token ve user bilgisini temizle
    authAPI.logout()
    // Login sayfasına yönlendir
    router.push('/login')
  }

  if (!mounted) return null

  return (
    <header className="h-16 bg-gradient-to-r from-white via-slate-50/30 to-white dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-900 border-b border-gray-200/60 dark:border-slate-700/60 px-6 flex items-center justify-between shadow-sm backdrop-blur-sm">
      {/* Sol Taraf - Arama */}
      <div className="flex items-center flex-1 max-w-xl">
        <Button variant="ghost" size="icon" className="lg:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Ara... (Ctrl+K)"
            className="pl-10 pr-4 w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
          />
        </div>
      </div>

      {/* Sağ Taraf - Aksiyonlar */}
      <div className="flex items-center space-x-2 ml-4">
        {/* Dil Seçimi */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Dil Seçimi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span className="mr-2">🇹🇷</span> Türkçe
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">🇬🇧</span> English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Siteyi Önizle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open('http://localhost:3000', '_blank')}
          title="Siteyi Önizle"
        >
          <Eye className="h-5 w-5" />
        </Button>

        {/* Tema Değiştirici */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tema Seçimi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Açık
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Koyu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 h-4 w-4" />
              Sistem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mesajlar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Mesajlar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="flex items-start space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AY</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ahmet Yılmaz</p>
                  <p className="text-xs text-gray-500">Yeni sipariş onayı bekliyor...</p>
                  <p className="text-xs text-gray-400 mt-1">5 dk önce</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>EK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Elif Kaya</p>
                  <p className="text-xs text-gray-500">Ürün stoğu azaldı</p>
                  <p className="text-xs text-gray-400 mt-1">15 dk önce</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              Tüm Mesajları Gör
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bildirimler */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">Yeni kullanıcı kaydı: <span className="font-medium">Mehmet Öz</span></p>
                </div>
                <p className="text-xs text-gray-400 mt-1">2 saat önce</p>
              </div>
              <div className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm">Sipariş tamamlandı: <span className="font-medium">#12345</span></p>
                </div>
                <p className="text-xs text-gray-400 mt-1">3 saat önce</p>
              </div>
              <div className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm">Sistem güncellemesi mevcut</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">5 saat önce</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              Tüm Bildirimleri Gör
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Kullanıcı Menüsü */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Koray Uslu" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  KU
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'Kullanıcı'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'email@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Yardım
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}