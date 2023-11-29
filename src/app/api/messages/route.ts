import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  const URL = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const body = await req.json();
    const response = await fetch(`${URL}/api/income-chat-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('response', response);

    if (response.ok) {
      return NextResponse.json({success: true});
    }
    return NextResponse.json(
      {message: 'something went wrong', ok: false},
      {status: 500},
    );
  } catch (error) {
    return NextResponse.json(
      {message: 'something went wrong', ok: false},
      {status: 500},
    );
  }
}
