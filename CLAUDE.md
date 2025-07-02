# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build & Development
- `npm run compile` - Compile TypeScript to JavaScript (outputs to `build/` directory)
- `npm run prepare` - Runs automatically on install to compile the project

### Testing
- `npm test` - Run all tests using Jest
- `npm run test:watch` - Run tests in watch mode
- Test files match patterns: `**/test/**/*.js` and `**/?(*.)+(spec|test).js`

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run format-check` - Check code formatting with Prettier
- `npm run format-fix` - Auto-fix code formatting issues

### Releases
- `npm run release` - Interactive release using np
- `npm run release:patch/minor/major` - Create standard releases
- `npm run release:prepatch/preminor/premajor/prerelease` - Create pre-releases

## Architecture Overview

This is a CLI debugging tool for Shardus applications that provides network-wide debug data collection capabilities.

### Entry Points
- **CLI Binary**: `bin/index.js` - Uses Caporal framework for command parsing
- **Main Export**: `index.js` - Exports library functions for programmatic use

### Core Structure
```
src/
├── commands.js    # CLI command definitions (get, collect, combine)
├── actions.js     # Command handler implementations
└── lib/          # Core functionality
    ├── get.js    # Downloads debug data from single instance
    ├── collect.js # Collects debug data from entire network
    ├── combine.js # Combines logs (not yet implemented)
    └── utils.js   # Shared utilities
```

### Key Concepts

1. **Debug Data Collection**: The tool downloads compressed debug archives from Shardus nodes via HTTP endpoints:
   - `/debug` - Returns tar.gz debug data from a single node
   - `/nodelist` - Returns list of all nodes in the network

2. **Network Discovery**: When using `collect` command, the tool:
   - Fetches the node list from any instance
   - Iterates through all nodes downloading their debug data
   - Saves each node's data in separate directories

3. **Stream Processing**: Uses Node.js streams for efficient handling of large debug archives without loading them entirely into memory.

### Important Implementation Details

- The project is configured for TypeScript but currently only contains JavaScript files
- All async operations use Promises (no callbacks)
- HTTP requests use the `got` library
- Archive extraction uses the `tar` library with streaming
- Error handling continues on failure for network-wide collection (doesn't stop if one node fails)

### Testing Approach
- Uses Jest with comprehensive test coverage requirements (55-60% minimum)
- Tests are located in `test/` directory
- Mock HTTP responses and file system operations in tests

### Code Style
- ESLint with recommended rules + security plugin
- Prettier formatting: single quotes, no semicolons, 120 char lines
- Follow existing patterns in the codebase