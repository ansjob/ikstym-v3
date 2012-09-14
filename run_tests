#!/bin/bash
./run_jasmine.sh
JASMINE_EXIT_CODE=$?
./run_nodeunit.sh
NODEUNIT_EXIT_CODE=$?

if [ $NODEUNIT_EXIT_CODE -ne 0 ]; then
	echo "!!! SOME SERVER SCRIPTS ARE FAILING NODEUNIT TESTS !!!"
	exit 1
fi

if [ $JASMINE_EXIT_CODE -ne 0 ]; then
	echo "!!! SOME CLIENT SCRIPTS ARE FAILING JASMINE TESTS !!!"
	exit 1
fi
