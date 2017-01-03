# Change Log

## [0.3.0] - 2017-01-03

### Added
- make the babel presets and plugins configurable
- snapshot testing for react
- mokamok.forceReload(name) to force modules to be reloaded in watch mode
- coverage-exclude config option
- babel-presets configuration options
- babel-plugins configuration options
- update-snapshots configuration options
- sinon-stub-promise support
- env variable TRACE_MOCK={filter} to list mocks
- wathc mode key commands: a - run all tests, u - update snapshots

### Changed
- replace react node reRender() with the setProps() function
- babel preset is no longer a dependency, automatically loads the latest preset
- the way how the node_moduels forlder is ignored in the glog in order to
  improve performance
- use fs.watch on darwin to improve watch performance

### Fixed
- error when react node toHTML() converted all tag names to upper case
- error when jsdom reload confused react, jsdom is not reloaded after the tests
  any more
- error when babel import is housted over mokamok.mock()
- error when coverage report was not fully generated
- error when momamok.mock() can't mock modules in the node_module folder
- error when webpack css loader fails in the tests
- error when mocked modules was not uncached after the test

## [0.2.1] - 2016-10-21

### Added
- new documentation

## [0.2.0] - 2016-10-21

### Added
- sinon sandboxing support
- react support


## [0.1.0] - 2016-10-05

### Added
- coverage report
- configurable test folder name
- configurable babel support

### Changed
- precompile source files
- run all test in one go
- update documentation


## [0.0.4] - 2016-10-01

### Fixed
- error when watch quits on initial run with failing test
- error when source file was not reloaded in watch mode


## [0.0.3] - 2016-09-29

### Fixed
- add change log
- correct the license file
- add missing description and repository fields to the package.json file
- update license and author filed in the package.json file
- add missing commas in the help message and the README.md file


## [0.0.2] - 2016-09-29

### Fixed
- remove the unneeded console.log
- test runner to copy package.json over
- test runner to log errors
- test runner to remove .tmp folder after successful run
- babel require hook not to ignore mokamok files in node modules folder
- use the latest babel preset
- test runner ignores test files under node_modules
- rename test folders


## [0.0.1] - 2016-09-28

### Added
- test runner
- automock functionality
- watch functionality
- jsdom support
