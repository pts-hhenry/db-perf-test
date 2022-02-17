const packageJson = require('../package.json');

const checkFloatingDependencies = () => {
  process.stdout.write('[Check floating dependencies]\n');
  const { dependencies, devDependencies } = packageJson;
  const allDependencies = {
    ...dependencies,
    ...devDependencies
  };

  const unpinnedDependencies = [];

  Object.entries(allDependencies).forEach((dependency) => {
    const [, version] = dependency;
    const regExp = RegExp(/^(~|\^|=|>|<)/);

    if (regExp.test(version)) {
      unpinnedDependencies.push(dependency);
    }
  });

  if (unpinnedDependencies.length) {
    process.stderr.write(
      "Floating dependencies are not allowed in this project's package.json:\n"
    );
    unpinnedDependencies.forEach((dependency) => {
      process.stderr.write(`${dependency.join(': ')}\n`);
    });

    process.exit(1);
  }

  process.stdout.write('All dependencies pinned!\n');
};

checkFloatingDependencies();
