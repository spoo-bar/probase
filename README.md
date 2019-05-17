# ProBase

This extension is meant to help database code management for ProArc

## Features

* Go to Definition and Peek Definition for tables
* Load tables and columns documentation as intellisense
* Configure whether to source definitions from MS SQL or Oracle
* Replace SQL parameter values from Traceview logs

## Configuration

### Settings
Before using the extension it is recommended to set up the following.
Go to `File > Preferences > Settings` and in the settings for probase configure these values
* code.dbscriptsFolderPath - The path to the DbScripts repository. Ensure you have the latest changes.
> eg C:\Code\Git\DbScript
* code.sqlSource - Whether to use MS SQL source or Oracle source.

![settings image](images/settings.png "Settings image")

## Requirements

   Azure Data Studio version should be higher than 1.7

   VS Code version should be higher than 1.33.0

