import os

from collectivites import app

app.run(debug=os.environ.get('DEBUG', True), host='localhost')
