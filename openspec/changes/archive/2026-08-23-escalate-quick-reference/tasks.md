## 1. Schema Extensions

- [ ] 1.1 Update troubleshooting-frontmatter schema to formally support an optional featured boolean field.
- [ ] 1.2 Update decision-frontmatter schema to formally support an optional featured boolean field.

## 2. Docs Compiler Injection logic

- [ ] 2.1 Modify generate-durable-indexes tool to extract any document paths marked as featured during target collection iterations.
- [ ] 2.2 Enhance the resolver generator function. If the parsed blurb is populated and contains the Quick Reference target header, safely append the generated list of featured markdown links to the bottom block of that header segment before restoring.

## 3. Verify System Behavior

- [ ] 3.1 Tag an arbitrary test file within troubleshooting with the featured true tag and execute generate-durable-indexes manually to visually confirm injection succeeds against the index file.
- [ ] 3.2 Add the feature usage documentation inside MAINTENANCE docs.
- [ ] 3.3 Ensure that mock generation natively clones the logic schema using the associated script runner.

## 4. Closing Loop

- [ ] 4.1 Perform task-closeout session extraction summarizing the schema and injection successes.
- [ ] 4.2 Execute learning-distill to capture the new programmatic knowledge documentation strategy durably to history logs.
