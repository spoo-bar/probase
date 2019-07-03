# Change Log
All notable changes to the "probase" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Unreleased
### Added 
- Support to view TraceLogs from within the extension
- Added command to remove database name from SQL

### Changed
- The extension now activates as soon as Azure Data Studio opens (earlier would trigger on commands or on SQL documents)
- On replacing SQL parameters, the SQL is now formatted based on the settings

## 1.0.0
### Added
- Support for Go to Definition and Peek Definition
- Support for intellisense on hover
- Support to replace SQL parameters from Traceview log