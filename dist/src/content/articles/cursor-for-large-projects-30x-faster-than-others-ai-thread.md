---
title: "Cursor For Large Projects|30x Faster than Others | AI Thread"
excerpt: "by Thierry S."
publishedDate: "2025-03-21"
category: "AI"
readTime: "7"
image: "https://cdn-images-1.medium.com/max/1200/0*YyZc7Qa2Wtr_HWEJ"
---

### by Thierry S.

With all this “vibe” coding, many devs think that [Cursor](https://www.cursor.com/) and [Claude](https://www.anthropic.com/news/introducing-claude) are just for prototypes. While Cursor is great at writing new code, it’s also very effective at structuring code, standardizing, refactoring, and maintaining large projects. It’s super exciting since you can build software 5–30x faster.

This guide shares my workflow for Cursor and how to use it for large projects.

## Cursor — Edit, Test Loop

The key to effective AI usage is a good edit and test loop. You typically want the AI to write the code, write the test, and then execute this test while fixing any bugs it finds. Only after the AI has completed these steps do I typically start to review.

Let’s go over the basics of this edit loop.

## Step 1 — Cursor Setup/Agent mode

You want to use the Agent mode (cmd + I) + Claude 3.7 sonnet. (note the little dropdown bottom left). The agent mode will continuously call Claude until the goal has been achieved. So, it will search files, look up more context, run tests, install packages, etc.

## Step 2 — Docs for AI

The example above is a bit simplified. Typically, you want a docs folder teaching the AI best practices for the common tasks you do on your codebase. For instance

- How do I write a test?
- How do I set up a new database model and apply migrations?
- How do I create a new controller/ state layer etc?

We keep a separate docs folder for AI. It looks something like this.

It’s pretty similar to how you would train your engineering team. But we keep separate AI docs so it’s easy to course-correct AI when it gets something wrong.

## Step 3 — Enable Yolo mode in the settings

You want to enable Yolo mode so Cursor can run tests without asking for confirmation. Optionally you can allow only the commands you frequently use for running tests, etc.

## Step 4 — Cursor/Claude runs the test (This is the key part)

This is the key part. You want to tell Cursor to run the test. Because it’s running the test, it will detect mistakes it made while generating the code.

Of course, AI isn’t perfect; it will miss some things, but with this testing loop, the results are far better than just generating code.

## For frontend/ other platforms

I’m using Cursor primarily for Golang. But you can set up a system similar to front-end development. Check out BrowserTools by [@tedx_ai](https://x.com/tedx_ai) for screenshots and console integrations. You can find more MCP options here: [https://cursor.directory/mcp](https://cursor.directory/mcp). I haven’t seen good MCP options yet for Android, Swift, Flutter, and React Native development.

> || We will be covering MCP in a few days! its hotter than Sahara Summers

## Cursor — Project Files

The edit/test loop is the key to effective cursor usage. Another important workflow is creating project files.

## Project Steps

Here’s an example of a project file for creating message Bookmarking/reminders

Note how each step references the relevant docs. You could also do this with cursor rules, but I prefer to specify the right doc most of the time manually.

## Project Validation Check

Now when you have this project file. You can also use AI to check your spec for issues. Our project-check file will review the models to see if the instructions clarify the primary key. For controller steps, it will ask you to clarify the desired permissions. So you can use AI to validate the instructions to the AI, which is kinda crazy. 🙂

## Generating Project Files

Of course you can also use AI to generate your project description. You give it an example project description file and ask it to generate something similar for a different feature. Grok is probably the best model for this at the moment. You can combine it with deepsearch to further clarify your project needs as well.

> **Integrate LLMs fast!** Our UI components are perfect for any AI chatbot interface right out of the box. Try them today and launch them tomorrow!

## Git is Your Checkpoint — Rinse & Repeat

Cursor has a built-in checkpoint system but I prefer not to use it. Git works better for me. To reset your workspace you can use:

```shell
git stash --include-untracked # stash all changes including things that are not tracked  
git stash pop # recover the last stash  
git clean -fd # remove all files that are not committed (careful with this one)
```

So, if Claude goes off the tracks, simply reset and try again. This is also why you keep a project file. It makes it very easy to start again with different docs/ best practices etc.

## Other Cursor & Claude tips

When working with Cursor we learned that taking specific steps and applying certain tips dramatically improves the quality of the output generated by Cursor.

## Limit the steps in a Cursor Composer Window

Sometimes, I’ll run 5–7 steps in a single composer window. The longer you keep the conversation going the more likely Claude will forget part of the instructions. So create a new cursor agent window at times.

## Cursor Setup Tips

- In the Cursor settings, you can add docs. This is particularly useful for less frequently used packages, which Claude by default doesn’t know much about
- MCP integration with linear or other tools is pretty cool
- / add open files to context is very convenient

## Goland

Cursor is amazing for its AI features. I run Goland side by side for debugging, refactoring, and general editor design. You will probably also need to do that for things like iOS/Android development, etc., where an editor with strong tooling is hard/impossible to fully replace.

## Cursor Tools

There is a cool cursor tools project [https://github.com/eastlondoner/cursor-tools](https://github.com/eastlondoner/cursor-tools) by @EastlondonDev. Cursor tools enables browser usage, large context windows, docs, and planning capabilities.

## Cursor Rules

You can add rules to Cursor in the settings, which enables you to automatically include docs. As an example:

There is a directory of [common cursor rules.](https://cursor.directory/)

## Code Standardization

It feels almost human because if you use confusing names, duplicate implementations, etc., AI will get confused. So, you want to have clean, standardized code to have the highest success rate with AI.

## Check Everything

If you assign work to a junior engineer, you would double-check everything. You should treat AI similarly and know what every bit of the code does.

## Refactoring, Docs & Search

It’s not just code generation. You can also use Cursor & Claude for docs, search and refactoring.

## Refactoring Example

You can make complex adjustments, to hundreds of files at once. If it’s a simple change I still prefer Goland’s refactoring tools. But for complex changes this can save days of work.

## Search & Docs

Every large codebase eventually has parts that are hard to understand. You can ask Cursor to write docs for you to help explain it.

## Tech & Understanding

When you run into some part of the codebase where you don’t understand the underlying tech, you also can use it as an alternative to Google/Stackoverflow

## Conclusion

Cursor is an amazing tool not just for prototypes but also for maintaining large projects. To use it effectively:

- Setup a generate/ test/ run test cycle. So the AI self-corrects
- Create a project plan and have the AI check and improve this plan
- Finetune your Cursor setup and get used to the different workflow
- It’s not just code generation. You can refactor, create docs and use it as a powerful search engine

With the right setup, you can work 5–30 times faster. I especially love that, as an engineer, you can focus more on the harder problems while the AI generates all the basics. I hope this guide helps

> I Would Like to know how much you are interested in MCP and Vibe Coding. I can come with a series of episodes | Response ‘Hail AI!’
