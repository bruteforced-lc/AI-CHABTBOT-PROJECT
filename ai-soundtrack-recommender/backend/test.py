import urllib.request
import json
req = urllib.request.Request(
    'http://127.0.0.1:8000/recommend',
    data=b'{"user_input":"happy"}',
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
