// frontend/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if all required environment variables are present
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'unhealthy',
        message: `Missing environment variables: ${missingVars.join(', ')}`,
        timestamp: new Date().toISOString(),
        services: {
          frontend: 'running',
          environment: 'incomplete'
        }
      }, { status: 503 });
    }

    // Basic health check
    return NextResponse.json({
      status: 'healthy',
      message: 'Wojat Platform is running',
      timestamp: new Date().toISOString(),
      services: {
        frontend: 'running',
        environment: 'complete'
      },
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
