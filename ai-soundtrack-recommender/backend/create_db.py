import os
import sqlite3
import requests
from dotenv import load_dotenv

load_dotenv()

LASTFM_API_KEY = os.getenv("LASTFM_API_KEY")

# Database aur table banao
conn = sqlite3.connect("songs.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS songs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT,
    artist      TEXT,
    mood        TEXT,
    energy      TEXT,
    genre       TEXT,
    tempo       TEXT,
    lastfm_url  TEXT
)
""")
conn.commit()
print("Table ban gayi!")

# Mood ke hisaab se genre mapping
mood_genre_map = {
    "sad":       ["sad songs", "melancholy", "heartbreak"],
    "happy":     ["happy", "feel good", "upbeat"],
    "energetic": ["workout", "pump up", "energy"],
    "calm":      ["lo-fi", "chill", "relax"],
    "romantic":  ["romantic", "love songs"],
    "focused":   ["study music", "instrumental", "concentration"]
}

energy_map = {
    "sad": "low", "happy": "high", "energetic": "high",
    "calm": "low", "romantic": "medium", "focused": "medium"
}

tempo_map = {
    "sad": "slow", "happy": "fast", "energetic": "fast",
    "calm": "slow", "romantic": "medium", "focused": "medium"
}

# Last.fm se songs fetch karo
def fetch_songs(tag, mood, limit=20):
    url = "http://ws.audioscrobbler.com/2.0/"
    params = {
        "method":  "tag.getTopTracks",
        "tag":     tag,
        "api_key": LASTFM_API_KEY,
        "format":  "json",
        "limit":   limit
    }
    response = requests.get(url, params=params)
    data = response.json()

    if "tracks" not in data:
        print("  " + tag + " — koi data nahi aaya")
        return []

    songs = []
    for track in data["tracks"]["track"]:
        song = {
            "title":      track["name"],
            "artist":     track["artist"]["name"],
            "mood":       mood,
            "energy":     energy_map[mood],
            "genre":      tag,
            "tempo":      tempo_map[mood],
            "lastfm_url": track["url"]
        }
        songs.append(song)
    return songs

# Sab moods ke liye fetch karo
all_songs = []

for mood, tags in mood_genre_map.items():
    print(mood + " songs fetch ho rahe hain...")
    for tag in tags:
        songs = fetch_songs(tag, mood, limit=20)
        all_songs.extend(songs)
        print("  " + tag + " — " + str(len(songs)) + " songs mili")

# Database mein save karo
for song in all_songs:
    cursor.execute("""
        INSERT INTO songs (title, artist, mood, energy, genre, tempo, lastfm_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        song["title"],
        song["artist"],
        song["mood"],
        song["energy"],
        song["genre"],
        song["tempo"],
        song["lastfm_url"]
    ))

conn.commit()
conn.close()

print("\nDatabase ready! Total " + str(len(all_songs)) + " songs save hui.")