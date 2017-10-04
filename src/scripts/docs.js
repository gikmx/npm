import PATH from 'path';
import { render as Mustache } from 'mustache';
import Git from 'nodegit';
import Out from '../out';
import Path from '../path';
import { $fromConfig, Package } from '../config';
import { $ } from '../tools';

/**
 * Generates documentation using **documentation.js**.
 * @module Docs
 * @memberof Scripts
 */
export default function Docs() {

    return $fromConfig()
        // Read main template from location specified on config
        .switchMap(function templateRead(config) {
            const path = PATH.resolve(config[Package.name].documentation.template);
            return $
                .fromFileRead(path)
                .map(content => ({ config, template: { path, content } }));
        })
        // Inject Config values to template
        .map(({ config, template }) => ({
            config,
            template: {
                path: template.path,
                content: Mustache(template.content, config),
            },
        }))
        .switchMap(function readmeInject({ config, template }) {
            const orig = PATH.resolve(config.directories.src);
            const command = [
                'npm --prefix', Path.root, 'run command:docs -- build',
                '--markdown-toc',
                '--format md',
                '--no-package',
                orig,
                // '>> ', dest,
            ].join(' ');
            return $
                .fromShell(`exec ${command}`)
                // TODO: When called from a submodule, stdout is populated with the
                //       redirection command, this hack removes that extra info.
                .map(([stdout]) => stdout.slice(stdout.indexOf('<!--')))
                .map(docs => ({ config, template, docs }));
        })
        // Write template file so it can be later extended with API docs
        .switchMap(function contentWrite({ config, template, docs }) {
            template.dest = PATH.resolve(config[Package.name].doc);
            return $
                .fromFileWrite(template.dest, [template.content, docs].join('\n'))
                .mapTo({ config });
        })
        // Add README to git stage
        .switchMap(({ config }) => $
            .from(Git.Repository.open(Path.cwd))
            .switchMap(repo => $
                .from(repo.index())
                .switchMap(index => $
                    .from(index.addByPath(PATH.normalize(config[Package.name].doc)))
                    .mapTo(index),
                )
                .switchMap(index => $.from(index.write())),
            )
            .mapTo(`Docs generated on ${config[Package.name].doc} and added to Git`),
        )
        .subscribe(Out.good, Out.error);
}
