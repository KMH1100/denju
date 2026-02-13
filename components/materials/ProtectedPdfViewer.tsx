'use client'

import { useEffect } from 'react'

export function ProtectedPdfViewer({ pdfUrl }: { pdfUrl: string }) {
  useEffect(() => {
    // 右クリック禁止
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // キーボードショートカット禁止
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Ctrl+P (印刷)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        return false
      }
      // Ctrl+S (保存)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        return false
      }
      // Ctrl+U (ソース表示)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+I (開発者ツール)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      // F12 (開発者ツール)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return false
      }
    }

    // ドラッグ禁止
    const preventDrag = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // 選択禁止
    const preventSelection = () => {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
    }

    // イベントリスナー登録
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('keydown', preventKeyboardShortcuts)
    document.addEventListener('dragstart', preventDrag)
    document.addEventListener('selectstart', preventSelection)
    document.addEventListener('copy', preventSelection)

    // 印刷メディアクエリを無効化
    const style = document.createElement('style')
    style.innerHTML = '@media print { body { display: none !important; } }'
    document.head.appendChild(style)

    // クリーンアップ
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('keydown', preventKeyboardShortcuts)
      document.removeEventListener('dragstart', preventDrag)
      document.removeEventListener('selectstart', preventSelection)
      document.removeEventListener('copy', preventSelection)
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  return (
    <div className="w-full h-[calc(100vh-80px)] no-select">
      <style jsx global>{`
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
        
        iframe {
          pointer-events: auto !important;
        }
      `}</style>
      
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
        className="w-full h-full border-0 no-select"
        title="Protected PDF Viewer"
        sandbox="allow-same-origin"
      />
      
      {/* 透明オーバーレイ（追加の保護層） */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{ background: 'transparent' }}
      />
    </div>
  )
}
