import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client only if API key is present
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ message: 'Message is required' }, { status: 400 });
        }

        // Fallback if OpenAI key is missing or explicitly disabled
        if (!openai) {
            return NextResponse.json({
                message: "I am currently in 'Demo Mode' because the AI service is not configured. Please add a valid OPENAI_API_KEY to your .env.local file to enable real AI responses."
            });
        }

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful and empathetic healthcare assistant for SmartCare. 
            Your goal is to assist patients with general health queries and information about our system.
            You can help them understand how to book appointments (which they can do via the dashboard).
            Do not provide medical diagnosis or prescriptions. Always advise users to consult a doctor for specific medical advice.
            Keep responses concise and friendly.`,
                    },
                    { role: 'user', content: message },
                ],
            });

            const responseMessage = completion.choices[0].message.content;
            return NextResponse.json({ message: responseMessage });

        } catch (apiError: any) {
            console.error('OpenAI Error:', apiError);

            // Fallback to Mock Response if OpenAI fails (quota or other errors)
            const mockResponses: Record<string, string> = {
                'hello': 'Hello! I am your SmartCare assistant. How can I help you today?',
                'hi': 'Hi there! diverse health services are here for you.',
                'appointment': 'You can book an appointment by navigating to your Dashboard and selecting "Find a Doctor".',
                'book': 'To book a visit, go to the "Find Doctors" page, choose a specialist, and click "View Profile".',
                'doctor': 'We have many qualified doctors. Check the "Find Doctors" page to see their profiles.',
                'help': 'I can help you with booking appointments, finding doctors, or general information about SmartCare.',
                'price': 'Our consultation fees vary by doctor. Please check the specific doctor\'s profile for details.',
                'time': 'Doctors have different availability. You can see their slots when you select a doctor.',
                'thank': 'You\'re welcome! Let me know if you need anything else.',
            };

            const lowerMsg = message.toLowerCase();
            let response = "I'm currently in offline mode (OpenAI credits expired). I can help you navigate the site or book appointments.";

            for (const [key, value] of Object.entries(mockResponses)) {
                if (lowerMsg.includes(key)) {
                    response = `${value} (Offline Mode)`;
                    break;
                }
            }

            return NextResponse.json({ message: response });
        }

    } catch (error: any) {
        console.error('OpenAI Error:', error);
        return NextResponse.json({
            message: 'I encountered an issue processing your request. Please try again later.'
        }, { status: 500 });
    }
}
