"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface TradeData {
  date: string
  pair: string
  type: "buy" | "sell"
  amount: number
  price: number
  pnl?: number
  fees?: number
}

interface TradeHistoryUploadProps {
  onAnalysisComplete: () => void
}

export function TradeHistoryUpload({ onAnalysisComplete }: TradeHistoryUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parsedTrades, setParsedTrades] = useState<TradeData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setError(null)
      parseTradeFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  const parseTradeFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const text = await file.text()
      let trades: TradeData[] = []

      if (file.name.endsWith('.csv')) {
        trades = parseCSV(text)
      } else if (file.name.endsWith('.json')) {
        trades = parseJSON(text)
      } else {
        throw new Error("Unsupported file format")
      }

      setParsedTrades(trades)
      setUploadProgress(100)
      setSuccess(true)
      
      // Simulate AI analysis
      setTimeout(() => {
        onAnalysisComplete()
      }, 2000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file")
    } finally {
      setIsUploading(false)
    }
  }

  const parseCSV = (text: string): TradeData[] => {
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const trades: TradeData[] = []

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim())
        const trade: TradeData = {
          date: values[headers.indexOf('date')] || values[headers.indexOf('timestamp')] || '',
          pair: values[headers.indexOf('pair')] || values[headers.indexOf('symbol')] || '',
          type: (values[headers.indexOf('type')] || values[headers.indexOf('side')] || '').toLowerCase() as "buy" | "sell",
          amount: parseFloat(values[headers.indexOf('amount')] || values[headers.indexOf('quantity')] || '0'),
          price: parseFloat(values[headers.indexOf('price')] || '0'),
          pnl: parseFloat(values[headers.indexOf('pnl')] || values[headers.indexOf('profit')] || '0'),
          fees: parseFloat(values[headers.indexOf('fees')] || '0')
        }
        trades.push(trade)
      }
    }

    return trades
  }

  const parseJSON = (text: string): TradeData[] => {
    const data = JSON.parse(text)
    if (Array.isArray(data)) {
      return data.map((trade: any) => ({
        date: trade.date || trade.timestamp || '',
        pair: trade.pair || trade.symbol || '',
        type: (trade.type || trade.side || '').toLowerCase() as "buy" | "sell",
        amount: parseFloat(trade.amount || trade.quantity || 0),
        price: parseFloat(trade.price || 0),
        pnl: parseFloat(trade.pnl || trade.profit || 0),
        fees: parseFloat(trade.fees || 0)
      }))
    }
    return []
  }

  const handleManualUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.json,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setUploadedFile(file)
        setError(null)
        parseTradeFile(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Trade History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-600 dark:text-blue-400">Drop your trade history file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag & drop your trade history file</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Supports CSV, JSON, and TXT formats from major exchanges
                </p>
                <Button variant="outline" onClick={handleManualUpload}>
                  Or click to browse files
                </Button>
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="font-medium">{uploadedFile.name}</span>
              <span className="text-sm text-gray-500">
                ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing trade data...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully parsed {parsedTrades.length} trades. Starting AI analysis...
              </AlertDescription>
            </Alert>
          )}

          {parsedTrades.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Preview ({parsedTrades.length} trades)</h3>
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Pair</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Price</th>
                      <th className="p-2 text-left">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTrades.slice(0, 10).map((trade, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{trade.date}</td>
                        <td className="p-2">{trade.pair}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            trade.type === 'buy' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {trade.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2">{trade.amount.toFixed(4)}</td>
                        <td className="p-2">${trade.price.toFixed(2)}</td>
                        <td className={`p-2 ${trade.pnl && trade.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.pnl ? `$${trade.pnl.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 