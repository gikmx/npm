# ROADMAP

## v0.0.1

- __@gik/tools-checker__:  A simple type-checker. (already exists as `validate`)

- __@gik/tools-mapper__: Reduces multiple-leveled object into a single one. (already exists ad part of the `music` repository).

- __@gik/tools-replacer__: Allows the replacing of strings inside objects. (Depends on @gik/tools-mapper)

- __@gik/tools-pather__: Allows the creating of path objects. (Depends on @gik/tools-replacer)

- __@gik/tools-streamer__: Allows the usage of reactive extensions. (WIP on Techlap)

- __@gik/tools-xtreamer__: Allos the usage of reactive extensions (xstream on music back)

- Copy files over the `templates`folder (replacing items inside `{{}}` in the process)
  obtaining the needed information from package.json.

- Move documentation generation scripts from `feliz` projects and use them as first
  attempt.

## v0.0.2

- Create a generation script for building with babel.

- Completely remove the `feliz.hooks` project and instead use it from here. This
  means separating and/or creating the following libraries:
