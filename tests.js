/*
  It's a bit novel, I suppose, writing a testing framework by hand and running on the client,
  but a CI environment and RUM seems too much for this at the moment.
*/

const SUCCESS = '.';
const FAILURE = 'F';

class TestError {
  constructor(description) {
    this.description = description;
  }
}

class Test {
  constructor() {
    this.failures = [];
    this.tests = [];
  }

  assert(description, callback) {
    this.tests.push(() => {
      const result = callback();
      if (result) return true;

      this.failures.push(new TestError(description));
    });
  }

  run() {
    this.tests.forEach(test => test());

    const prefix = (this.failures.length === 0) ? '🎊' : '❌';
    console.log(`${prefix} Test Summary: ${this.tests.length - this.failures.length}/${this.tests.length} passed`);

    this.failures.forEach((failure) => {
      var failureMessage = ` - ${failure.description}`;
      console.log(failureMessage);
    });
  }
}

const tests = new Test();

tests.assert('Email link is decoded and embedded', () => {
  const emailLinkElement = document.getElementById('email');
  return !!emailLinkElement.href.match(/mailto:(.+)$/);
});

tests.run();
