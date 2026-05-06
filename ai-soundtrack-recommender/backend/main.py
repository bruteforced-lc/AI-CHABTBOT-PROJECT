import os
import sqlite3
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    user_input: str

@app.get("/")
def root():
    return {"message": "SoundBot API chal rahi hai!"}

@app.post("/recommend")
def recommend(data: UserInput):

    # Step 1 — Gemini se mood labels lo
    prompt = """
    User ka mood: """ + data.user_input + """

    Sirf JSON do, kuch aur bilkul mat likho, no markdown:
    {
      "mood": "sad/happy/energetic/calm/romantic/focused",
      "energy": "low/medium/high",
      "tempo": "slow/medium/fast",
      "reason": "one line reason in english"
    }
    """

    # API CALL....
    response = client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=prompt
    )

    text = response.text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    tags = json.loads(text)

    # Step 2 — Database mein search karo
    conn = sqlite3.connect("songs.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT title, artist, mood, energy, tempo, lastfm_url
        FROM songs
        WHERE mood = ?
        ORDER BY RANDOM()
        LIMIT 20
    """, (tags["mood"],))

    songs = cursor.fetchall()
    conn.close()

    # Step 3 — Scoring algorithm
    def get_score(song):
        score = 0
        if song[3] == tags["energy"]: score += 30
        if song[4] == tags["tempo"]:  score += 20
        return score

    scored = sorted(songs, key=get_score, reverse=True)
    top5 = scored[:5]

    # Step 4 — Result bhejo
    return {
        "tags": tags,
        "songs": [
            {
                "title":      s[0],
                "artist":     s[1],
                "mood":       s[2],
                "lastfm_url": s[5]
            }
            for s in top5
        ]
    }