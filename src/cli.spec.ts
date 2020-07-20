import * as index from './index';

describe('test CLI', () => {

    jest.spyOn(index, 'installLinting').mockImplementation();

    it('run with no command argument', () => {
        expect.assertions(1);

        // Set command argument.
        process.argv = ['', ''];

        // Run command.
        jest.isolateModules(() => {
            require('./cli');
        });
        expect(index.installLinting).toBeCalledWith('.');
    });

    it('run with one command argument', () => {
        expect.assertions(1);

        // Set command argument.
        process.argv = ['', '', 'some-folder'];

        // Run command.
        jest.isolateModules(() => {
            require('./cli');
        });
        expect(index.installLinting).toBeCalledWith('some-folder');
    });
});
