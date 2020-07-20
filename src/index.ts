import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import Debug from 'debug';
import * as Mustache from 'mustache';

interface IPackageJson {
    scripts: {
        [key: string]: string;
    };
}

export const installLinting = (cwd: string): void => {

    const debug = Debug('create-linting');

    debug(`cwd: ${cwd}`);

    const packageJsonPath = path.join(cwd, 'package.json');
    debug(`Reading package.json from ${packageJsonPath}`);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString()) as IPackageJson;

    packageJson.scripts.lint = 'npm run lint:src && npm run lint:test';
    packageJson.scripts['lint:src'] = 'eslint --ext ts --max-warnings 0 --ignore-pattern *.spec.ts src';
    packageJson.scripts['lint:test'] = 'eslint --ext ts --plugin jest --env jest/globals src/**/*.spec.ts';
    packageJson.scripts.pretest = 'npm run lint';

    debug(`Writing scripts to package.json.`);

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 4) + '\n');

    const packagesToInstall = [
        '@ionaru/eslint-config',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/eslint-plugin-tslint',
        'eslint',
        'eslint-plugin-import',
        'eslint-plugin-jest',
        'eslint-plugin-no-null',
        'eslint-plugin-prefer-arrow',
        'eslint-plugin-sonarjs',
        'tslint',
    ];

    const templateDirectory = path.join(__dirname, '..', 'templates');

    // The main render function.
    const renderTemplate = (templateName: string): void => {
        const template = fs.readFileSync(path.join(templateDirectory, templateName)).toString();
        debug(`${templateName}: Template loaded.`);

        const rendered = Mustache.render(template, undefined);
        debug(`${templateName}: Template rendered.`);

        const fileName = templateName.replace('.mustache', '');
        const writePath = path.join(cwd, fileName);
        debug(`${templateName}: Writing rendered template to ${writePath}.`);
        fs.writeFileSync(writePath, rendered);
    };

    // Render all the templates in the template folder.
    debug(`Reading template directory: ${templateDirectory}`);
    const templates = fs.readdirSync(templateDirectory);
    debug(`Templates directory read, starting render for ${templates.length} templates.`);
    for (const template of templates) {
        renderTemplate(template);
    }

    debug(`Installing packages.`);
    childProcess.execSync(`npm install -D --silent ${packagesToInstall.join(' ')}`, {cwd});
};
