#!/usr/local/bin/python2.6
# -*- coding: utf-8 -*-
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

# Copyright (C) 2010-2011 Brandon Evans.
# http://www.brandonevans.org/
from cgi import escape
import cgitb
import json
import os
import sys
import time
from webob import Request, Response
sys.path.reverse()
sys.path.append('/home/brandon/lib/python2.6')
sys.path.reverse()
print 'Content-Type: text/html\n'
cgitb.enable()
environ = dict(os.environ.items())
environ['wsgi.input'] = sys.stdin
environ['wsgi.errors'] = sys.stderr
environ['wsgi.version'] = (1,0)
environ['wsgi.multithread'] = False
environ['wsgi.multiprocess'] = True
environ['wsgi.run_once'] = True
environ['wsgi.url_scheme'] = 'http'
request = Request(environ)
request.charset = 'utf8'
response = Response()
from markupsafe import Markup
from mercurial import ui, hg
import suit
from rulebox import templating
templating.var.source = open('index.py').read()
repo = hg.repository(ui.ui(), '.')
templating.var.repo = []
for index, rev in enumerate(repo):
    rev = repo[index]
    templating.var.repo.append({
        'date': time.ctime(rev.date()[0]),
        'description': escape(
            Markup(rev.description()).unescape()
        ).replace('\n', '<br />'),
        'last': (index == 0 and len(repo) != 1),
        'second': (index == len(repo) - 2),
        'user': rev.user()
    })
templating.var.repo.reverse()
string = suit.execute(
    templating.rules,
    open(
        'index.tpl'
    ).read()
)
# Check if POST or GET data have been sent for SLACKS.
if 'slacks' in request.params:
    # JSON encode the log.
    slacks = json.dumps(suit.log, separators=(',', ':'))
    # Set the headers to prompt a download of a .json file.
    response.headerlist = [
        ('Pragma', 'public'),
        ('Expires', '0'),
        (
            'Cache-Control',
            'must-revalidate, post-check=0, pre-check=0'
        ),
        ('Content-type', 'text/json'),
        ('Content-Disposition', 'attachment; filename=slacks.json'),
        ('Content-Length', len(slacks))
    ]
    # Print the log.
    print slacks
else:
    # Print the string normally.
    print string