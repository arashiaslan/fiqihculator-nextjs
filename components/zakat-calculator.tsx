"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Info } from "lucide-react"

export default function ZakatCalculator() {
  const [zakatType, setZakatType] = useState("maal")
  const [amount, setAmount] = useState("")
  const [goldPrice, setGoldPrice] = useState("1000000") // Harga per gram emas (contoh)
  const [irrigationType, setIrrigationType] = useState("natural")
  const [result, setResult] = useState<number | null>(null)
  const [nisab, setNisab] = useState<number | null>(null)
  const [isEligible, setIsEligible] = useState<boolean | null>(null)

  const calculateZakat = () => {
    const amountValue = Number.parseFloat(amount)
    const goldPriceValue = Number.parseFloat(goldPrice)

    if (isNaN(amountValue)) return

    // Nisab adalah 85 gram emas
    const nisabValue = 85 * goldPriceValue
    setNisab(nisabValue)

    let zakatAmount = 0
    let eligible = amountValue >= nisabValue

    if (eligible) {
      switch (zakatType) {
        case "maal":
        case "income":
        case "gold":
        case "trade":
          zakatAmount = amountValue * 0.025 // 2.5%
          break
        case "agriculture":
          zakatAmount = amountValue * (irrigationType === "natural" ? 0.1 : 0.05) // 10% atau 5%
          break
        case "fitrah":
          // Untuk zakat fitrah, amount adalah jumlah anggota keluarga
          // dan 2.5kg adalah berat beras per orang
          zakatAmount = amountValue * 2.5 * 15000 // Asumsi harga beras Rp15.000/kg
          eligible = true // Zakat fitrah wajib tanpa nisab
          break
      }
    }

    setResult(zakatAmount)
    setIsEligible(eligible)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Kalkulator Zakat
        </CardTitle>
        <CardDescription>Hitung kewajiban zakat Anda sesuai dengan syariat Islam</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={zakatType} onValueChange={setZakatType} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="maal">Maal</TabsTrigger>
            <TabsTrigger value="income">Penghasilan</TabsTrigger>
            <TabsTrigger value="gold">Emas & Perak</TabsTrigger>
            <TabsTrigger value="trade">Perdagangan</TabsTrigger>
            <TabsTrigger value="agriculture">Pertanian</TabsTrigger>
            <TabsTrigger value="fitrah">Fitrah</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="goldPrice">Harga Emas per Gram (Rp)</Label>
              <Input
                id="goldPrice"
                type="number"
                value={goldPrice}
                onChange={(e) => setGoldPrice(e.target.value)}
                placeholder="Masukkan harga emas per gram"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">
                {zakatType === "fitrah"
                  ? "Jumlah Anggota Keluarga"
                  : zakatType === "agriculture"
                    ? "Nilai Hasil Panen (Rp)"
                    : "Jumlah Harta (Rp)"}
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={zakatType === "fitrah" ? "Masukkan jumlah anggota keluarga" : "Masukkan jumlah harta"}
              />
            </div>

            {zakatType === "agriculture" && (
              <div className="grid gap-2">
                <Label htmlFor="irrigationType">Jenis Pengairan</Label>
                <Select value={irrigationType} onValueChange={setIrrigationType}>
                  <SelectTrigger id="irrigationType">
                    <SelectValue placeholder="Pilih jenis pengairan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Alami (10%)</SelectItem>
                    <SelectItem value="artificial">Buatan (5%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={calculateZakat}
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            >
              Hitung Zakat
            </Button>

            {result !== null && (
              <div className="mt-6 p-4 rounded-lg border bg-muted">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-medium">Hasil Perhitungan:</p>
                    {nisab && (
                      <p className="text-sm text-muted-foreground">Nisab: Rp {nisab.toLocaleString("id-ID")}</p>
                    )}
                    {isEligible !== null && (
                      <p className="text-sm text-muted-foreground">
                        Status: {isEligible ? "Wajib membayar zakat" : "Belum mencapai nisab"}
                      </p>
                    )}
                    <p className="text-xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
                      Rp {result.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
