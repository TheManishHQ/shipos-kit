# Implementation Rules

## Golden Rule: Follow the Reference Implementation

The `./reference` folder contains a **fully working implementation**. When implementing any task:

1. **ALWAYS check the reference implementation first** - Look in `./reference` folder for how the feature is implemented
2. **Match the logic exactly** - The reference implementation is proven to work, replicate its logic
3. **Verify imports and paths** - Use the exact same import paths and package aliases as the reference
4. **Check configuration** - Ensure feature flags, config properties, and middleware match the reference
5. **Test integration points** - Verify that API routes, components, and utilities integrate the same way

## What You Can Change

You may:
- Improve UI/UX (better styling, animations, responsiveness)
- Optimize performance (better algorithms, caching strategies)
- Enhance error handling (more detailed messages, better recovery)
- Add helpful comments and documentation
- Refactor for better code organization (while keeping the same logic)

## What You Must NOT Change

You must NOT:
- Change the core logic flow if it works in the reference
- Use different libraries or packages than the reference
- Skip steps or simplify what the reference does
- Assume something works without checking the reference
- Change API contracts, types, or interfaces that exist in reference

## Implementation Checklist

For each task, follow this checklist:

### 1. Research Phase
- [ ] Find the relevant files in `./reference` folder
- [ ] Read all related components, pages, and API endpoints
- [ ] Understand the data flow and dependencies
- [ ] Note any configuration requirements
- [ ] Check for middleware or layout logic

### 2. Implementation Phase
- [ ] Create the same directory structure as reference
- [ ] Copy type definitions and schemas exactly
- [ ] Implement the same API procedures and routes
- [ ] Build components with the same props and logic
- [ ] Use the same hooks and utilities
- [ ] Add the same middleware checks if needed

### 3. Verification Phase
- [ ] Compare your implementation with reference side-by-side
- [ ] Verify all imports resolve correctly
- [ ] Check that types match exactly
- [ ] Test the feature works end-to-end
- [ ] Ensure no TypeScript errors

### 4. Commit Phase
- [ ] Commit after each subtask completion
- [ ] Write descriptive commit messages
- [ ] Mark task as complete in tasks.md
- [ ] Push to GitHub

## Common Pitfalls to Avoid

1. **Import Path Mismatches**
   - Reference uses: `@repo/config`
   - Don't use: `@shipos/config` (unless that's what reference uses)

2. **Missing Middleware Configuration**
   - Always check if the reference adds routes to pathsWithoutLocale
   - Check if feature requires session checks in middleware

3. **Incomplete Feature Flags**
   - Reference often checks config.users.enableX or config.ui.X.enabled
   - Don't forget these checks in pages and layouts

4. **API Router Integration**
   - Reference modules are exported and added to main router
   - Don't forget to add your router to the main router object

5. **Type Mismatches**
   - Reference types come from specific packages
   - Use the exact same type imports and definitions

## Example: Following Reference for Contact Form

### Reference Structure
```
reference/
├── apps/web/
│   ├── app/(marketing)/[locale]/contact/page.tsx
│   └── modules/marketing/home/components/ContactForm.tsx
└── packages/api/
    └── modules/contact/
        ├── procedures/submit-contact-form.ts
        ├── router.ts
        └── types.ts
```

### What to Match
1. ✅ Use same schema validation (zod with specific rules)
2. ✅ Same form fields (name, email, message)
3. ✅ Same mutation hook pattern (orpc.contact.submit.mutationOptions())
4. ✅ Same error handling (try/catch with form.setError)
5. ✅ Same success state (form.formState.isSubmitSuccessful)
6. ✅ Same config check (config.contactForm.enabled)

### What You Can Improve
1. ✅ Better loading animations
2. ✅ More detailed error messages
3. ✅ Improved form validation feedback
4. ✅ Better mobile responsiveness

## When in Doubt

If you're unsure about any implementation detail:
1. Check the reference implementation first
2. If reference is unclear, ask the user
3. Never guess or assume - the reference is the source of truth

## Remember

> The reference implementation is **working code**. Your goal is to replicate its functionality while potentially improving the user experience. Don't reinvent the wheel - follow the proven patterns!
