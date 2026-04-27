import ClientShell from './ClientShell'

export function generateStaticParams() {
  return [{ slug: [] }]
}

export default function CatchAllPage() {
  return <ClientShell />
}
