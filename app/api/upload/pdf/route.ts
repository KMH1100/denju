import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // PDFファイルかチェック
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be PDF' }, { status: 400 })
    }

    // ファイルサイズチェック（32MB）
    if (file.size > 32 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 32MB' }, { status: 400 })
    }

    // ファイル名をユニークに
    const fileExt = 'pdf'
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from('materials')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage error:', error)
      throw error
    }

    // 署名付きURL生成（1年間有効）
    const { data: signedUrlData } = await supabase.storage
      .from('materials')
      .createSignedUrl(data.path, 60 * 60 * 24 * 365)

    if (!signedUrlData) {
      throw new Error('Failed to create signed URL')
    }

    return NextResponse.json({
      url: signedUrlData.signedUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
