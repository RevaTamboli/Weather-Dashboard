import os
from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

API_KEY = "d5a57fc95e89439e950131949252508"  # Your WeatherAPI key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    city = request.args.get('city', 'Kolhapur')

    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}"
    res = requests.get(url).json()

    if 'current' in res:
        temp = res['current']['temp_c']
        humidity = res['current']['humidity']
        return jsonify({"temperature": temp, "humidity": humidity, "city": city})
    else:
        return jsonify({"error": "API error", "details": res})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

