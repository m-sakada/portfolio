import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// API名とrevalidate対象パスのマッピング
const API_PATH_MAP: Record<string, string[]> = {
  works: ['/'],
  career: ['/'],
  skills: ['/'],
  settings: ['/', '/about'],
};

/**
 * microCMS Webhook署名を検証（HMAC-SHA256）
 */
function verifySignature(body: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * microCMS Webhook handler for On-Demand ISR
 * 4つのAPI（works, experiences, skills, settings）の更新時にrevalidate
 */
export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.MICROCMS_WEBHOOK_SECRET;

    if (!expectedSecret) {
      console.error('MICROCMS_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // リクエストボディを取得
    const rawBody = await request.text();
    
    // Webhook署名を検証（HMAC-SHA256）
    const signature = request.headers.get('X-MICROCMS-Signature');
    if (!signature || !verifySignature(rawBody, signature, expectedSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const body = JSON.parse(rawBody);
    const { api, type } = body;

    console.log(`[Revalidate] Received webhook: api=${api}, type=${type}, body=${rawBody}`);

    // APIに応じたパスをrevalidate
    const pathsToRevalidate = API_PATH_MAP[api] || ['/'];
    const revalidatedPaths: string[] = [];

    // microCMSデータのキャッシュタグを無効化（即時反映）
    console.log('[Revalidate] Calling revalidateTag("microcms")');
    revalidateTag('microcms', { expire: 0 });

    for (const path of pathsToRevalidate) {
      console.log(`[Revalidate] Calling revalidatePath("${path}")`);
      revalidatePath(path);
      revalidatedPaths.push(path);
    }

    console.log(`[Revalidate] Success: paths=${revalidatedPaths.join(', ')}, tag=microcms`);

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      api,
      type,
      paths: revalidatedPaths,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidate webhook endpoint is ready',
    supportedApis: Object.keys(API_PATH_MAP),
  });
}
