import praw
import json
import re
from settings import settings

CHANGELOG_LOCATION = './CHANGELOG.md'
MESSAGE_LOCATION = './src/reddit/message.md'

reddit = praw.Reddit(user_agent='LegendBuilderBot by /u/%s' % (settings['REDDIT_USERNAME']))
reddit.login(settings['REDDIT_USERNAME'], settings['REDDIT_PASSWORD'], disable_warning=True)

with open('package.json') as packageFile:
  package = json.load(packageFile)

title = 'Legend Builder v%s' % (package['version'])
print('Submitting \'%s\' to %s' % (title, settings['SUBREDDIT']))

with open(CHANGELOG_LOCATION, 'r') as changelog, open(MESSAGE_LOCATION, 'r') as message:
  # add changelog
  content = str(changelog.read())
  # remove links
  content = re.sub(r'<a name=".*?"></a>', '', content);
  # prefix with message
  content = str(message.read()) + content;
  
  submission = reddit.submit(settings['SUBREDDIT'], title, text=content, send_replies=True)
  submission.sticky(bottom=False)

print('finished')