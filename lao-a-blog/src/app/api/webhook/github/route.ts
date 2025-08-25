import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const event = request.headers.get('x-github-event')

    // 验证Webhook签名
    const secret = process.env.GITHUB_WEBHOOK_SECRET
    if (secret && signature) {
      const expectedSignature = `sha256=${crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')}`
      
      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // 处理push事件
    if (event === 'push') {
      const payload = JSON.parse(body)
      const { ref, repository } = payload

      // 只处理main分支的更新
      if (ref === 'refs/heads/main') {
        console.log(`Repository ${repository.full_name} updated, triggering rebuild...`)
        
        // 这里可以触发重新部署
        // 例如：调用Vercel的重新部署API
        if (process.env.VERCEL_DEPLOY_HOOK) {
          try {
            await fetch(process.env.VERCEL_DEPLOY_HOOK, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            console.log('Deploy hook triggered successfully')
          } catch (error) {
            console.error('Failed to trigger deploy hook:', error)
          }
        }

        return NextResponse.json({ 
          message: 'Rebuild triggered',
          repository: repository.full_name,
          branch: ref
        })
      }
    }

    return NextResponse.json({ message: 'Webhook received' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
