// app/api/generate-recipe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients) {
      return NextResponse.json({ error: '野菜の名前が入力されていません' }, { status: 400 });
    }


    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `あなたはプロの料理研究家です。以下の規格外野菜を使って、美味しくて簡単なレシピを1つ提案してください。
    入力された野菜: ${ingredients}
    
    以下のJSONスキーマに従って出力してください。
    {
      "title": "料理名",
      "time": "調理時間（例：15分）",
      "ingredients": ["材料1", "材料2"],
      "steps": ["手順1", "手順2"],
      "point": "規格外野菜を活かすポイント"
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const recipeData = JSON.parse(text);

    return NextResponse.json({ recipe: recipeData });

  } catch (error) {
    console.error('APIエラー:', error);
    return NextResponse.json({ error: 'レシピの生成に失敗しました' }, { status: 500 });
  }
}