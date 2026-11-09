import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Hr,
  Font,
  Tailwind,
  pixelBasedPreset,
} from 'react-email';

interface PreorderConfirmationProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  email: string;
}

const baseURL =
  process.env.NODE_ENV === 'production' ? 'https://knowware.press' : '';

export default function PreorderConfirmation({
  customerName,
  orderNumber,
  orderDate,
  email,
}: PreorderConfirmationProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                ink: '#191938',
                paper: '#EDEEE4',
                accent: '#2F55E0',
                sub: '#6b6b6b',
              },
            },
          },
        }}
      >
        <Head>
          <Font
            fontFamily="JetBrains Mono"
            fallbackFontFamily="monospace"
            webFont={{
              url: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjOVmNeW0.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Pre-order confirmed — Knowware ships Winter Solstice 2026.</Preview>
        <Body style={{ backgroundColor: '#EDEEE4', margin: 0, padding: 0 }}>

          {/* Header bar — ink with wordmark */}
          <Section style={{ backgroundColor: '#191938', padding: '0' }}>
            <Container style={{ maxWidth: '600px' }}>
              <Row>
                <Column style={{ padding: '24px 32px' }}>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(237,238,228,0.5)',
                      margin: '0 0 6px 0',
                    }}
                  >
                    The ARC Institute of Knowware
                  </Text>
                  <Text
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '28px',
                      fontWeight: 800,
                      letterSpacing: '-0.035em',
                      textTransform: 'uppercase',
                      color: '#EDEEE4',
                      margin: 0,
                      lineHeight: '1',
                    }}
                  >
                    Knowware
                  </Text>
                </Column>
                <Column style={{ padding: '24px 32px', textAlign: 'right' as const }}>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '11px',
                      letterSpacing: '0.02em',
                      color: 'rgba(237,238,228,0.5)',
                      margin: '0 0 4px 0',
                    }}
                  >
                    Pre-order confirmed
                  </Text>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '13px',
                      letterSpacing: '-0.01em',
                      color: '#EDEEE4',
                      margin: 0,
                    }}
                  >
                    #{orderNumber}
                  </Text>
                </Column>
              </Row>
            </Container>
          </Section>

          {/* Signal stripe */}
          <Section style={{ backgroundColor: '#2F55E0', padding: '0', height: '3px', lineHeight: '3px' }}>
            <Container style={{ maxWidth: '600px' }}>
              <Text style={{ margin: 0, fontSize: '0px', lineHeight: '3px' }}>&nbsp;</Text>
            </Container>
          </Section>

          {/* Body */}
          <Container style={{ maxWidth: '600px', backgroundColor: '#EDEEE4' }}>

            {/* Greeting */}
            <Section style={{ padding: '40px 32px 0' }}>
              <Text
                style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#6b6b6b',
                  margin: '0 0 16px 0',
                }}
              >
                {orderDate}
              </Text>
              <Heading
                as="h1"
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: '32px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#191938',
                  margin: '0 0 20px 0',
                  lineHeight: '1.1',
                }}
              >
                Your copy is reserved.
              </Heading>
              <Text
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#191938',
                  margin: '0 0 8px 0',
                }}
              >
                {customerName ? `${customerName}, thank` : 'Thank'} you for pre-ordering <em>Knowware: Systems of Intelligence</em>. You'll be among the first to receive it when it ships on the Winter Solstice.
              </Text>
            </Section>

            <Hr style={{ borderColor: 'rgba(25,25,56,0.16)', borderTopWidth: '1px', borderStyle: 'solid', margin: '32px 32px' }} />

            {/* Order summary */}
            <Section style={{ padding: '0 32px' }}>
              <Text
                style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#6b6b6b',
                  margin: '0 0 20px 0',
                }}
              >
                Order summary
              </Text>

              {/* Book line */}
              <Row style={{ marginBottom: '16px' }}>
                <Column>
                  <Text
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '15px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: '#191938',
                      margin: 0,
                    }}
                  >
                    Knowware: Systems of Intelligence
                  </Text>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '11px',
                      color: '#6b6b6b',
                      margin: '4px 0 0 0',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Pre-order · Digital edition · 81 sessions
                  </Text>
                </Column>
                <Column style={{ textAlign: 'right' as const, verticalAlign: 'top' }}>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '15px',
                      letterSpacing: '-0.02em',
                      color: '#191938',
                      margin: 0,
                    }}
                  >
                    $33.00
                  </Text>
                </Column>
              </Row>

              <Hr style={{ borderColor: 'rgba(25,25,56,0.16)', borderTopWidth: '1px', borderStyle: 'solid', margin: '16px 0' }} />

              {/* Ship date */}
              <Row>
                <Column>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '11px',
                      letterSpacing: '0.02em',
                      color: '#6b6b6b',
                      margin: 0,
                    }}
                  >
                    Ships
                  </Text>
                </Column>
                <Column style={{ textAlign: 'right' as const }}>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '11px',
                      letterSpacing: '-0.01em',
                      color: '#191938',
                      margin: 0,
                    }}
                  >
                    December 21, 2026 · Winter Solstice
                  </Text>
                  <Text
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.01em',
                      color: '#9a9a97',
                      margin: '4px 0 0 0',
                      textAlign: 'right' as const,
                    }}
                  >
                    The longest night — the first thing humans ever learned to count.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={{ borderColor: 'rgba(25,25,56,0.16)', borderTopWidth: '1px', borderStyle: 'solid', margin: '32px 32px' }} />

            {/* CTA */}
            <Section style={{ padding: '0 32px 40px' }}>
              <Text
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: '#191938',
                  margin: '0 0 24px 0',
                }}
              >
                While you wait, the table of contents, methodology, and three sample sessions are available to read now.
              </Text>
              <Button
                href="https://knowware.press/#table"
                style={{
                  backgroundColor: '#191938',
                  color: '#EDEEE4',
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: '12px',
                  letterSpacing: '0.02em',
                  padding: '14px 24px',
                  display: 'inline-block',
                  textDecoration: 'none',
                  boxSizing: 'border-box' as const,
                }}
              >
                Explore the book →
              </Button>
            </Section>

          </Container>

          {/* Footer */}
          <Container style={{ maxWidth: '600px' }}>
            <Section style={{ padding: '24px 32px' }}>
              <Text
                style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.02em',
                  color: '#9a9a97',
                  margin: '0 0 8px 0',
                  lineHeight: '1.6',
                }}
              >
                This confirmation was sent to {email}. You are receiving this because you pre-ordered Knowware at knowware.press.
              </Text>
              <Text
                style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.02em',
                  color: '#9a9a97',
                  margin: 0,
                }}
              >
                © 2026 The ARC Institute of Knowware · knowware.press
              </Text>
            </Section>
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
}

PreorderConfirmation.PreviewProps = {
  customerName: 'Khayyam',
  orderNumber: '00001',
  orderDate: 'November 7, 2026',
  email: 'theusual@gmail.com',
} satisfies PreorderConfirmationProps;

export { PreorderConfirmation };
