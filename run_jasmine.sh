#!/bin/bash
echo "************************** Running Jasmine Specs ********************"
phantomjs run-jasmine.js public/runner.html
exit $?
