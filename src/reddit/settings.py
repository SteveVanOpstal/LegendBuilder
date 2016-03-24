import json
with open('./src/reddit/.settings.json') as settingsFile:
  settings = json.load(settingsFile)