# About This Documentation

This document explains the documentation structure and how to navigate it.

## Documentation Files Overview

### Status & Overview Documents

1. **[CURRENT_STATUS.md](../CURRENT_STATUS.md)** (Root level)

    - **Purpose:** Honest, direct assessment of project status
    - **Audience:** Anyone evaluating this project
    - **Content:** What works, what doesn't, realistic expectations
    - **Read this:** Before doing anything else

2. **[Implementation Status](./implementation-status.md)** (Docs folder)

    - **Purpose:** Detailed technical breakdown
    - **Audience:** Developers working on the project
    - **Content:** Task-by-task completion status, verification steps
    - **Read this:** When you need technical details

3. **[README.md](../README.md)** (Root level)

    - **Purpose:** Project introduction and quick links
    - **Audience:** GitHub visitors, new developers
    - **Content:** Tech stack, quick start, project structure
    - **Read this:** For a quick overview

4. **[docs/README.md](./README.md)** (Docs folder)
    - **Purpose:** Documentation index
    - **Audience:** Developers using the documentation
    - **Content:** Links to all documentation files
    - **Read this:** To navigate the documentation

## Documentation Structure

### For New Users

**Start here:**

1. [CURRENT_STATUS.md](../CURRENT_STATUS.md) - Understand what you're getting into
2. [Quick Start Guide](./quick-start.md) - Get the project running
3. [Implementation Status](./implementation-status.md) - See what's actually working

### For Developers

**Building features:**

1. [Development Guide](./development.md) - Development workflow
2. [Setup Guide](./setup.md) - Detailed setup instructions
3. Feature-specific docs (see below)

**Understanding the codebase:**

1. [Authentication](./authentication.md) - Auth system
2. [Database](./database.md) - Database schema
3. [Configuration](./configuration.md) - Config system
4. Other feature docs

### For Contributors

**Contributing to the project:**

1. [CURRENT_STATUS.md](../CURRENT_STATUS.md) - See what needs work
2. [Implementation Status](./implementation-status.md) - Check task status
3. [Tasks List](../.kiro/specs/shipos-kit/tasks.md) - Full task breakdown

## Feature Documentation

### Core Systems

-   [Authentication](./authentication.md) - better-auth integration, all auth methods
-   [Database](./database.md) - Prisma schema, models, queries
-   [Configuration](./configuration.md) - Feature flags, settings
-   [User Management](./user-management.md) - Profile, avatar, sessions

### Infrastructure

-   [Email](./email.md) - React Email templates, Resend integration
-   [Storage](./storage.md) - S3-compatible file storage
-   [Internationalization](./i18n.md) - next-intl, multi-language support

### Development Tools

-   [Biome](./biome.md) - Linting and formatting
-   [TypeScript](./typescript.md) - TypeScript configuration
-   [Utilities](./utilities.md) - Helper functions
-   [Logging](./logging.md) - Structured logging

### Guides

-   [Quick Start](./quick-start.md) - Get started quickly
-   [Setup Guide](./setup.md) - Detailed installation
-   [Development Guide](./development.md) - Development workflow

## Documentation Philosophy

### Honesty First

All documentation is **brutally honest** about:

-   What's implemented vs. what's not
-   What works vs. what's broken
-   What's production-ready vs. what's experimental

### No Aspirational Documentation

We document **what exists**, not what we plan to build:

-   ✅ If a feature is documented, it's implemented
-   ❌ If a feature isn't implemented, we say so clearly
-   🚧 If a feature is partial, we explain what's missing

### Verification Steps

Many docs include verification steps:

-   How to test if something works
-   What to expect when you run it
-   How to troubleshoot issues

## Documentation Maintenance

### When Code Changes

When code is added or modified:

1. Update the relevant feature documentation
2. Update [Implementation Status](./implementation-status.md) if needed
3. Update [CURRENT_STATUS.md](../CURRENT_STATUS.md) if completion % changes
4. Update [Tasks List](../.kiro/specs/shipos-kit/tasks.md) to mark tasks complete

### When Features Are Added

When a new feature is completed:

1. Create feature documentation (if major)
2. Update [Implementation Status](./implementation-status.md)
3. Update [CURRENT_STATUS.md](../CURRENT_STATUS.md)
4. Update [README.md](../README.md) if it affects the overview
5. Mark tasks complete in [Tasks List](../.kiro/specs/shipos-kit/tasks.md)

### When Features Are Removed

When a feature is removed or deemed unnecessary:

1. Remove or update feature documentation
2. Update [Implementation Status](./implementation-status.md)
3. Update [CURRENT_STATUS.md](../CURRENT_STATUS.md)
4. Mark tasks as REMOVED in [Tasks List](../.kiro/specs/shipos-kit/tasks.md)

## Finding What You Need

### "I want to know if this project is right for me"

→ Read [CURRENT_STATUS.md](../CURRENT_STATUS.md)

### "I want to get started quickly"

→ Read [Quick Start Guide](./quick-start.md)

### "I want to understand what's implemented"

→ Read [Implementation Status](./implementation-status.md)

### "I want to learn how authentication works"

→ Read [Authentication](./authentication.md)

### "I want to set up email sending"

→ Read [Email](./email.md)

### "I want to configure file uploads"

→ Read [Storage](./storage.md)

### "I want to add a new language"

→ Read [Internationalization](./i18n.md)

### "I want to contribute"

→ Read [CURRENT_STATUS.md](../CURRENT_STATUS.md) and [Implementation Status](./implementation-status.md)

### "I want to see what needs to be built"

→ Read [Tasks List](../.kiro/specs/shipos-kit/tasks.md)

## Documentation Quality Standards

### All Documentation Should:

1. **Be accurate** - Reflect the actual codebase
2. **Be honest** - Clearly state what works and what doesn't
3. **Be practical** - Include code examples and usage
4. **Be verifiable** - Include steps to test/verify
5. **Be maintained** - Updated when code changes

### All Documentation Should NOT:

1. **Be aspirational** - Don't document planned features
2. **Be vague** - Be specific about implementation status
3. **Be outdated** - Keep in sync with code
4. **Be incomplete** - Cover all aspects of a feature
5. **Be misleading** - Don't oversell capabilities

## Questions?

If you can't find what you need:

1. Check the [docs/README.md](./README.md) index
2. Search the documentation folder
3. Check [CURRENT_STATUS.md](../CURRENT_STATUS.md) for known limitations
4. Open a GitHub issue

## Last Updated

November 27, 2024
