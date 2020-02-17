/* global test:true, expect:true, describe: true */
import $fromScriptBuild from '../src/scripts/build';


describe('The build script', () => {

    test('should return an observable', () => {
        expect(typeof $fromScriptBuild).toBe('function');
        expect(typeof $fromScriptBuild().subscribe).toEqual('function');
    });

    test('Should return status: 0', (done) => {
        $fromScriptBuild().subscribe(
            ok => expect(ok.status).toBe(0),
            (err) => { throw err; },
            done,
        );
    });

});
