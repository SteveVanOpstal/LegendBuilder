import os
import praw
import json
import re
from settings import settings

dir_path = os.path.dirname(os.path.realpath(__file__))

CHANGELOG_LOCATION = './CHANGELOG.md'
HEADER_LOCATION = dir_path + '/header.md'
FOOTER_LOCATION = dir_path + '/footer.md'

reddit = praw.Reddit(user_agent='LegendBuilderBot by /u/%s' % (settings['REDDIT_USERNAME']))
reddit.login(settings['REDDIT_USERNAME'], settings['REDDIT_PASSWORD'], disable_warning=True)

with open('package.json') as packageFile:
  package = json.load(packageFile)

title = 'Legend Builder v%s' % (package['version'])
print('Submitting \'%s\' to %s' % (title, settings['SUBREDDIT']))

with open(CHANGELOG_LOCATION, 'r') as changelog, open(HEADER_LOCATION, 'r') as header, open(FOOTER_LOCATION, 'r') as footer:
  # add changelog
  content = str(changelog.read())
  # remove link tags
  content = re.sub(r'<a name=".*?"></a>', '', content);
  # prefix with header, postfix with footer
  content = str(header.read()) + '\n*****\n' + content + '\n*****\n' + str(footer.read());
  
  submission = reddit.submit(settings['SUBREDDIT'], title, text=content, send_replies=True)
  submission.sticky(bottom=False)

print('finished')