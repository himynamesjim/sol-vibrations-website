import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  data?: SerializedEditorState | null
  className?: string
}

export function RichText({ data, className }: Props) {
  if (!data) return null
  return <LexicalRichText data={data} className={className ?? 'prose-sol'} />
}
