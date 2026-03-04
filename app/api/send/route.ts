import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Resendの管理画面で取得したAPIキーを入れてください
const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(request: Request) {
  try {
    const { to, farmerName, vegName, price, quantity } = await request.json();

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // ドメイン認証前はこのまま
      to: [to],
      subject: '【出品受付】申請ありがとうございます',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>${farmerName} 様</h2>
          <p>規格外野菜の出品申請を受け付けました！</p>
          <hr />
          <p><strong>出品内容:</strong> ${vegName}</p>
          <p><strong>販売価格:</strong> ${price}円</p>
          <p><strong>数量:</strong> ${quantity}</p>
          <hr />
          <p>現在運営チームにて審査中です。公開まで1〜2営業日ほどお待ちください。</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}