const core = require('@actions/core');
const fs = require('fs');
const archiver = require('archiver');

function createZip(patterns, target, cwd) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(target);
    const archive = archiver('zip', {zlib: {level: 9}});

    archive.on('error', (err) => reject(err));
    output.on('close', () => resolve());
    archive.pipe(output);

    for (let pattern of patterns) {
      archive.glob(pattern, {cwd: cwd});
    }
    archive.finalize();
  });
}

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const patterns = core.getInput('glob').split(' ');
        const target = core.getInput('target');
        const cwd = core.getInput('cwd');

        await createZip(patterns, target, cwd);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
