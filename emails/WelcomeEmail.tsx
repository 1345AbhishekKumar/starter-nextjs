import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Text,
  Preview,
  Heading,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Preview>Welcome to our platform!</Preview>
      <Body
        style={{
          fontFamily: 'sans-serif',
          backgroundColor: '#f9f9f9',
          padding: '20px',
        }}
      >
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            maxWidth: '580px',
            margin: '0 auto',
          }}
        >
          <Heading
            style={{
              color: '#1a202c',
              fontSize: '24px',
              marginBottom: '16px',
              fontWeight: 'bold',
            }}
          >
            Welcome, {name}!
          </Heading>
          <Text
            style={{
              color: '#4a5568',
              fontSize: '16px',
              lineHeight: '24px',
              marginBottom: '16px',
            }}
          >
            Thanks for signing up. We&apos;re excited to have you on board!
          </Text>
          <Text
            style={{
              color: '#718096',
              fontSize: '14px',
              lineHeight: '20px',
            }}
          >
            Best regards,
            <br />
            The Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
