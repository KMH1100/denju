import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const user = await requireAuth()
    const { materialId } = params

    // 購入確認
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_materialId_purchaseType: {
          userId: user.id,
          materialId,
          purchaseType: 'PDF',
        },
      },
    })

    if (!purchase) {
      return NextResponse.json(
        { error: '購入していない資料です' },
        { status: 403 }
      )
    }

    // 資料情報取得
    const material = await prisma.material.findUnique({
      where: { id: materialId },
    })

    if (!material || !material.pdfUrl) {
      return NextResponse.json(
        { error: 'PDFが見つかりません' },
        { status: 404 }
      )
    }

    // PDFをフェッチ
    const pdfResponse = await fetch(material.pdfUrl)
    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch PDF')
    }

    const pdfBytes = await pdfResponse.arrayBuffer()
    
    // PDFに透かしを追加
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const watermarkText = `${user.username || user.email} - ${user.university?.name || ''} - 転載禁止`
    const fontSize = 12
    const opacity = 0.1

    for (const page of pages) {
      const { width, height } = page.getSize()
      
      // 対角線上に透かしを配置
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)
      
      // 複数の透かしを配置（セキュリティ強化）
      for (let i = 0; i < 5; i++) {
        page.drawText(watermarkText, {
          x: width * 0.1 + (i * 50),
          y: height * 0.8 - (i * 150),
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
          opacity: opacity,
          rotate: { angle: 45, type: 'degrees' },
        })
      }
    }

    // 透かし入りPDFを生成
    const modifiedPdfBytes = await pdfDoc.save()

    return new NextResponse(modifiedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(material.title)}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('PDF download error:', error)
    return NextResponse.json(
      { error: 'PDFのダウンロードに失敗しました' },
      { status: 500 }
    )
  }
}
