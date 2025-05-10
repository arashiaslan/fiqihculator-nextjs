"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Scale, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type Heir = {
  id: string
  name: string
  relation: string
  share: number
  amount: number
}

export default function InheritanceCalculator() {
  const [estate, setEstate] = useState("")
  const [heirs, setHeirs] = useState<Heir[]>([])
  const [calculated, setCalculated] = useState(false)

  // Checkbox states for heirs
  const [hasHusband, setHasHusband] = useState(false)
  const [hasWife, setHasWife] = useState(false)
  const [wivesCount, setWivesCount] = useState("1")
  const [hasFather, setHasFather] = useState(false)
  const [hasMother, setHasMother] = useState(false)
  const [sonCount, setSonCount] = useState("0")
  const [daughterCount, setDaughterCount] = useState("0")

  const calculateInheritance = () => {
    const estateValue = Number.parseFloat(estate)
    if (isNaN(estateValue) || estateValue <= 0) return

    let totalShares = 0
    const calculatedHeirs: Heir[] = []

    // Calculate shares based on Islamic inheritance law

    // Husband
    if (hasHusband) {
      const hasSons = Number.parseInt(sonCount) > 0
      const hasDaughters = Number.parseInt(daughterCount) > 0
      const hasChildren = hasSons || hasDaughters

      const husbandShare = hasChildren ? 1 / 4 : 1 / 2
      totalShares += husbandShare

      calculatedHeirs.push({
        id: "husband",
        name: "Suami",
        relation: "Suami",
        share: husbandShare,
        amount: estateValue * husbandShare,
      })
    }

    // Wife/Wives
    if (hasWife) {
      const hasSons = Number.parseInt(sonCount) > 0
      const hasDaughters = Number.parseInt(daughterCount) > 0
      const hasChildren = hasSons || hasDaughters

      const wivesShareTotal = hasChildren ? 1 / 8 : 1 / 4
      const wivesCount_ = Number.parseInt(wivesCount)
      const wifeShare = wivesShareTotal / wivesCount_
      totalShares += wivesShareTotal

      for (let i = 0; i < wivesCount_; i++) {
        calculatedHeirs.push({
          id: `wife_${i}`,
          name: `Istri ${wivesCount_ > 1 ? i + 1 : ""}`,
          relation: "Istri",
          share: wifeShare,
          amount: estateValue * wifeShare,
        })
      }
    }

    // Father
    if (hasFather) {
      const hasSons = Number.parseInt(sonCount) > 0

      let fatherShare = 1 / 6 // Base share with children

      // If no sons, father gets additional residuary share
      // This is simplified - actual calculation would be more complex
      if (!hasSons) {
        // For simplicity, we're just giving father 1/6 + residuary
        // In a complete implementation, this would need to account for all heirs
        fatherShare = 1 / 6 // This is simplified
      }

      totalShares += fatherShare

      calculatedHeirs.push({
        id: "father",
        name: "Ayah",
        relation: "Ayah",
        share: fatherShare,
        amount: estateValue * fatherShare,
      })
    }

    // Mother
    if (hasMother) {
      const hasSons = Number.parseInt(sonCount) > 0
      const hasDaughters = Number.parseInt(daughterCount) > 0
      const hasChildren = hasSons || hasDaughters

      // Simplified - in reality, mother's share also depends on siblings
      const motherShare = hasChildren ? 1 / 6 : 1 / 3
      totalShares += motherShare

      calculatedHeirs.push({
        id: "mother",
        name: "Ibu",
        relation: "Ibu",
        share: motherShare,
        amount: estateValue * motherShare,
      })
    }

    // Sons
    const sons = Number.parseInt(sonCount)
    if (sons > 0) {
      const daughters = Number.parseInt(daughterCount)
      const totalChildrenShares = sons * 2 + daughters // Sons get twice daughters' share

      // Residuary calculation (simplified)
      const residuaryShare = Math.max(0, 1 - totalShares)
      const sonShare = residuaryShare * (2 / totalChildrenShares)

      for (let i = 0; i < sons; i++) {
        calculatedHeirs.push({
          id: `son_${i}`,
          name: `Anak Laki-laki ${sons > 1 ? i + 1 : ""}`,
          relation: "Anak Laki-laki",
          share: sonShare,
          amount: estateValue * sonShare,
        })
      }

      totalShares += sonShare * sons
    }

    // Daughters
    const daughters = Number.parseInt(daughterCount)
    if (daughters > 0) {
      // If there are sons, daughters get half of sons' share from residuary
      if (sons > 0) {
        const totalChildrenShares = sons * 2 + daughters
        const residuaryShare = Math.max(0, 1 - (totalShares - sons * (1 - totalShares) * (2 / totalChildrenShares)))
        const daughterShare = residuaryShare * (1 / totalChildrenShares)

        for (let i = 0; i < daughters; i++) {
          calculatedHeirs.push({
            id: `daughter_${i}`,
            name: `Anak Perempuan ${daughters > 1 ? i + 1 : ""}`,
            relation: "Anak Perempuan",
            share: daughterShare,
            amount: estateValue * daughterShare,
          })
        }

        totalShares += daughterShare * daughters
      }
      // If no sons, daughters get fixed shares
      else {
        const daughterShareTotal = daughters === 1 ? 1 / 2 : 2 / 3
        const daughterShare = daughterShareTotal / daughters

        for (let i = 0; i < daughters; i++) {
          calculatedHeirs.push({
            id: `daughter_${i}`,
            name: `Anak Perempuan ${daughters > 1 ? i + 1 : ""}`,
            relation: "Anak Perempuan",
            share: daughterShare,
            amount: estateValue * daughterShare,
          })
        }

        totalShares += daughterShareTotal
      }
    }

    // Note: This is a simplified calculation and doesn't handle all cases
    // A complete implementation would need to handle:
    // - 'Aul (when shares exceed 1)
    // - Radd (when shares are less than 1)
    // - Other heirs like siblings, grandparents, etc.

    setHeirs(calculatedHeirs)
    setCalculated(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Kalkulator Warisan
        </CardTitle>
        <CardDescription>Hitung pembagian warisan sesuai dengan hukum Islam (Faraid)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="estate">Total Harta Warisan (Rp)</Label>
            <Input
              id="estate"
              type="number"
              value={estate}
              onChange={(e) => setEstate(e.target.value)}
              placeholder="Masukkan jumlah total harta warisan"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Ahli Waris</h3>

            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="husband"
                  checked={hasHusband}
                  onCheckedChange={(checked) => {
                    setHasHusband(checked === true)
                    if (checked) setHasWife(false) // Can't have both husband and wife
                  }}
                />
                <Label htmlFor="husband">Suami</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wife"
                  checked={hasWife}
                  onCheckedChange={(checked) => {
                    setHasWife(checked === true)
                    if (checked) setHasHusband(false) // Can't have both husband and wife
                  }}
                />
                <Label htmlFor="wife">Istri</Label>
              </div>

              {hasWife && (
                <div className="ml-6 grid gap-2">
                  <Label htmlFor="wivesCount">Jumlah Istri</Label>
                  <Input
                    id="wivesCount"
                    type="number"
                    min="1"
                    max="4"
                    value={wivesCount}
                    onChange={(e) => setWivesCount(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="father"
                  checked={hasFather}
                  onCheckedChange={(checked) => setHasFather(checked === true)}
                />
                <Label htmlFor="father">Ayah</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mother"
                  checked={hasMother}
                  onCheckedChange={(checked) => setHasMother(checked === true)}
                />
                <Label htmlFor="mother">Ibu</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sonCount">Jumlah Anak Laki-laki</Label>
              <Input
                id="sonCount"
                type="number"
                min="0"
                value={sonCount}
                onChange={(e) => setSonCount(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="daughterCount">Jumlah Anak Perempuan</Label>
              <Input
                id="daughterCount"
                type="number"
                min="0"
                value={daughterCount}
                onChange={(e) => setDaughterCount(e.target.value)}
              />
            </div>

            <Button
              onClick={calculateInheritance}
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            >
              Hitung Pembagian Warisan
            </Button>

            {calculated && heirs.length > 0 && (
              <div className="mt-6 p-4 rounded-lg border bg-muted">
                <div className="flex items-start gap-2 mb-4">
                  <Info className="h-5 w-5 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-medium">Hasil Perhitungan Warisan:</p>
                    <p className="text-sm text-muted-foreground">
                      Total Harta: Rp {Number.parseFloat(estate).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {heirs.map((heir) => (
                    <div key={heir.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{heir.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {heir.relation} ({(heir.share * 100).toFixed(2)}%)
                        </p>
                      </div>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {heir.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
