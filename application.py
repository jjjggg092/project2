import os, json

from datetime import datetime
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

chanels = ['Principal']
chats = { 'Principal': [] }

@app.route("/")
def index():

    return render_template("index.html", chanels = chanels)

@app.route('/', methods=['POST'])
def chanel():
    chanel = request.form.get("chanel")
    if chanel in chanels or chanel is None:
        return render_template("index.html", message = "Try again", chanels = chanels)
    chanels.append(chanel)
    chats[chanel] = []
    return render_template("index.html", chanels = chanels)

@app.route('/<chanel>')
def load_ch (chanel):
    messages = chats[chanel]
    return json.dumps(messages)

@socketio.on('submit message')
def message(data):
    date = datetime.now()
    date_str = date.strftime('%d/%m/%Y - %H:%M:%S')
    chanel = data['chanel']
    save = {"unama": data['username'],"me": data['message'], "da": date_str, "cha": chanel}
    chats[chanel].append(save)
    if len(chats[chanel]) >=100:
        chats[chanel].pop(0)
    return emit('anunce message', save, broadcast=True)

if __name__ == "__main__":
    app.run(debug=True)
    socketio.run(app)
