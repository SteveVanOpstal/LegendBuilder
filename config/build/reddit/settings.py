import os
import json
dir_path = os.path.dirname(os.path.realpath(__file__))
with open(dir_path + '/.settings.json') as settingsFile:
  settings = json.load(settingsFile)