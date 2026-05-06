import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const params = await searchParams
  const isSuccess = params.success === '1'
  const isError   = !!params.error

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0A0B0D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      fontFamily: 'Georgia, serif',
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '20px', color: '#F4F1EB', letterSpacing: '-0.02em' }}>
            CATALYST
          </p>
          <p style={{ margin: '4px 0 0 0', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#B8935B', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            A RIPPLE NEXUS INSTITUTION
          </p>
        </div>

        {isSuccess && (
          <>
            <p style={{ margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#B8935B', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              UNSUBSCRIBED
            </p>
            <p style={{ margin: '0 0 20px 0', fontFamily: 'Georgia, serif', fontSize: '28px', color: '#F4F1EB', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              You&rsquo;ve been removed<br />
              <em style={{ color: '#B8935B' }}>from all lists.</em>
            </p>
            <p style={{ margin: '0 0 32px 0', fontFamily: 'Georgia, serif', fontSize: '15px', color: '#8B8681', lineHeight: 1.7 }}>
              Your email will no longer receive any marketing communications from Catalyst.
              Transactional emails related to purchases you&rsquo;ve made may still be sent.
            </p>
          </>
        )}

        {isError && (
          <>
            <p style={{ margin: '0 0 8px 0', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#B8935B', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              LINK INVALID
            </p>
            <p style={{ margin: '0 0 20px 0', fontFamily: 'Georgia, serif', fontSize: '28px', color: '#F4F1EB', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              This unsubscribe link<br />
              <em style={{ color: '#B8935B' }}>could not be found.</em>
            </p>
            <p style={{ margin: '0 0 32px 0', fontFamily: 'Georgia, serif', fontSize: '15px', color: '#8B8681', lineHeight: 1.7 }}>
              The link may have already been used or is malformed. If you&rsquo;re still receiving
              emails you&rsquo;d like to stop, reply to any email from us with &ldquo;unsubscribe&rdquo;
              and we&rsquo;ll remove you immediately.
            </p>
          </>
        )}

        {!isSuccess && !isError && (
          <>
            <p style={{ margin: '0 0 20px 0', fontFamily: 'Georgia, serif', fontSize: '24px', color: '#F4F1EB', fontWeight: 400, lineHeight: 1.2 }}>
              Unsubscribe
            </p>
            <p style={{ margin: '0 0 32px 0', fontFamily: 'Georgia, serif', fontSize: '15px', color: '#8B8681', lineHeight: 1.7 }}>
              Use the unsubscribe link in any email from Catalyst to be removed from our list.
            </p>
          </>
        )}

        <Link href="/" style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px',
          color: '#8B8681',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          ← Return to Catalyst
        </Link>
      </div>
    </main>
  )
}
