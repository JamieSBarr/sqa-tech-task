# sqa-tech-task

I have included two separate implementations in this repo:

- The first uses the Cucumber runner, Axios for an HTTP client and Chai for the assertion library. Quite old school these days, but lightweight, efficient and well-known.
- The second uses a library called [`playwright-bdd`](https://github.com/vitalets/playwright-bdd) which allows the use of `.feature` files but also access to all Playwright's features as a test runner and library. I'm a big fan of this, as I think Playwright is superior as a runner and has lots of great features out of the box. It can be used for API testing without install browsers, so it's quick and lightweight.

Both implementations use the [same feature file](./src/features/agify.feature).

## CI & reporting

- I have both sets of tests running on merge to main
- Reports (both runners' native reporters) are uploaded to GCS and linked in the workflow run step summary. [Here's an example](https://github.com/JamieSBarr/sqa-tech-task/actions/runs/18504350599).

## Tooling

- I am using `pnpm` as a package manager
- [`mise`](https://mise.jdx.dev/) is used to manage tool versions:
  - node: 22.16.0
  - pnpm: 10.11.1
