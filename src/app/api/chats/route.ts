import {NextResponse} from 'next/server';
import {io} from 'socket.io-client';

export async function POST(req: Request) {
  try {
    const URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    const socket = io(URL);
    const body = await req.json();

    console.log("BODY", body);

    socket.emit('sendMessage', body);

    return NextResponse.json({success: true});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {message: 'something went wrong', ok: false},
      {status: 500},
    );
  }
}
