const FS = require('../index')

const fileContent = 'Mutexes are FUN!'

/**
 * If the fs was switched very fast mutex error would occur. These test illustrate the issues which are worse on chrome but also occur on firefox.
 */
describe("fs.reinit", () => {
    it("fast", () => {
        const fs = new FS()
        fs.init('oof')
        fs.init('oof')
        fs.init('oof')
        fs.init('oof')
        fs.init('oof', undefined, () => {
            fs.writeFile('/testfile', fileContent, undefined, () => {
                fs.readFile('/testfile', { encoding: 'utf8' }, (contents) => {
                    expect(fileContent).toEqual(contents)
                })
            })
        })
    });
    it("fast promises", async () => {
        const fs = new FS().promises
        fs.init('oof')
        fs.init('oof')
        fs.init('oof')
        fs.init('oof')
        // await the last so that the write call doesn't fail
        await fs.init('oof')
        fs.writeFile('/testfile', fileContent)
        expect(fileContent).toEqual(await fs.readFile('/testfile', { encoding: 'utf8' }))
    });
    it("fast promises await", async () => {
        const fs = new FS().promises
        await fs.init('oof')
        await fs.init('oof')
        await fs.init('oof')
        await fs.init('oof')
        await fs.init('oof')
        await fs.writeFile('/testfile', fileContent)
        expect(fileContent).toEqual(await fs.readFile('/testfile', { encoding: 'utf8' }))
    });
});
