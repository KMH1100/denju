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
    const type = formData.get('type') as string // 'gpa' or 'thumbnail'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 画像ファイルかチェック
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // ファイルサイズチェック（4MB）
    const maxSize = type === 'thumbnail' ? 2 * 1024 * 1024 : 4 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File size must be less than ${maxSize / 1024 / 1024}MB` }, { status: 400 })
    }

    // バケット名を決定
    const bucketName = type === 'gpa' ? 'gpa-proofs' : 'thumbnails'

    // ファイル名をユニークに
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage error:', error)
      throw error
    }

    // 署名付きURL生成（GPA証明: 1年、サムネイル: 永続的に近い期間）
    const expiresIn = type === 'gpa' ? 60 * 60 * 24 * 365 : 60 * 60 * 24 * 365 * 10
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(data.path, expiresIn)

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
