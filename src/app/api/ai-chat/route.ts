import { NextResponse } from 'next/server';

// ==========================================
// CONFIGURATION
// ==========================================

// Gemini API Keys from .env
const GEMINI_KEYS_STRING = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || 'AIzaSyD0K-u4lQ2PBOLzxM669_k7eenXP1RUvCY';
const GEMINI_API_KEYS = GEMINI_KEYS_STRING.split(',').map(k => k.trim()).filter(k => k.length > 0);

// GitHub Token (for GitHub Models)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// OpenAI API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Gemini Models Priority
const GEMINI_MODELS = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash-lite-preview-02-05',
    'gemini-2.0-flash-exp',
    'gemini-flash-latest'
];

// GitHub Models Priority
const GITHUB_MODELS = [
    'Meta-Llama-3-70B-Instruct',
    'gpt-4o',
    'Mistral-large'
];

// OpenAI Models Priority
const OPENAI_MODELS = [
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
];

// ==========================================
// PROVIDERS LOGIC
// ==========================================

async function callGemini(message: string, history: any[], apiKey: string, model: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = [
        {
            role: 'user',
            parts: [{
                text: `Sen Termiziy AI yordamchisisan. O'zbek tilida javob ber. Qisqa, aniq va foydali javoblar ber. 
                Sen quyidagi sohalarda yordam bera olasan:
                - Dasturlash va texnologiya
                - Huquqiy maslahatlar
                - Ta'lim va kurslar haqida ma'lumot
                - Umumiy savollar
                Har doim do'stona va professional bo'l.`
            }]
        },
        {
            role: 'model',
            parts: [{ text: 'Tushundim! Men Termiziy AI yordamchisiman. Sizga qanday yordam bera olaman?' }]
        },
        ...history.map((msg: { role: string; text: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        })),
        {
            role: 'user',
            parts: [{ text: message }]
        }
    ];

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw { provider: 'Gemini', model, status: response.status, details: errorData };
    }

    const data = await response.json();
    return {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text,
        limits: null
    };
}

// Generic handler for OpenAI-compatible APIs (GitHub Models, OpenAI, Groq, DeepSeek, etc.)
async function callOpenAICompatible(message: string, history: any[], token: string, model: string, baseUrl: string) {
    const messages = [
        {
            role: 'system',
            content: `Sen Termiziy AI yordamchisisan. O'zbek tilida javob ber. Qisqa, aniq va foydali javoblar ber.`
        },
        ...history.map((msg: { role: string; text: string }) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.text
        })),
        {
            role: 'user',
            content: message
        }
    ];

    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            messages,
            model: model,
            temperature: 0.7,
            max_tokens: 1024,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw { provider: baseUrl.includes('openai') ? 'OpenAI' : 'GitHub', model, status: response.status, details: errorData };
    }

    const data = await response.json();

    const allHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => allHeaders[key] = val);

    return {
        content: data.choices[0].message.content,
        limits: {
            requests: response.headers.get('x-ratelimit-remaining-requests') || response.headers.get('x-ratelimit-remaining'),
            tokens: response.headers.get('x-ratelimit-remaining-tokens'),
            debug_headers: allHeaders
        }
    };
}

// ==========================================
// MAIN HANDLER
// ==========================================

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, history = [] } = body;

        if (!message) {
            return NextResponse.json({ success: false, error: 'Xabar kiritilishi shart' }, { status: 400 });
        }

        let lastError = null;

        // 1. Try GitHub Models (PRIORITY 1)
        if (GITHUB_TOKEN) {
            for (const model of GITHUB_MODELS) {
                try {
                    const aiResponse = await callOpenAICompatible(
                        message, history, GITHUB_TOKEN, model, "https://models.inference.ai.azure.com/chat/completions"
                    );
                    if (aiResponse && aiResponse.content) {
                        return NextResponse.json({
                            success: true,
                            response: aiResponse.content,
                            debug: { provider: 'GitHub', model, limits: aiResponse.limits }
                        });
                    }
                } catch (error) {
                    console.warn(`GitHub Failed: Model=${model}`, error);
                    lastError = error;
                }
            }
        }

        // 2. Try Gemini Models (Fallback)
        for (const model of GEMINI_MODELS) {
            for (const apiKey of GEMINI_API_KEYS) {
                try {
                    const aiResponse = await callGemini(message, history, apiKey, model);
                    if (aiResponse && aiResponse.content) {
                        return NextResponse.json({
                            success: true,
                            response: aiResponse.content,
                            debug: { provider: 'Gemini', model, key: `...${apiKey.slice(-4)}` }
                        });
                    }
                } catch (error) {
                    console.warn(`Gemini Failed: Model=${model}, Key=...${apiKey.slice(-4)}`, error);
                    lastError = error;
                }
            }
        }

        // 3. Try OpenAI (Fallback)
        if (OPENAI_API_KEY) {
            for (const model of OPENAI_MODELS) {
                try {
                    const aiResponse = await callOpenAICompatible(
                        message, history, OPENAI_API_KEY, model, "https://api.openai.com/v1/chat/completions"
                    );
                    if (aiResponse && aiResponse.content) {
                        return NextResponse.json({
                            success: true,
                            response: aiResponse.content,
                            debug: { provider: 'OpenAI', model, limits: aiResponse.limits }
                        });
                    }
                } catch (error) {
                    console.warn(`OpenAI Failed: Model=${model}`, error);
                    lastError = error;
                }
            }
        }

        // If all failed
        const err = lastError as any;
        const errorMessage = err?.details?.error?.message || err?.message || 'Barcha AI provayderlari xato berdi.';
        const isQuota = errorMessage.includes('Quota exceeded') || err?.status === 429;

        return NextResponse.json(
            {
                success: false,
                error: isQuota ? "Google Gemini limiti tugadi (Quota Exceeded). Yangi API kalit kerak." : `AI Xatosi: ${errorMessage}`,
                details: lastError
            },
            { status: 500 }
        );

    } catch (error) {
        console.error('AI Chat general error:', error);
        return NextResponse.json(
            { success: false, error: 'Serverda umumiy xatolik yuz berdi' },
            { status: 500 }
        );
    }
}
