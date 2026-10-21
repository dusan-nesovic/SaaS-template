# Using the template

This repository is a `dotnet new` template (`.template.config/template.json`). This file is not copied into new projects.

Install the template once, from this folder:

```bash
dotnet new install .
```

Create a new app (`-n` renames the solution, projects, namespaces and Docker names):

```bash
dotnet new saas -n MyApp --appTitle "My App" --googleClientId "1234-abc.apps.googleusercontent.com" -o ../MyApp
```

After changing the template, refresh the installed copy:

```bash
dotnet new install . --force
```

Template parameters: `-n` (solution and namespace name; also gives the Docker project name and the `<NAME>_DB` variable), `--appTitle` (brand name in the UI and emails; its first letter, upper-cased, is the logo mark), `--googleClientId`.
