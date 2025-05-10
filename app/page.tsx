import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ZakatCalculator from "@/components/zakat-calculator"
import InheritanceCalculator from "@/components/inheritance-calculator"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">SinaFiq</div>
              <span className="text-sm text-muted-foreground">Kalkulator Zakat & Warisan Islam</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400">
                Beranda
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400">
                Tentang
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400">
                Edukasi
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400">
                Kontak
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <main className="container py-8">
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Selamat Datang di SinaFiq</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Kalkulator zakat dan warisan Islam yang mudah digunakan untuk membantu Anda menghitung kewajiban finansial
              sesuai syariat.
            </p>
          </section>

          <Tabs defaultValue="zakat" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="zakat">Kalkulator Zakat</TabsTrigger>
              <TabsTrigger value="warisan">Kalkulator Warisan</TabsTrigger>
            </TabsList>
            <TabsContent value="zakat">
              <ZakatCalculator />
            </TabsContent>
            <TabsContent value="warisan">
              <InheritanceCalculator />
            </TabsContent>
          </Tabs>
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SinaFiq. Hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
