import praw
import json
from settings import settings

#GITHUB_URL = 'https://github.com/SteveVanOpstal/LegendBuilder'
CHANGELOG_LOCATION = './CHANGELOG.md'

reddit = praw.Reddit(user_agent='LegendBuilderBot by /u/%s' % (settings['REDDIT_USERNAME']))
reddit.login(settings['REDDIT_USERNAME'], settings['REDDIT_PASSWORD'], disable_warning=True)

with open('package.json') as packageFile:
  package = json.load(packageFile)

title = 'Legend Builder v%s' % (package['version'])
print('Submitting \'%s\' to %s' % (title, settings['SUBREDDIT']))

with open(CHANGELOG_LOCATION, 'r') as file:
  content = str(file.read())
  resp = reddit.submit(settings['SUBREDDIT'], title, text=content, send_replies=True)

print('finished')