# Contributing to Promotions Platform

First off, thank you for considering contributing to the Promotions Platform! 

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples**
* **Describe the behavior you observed and what you expected**
* **Include screenshots if applicable**
* **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List some examples of how it would be used**

### Pull Requests

* Fork the repo and create your branch from `main`
* If you've added code that should be tested, add tests
* Ensure the test suite passes
* Make sure your code lints
* Update documentation as needed
* Follow the existing code style

## Development Process

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/promotions.git
   cd promotions
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/bug-fix
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Make Your Changes**
   - Write clean, maintainable code
   - Follow TypeScript best practices
   - Add comments where necessary
   - Update documentation

5. **Test Your Changes**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

7. **Push to GitHub**
   ```bash
   git push origin feature/my-new-feature
   ```

8. **Open a Pull Request**
   - Go to the repository on GitHub
   - Click "Pull Request"
   - Provide a clear description of your changes
   - Link any related issues

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props
- Follow React best practices

### General
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Keep lines under 100 characters when reasonable
- Use meaningful commit messages

## Project Structure

```
promotions/
├── frontend/         # React frontend
├── backend/          # Node.js backend
├── shared/           # Shared code
├── docs/             # Documentation
└── README.md
```

## Testing

- Write unit tests for new features
- Ensure existing tests pass
- Add integration tests for API endpoints
- Test across different browsers (for frontend)

## Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation
- Include code examples

## Community

- Be respectful and inclusive
- Help others when you can
- Provide constructive feedback
- Follow the code of conduct

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

Thank you for contributing! 🎉
