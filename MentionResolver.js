class MentionResolver {
  setResolver(resolverCallback) {
    this.callback = resolverCallback;
  }

  resolve(richText) {
    if (this.callback) {
      return this.callback(richText);
    }
  }
}

module.exports = new MentionResolver();
